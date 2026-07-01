import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getConnectorSecret, insertWebhookEvent, touchConnector } from "@/lib/db";

export const runtime = "nodejs";

// Inbound webhook receiver: tools (Orum, Smartlead, HeyReach, …) POST here.
// URL shape: /api/webhooks/{provider}?client={clientId}
// Verifies the signature against the signing secret saved in the Connectors
// panel (stored in the database), then persists the event.

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Orum: header "x-webhook-signature: t={timestamp},s={base64 HMAC-SHA256}"
// signed value = "{timestamp}.{raw body}", HMAC-SHA256 with the signing key.
function verifyOrumSignature(
  rawBody: string,
  header: string | null,
  secret: string
): { ok: boolean; reason?: string } {
  if (!header) return { ok: false, reason: "missing signature header" };
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k?.trim(), v?.trim()];
    })
  );
  const timestamp = parts["t"];
  const signature = parts["s"];
  if (!timestamp || !signature) return { ok: false, reason: "malformed signature header" };

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!isFinite(ageSeconds) || ageSeconds > 300) return { ok: false, reason: "timestamp outside 5-minute window" };

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("base64");
  return timingSafeEqual(expected, signature) ? { ok: true } : { ok: false, reason: "signature mismatch" };
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;
  return NextResponse.json({
    ok: true,
    provider,
    message: `Signal webhook endpoint for "${provider}" is live. Send events via POST.`,
  });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;
  const client = new URL(req.url).searchParams.get("client") ?? "unknown";
  const rawBody = await req.text();

  // Signing secret: prefer the one saved in the Connectors panel (DB); fall
  // back to an env var for local/manual setups.
  let secret = "";
  try {
    secret = await getConnectorSecret(client, provider);
  } catch {
    // DB not reachable — fall through to env
  }
  if (!secret) {
    secret = process.env[`WEBHOOK_SECRET_${provider.toUpperCase()}`] || process.env.WEBHOOK_SECRET || "";
  }

  // Reliability first: we ALWAYS store the event (flagged verified true/false)
  // and return 200, so a missing/mismatched signature never silently drops real
  // call data. Unverified events are visibly tagged in the live feed.
  let verified = true;
  let verifyReason = "no secret configured (setup mode)";
  if (secret && provider === "orum") {
    const v = verifyOrumSignature(rawBody, req.headers.get("x-webhook-signature"), secret);
    verified = v.ok;
    verifyReason = v.ok ? "verified" : v.reason ?? "invalid";
  }

  let event: unknown = null;
  try {
    event = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  const eventType =
    (event && typeof event === "object" && ("event" in event || "type" in event)
      ? String((event as Record<string, unknown>).event ?? (event as Record<string, unknown>).type)
      : null) ?? provider;

  let stored = false;
  let eventId: number | null = null;
  try {
    eventId = await insertWebhookEvent({ provider, clientId: client, eventType, verified, payload: event });
    await touchConnector(client, provider);
    stored = true;
  } catch (err) {
    console.error("[webhook] store failed", err);
  }

  return NextResponse.json({
    ok: true,
    provider,
    client,
    verified,
    stored,
    eventId,
    note: stored ? "Event stored." : "Event received but not stored (database unavailable).",
  });
}
