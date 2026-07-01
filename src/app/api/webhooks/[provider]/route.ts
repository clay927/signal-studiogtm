import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

// Inbound webhook receiver: tools (Orum, Smartlead, HeyReach, …) POST here.
// URL shape: /api/webhooks/{provider}?client={clientId}
//
// This endpoint is LIVE: it accepts events and verifies Orum's HMAC signature
// when a secret is configured (env WEBHOOK_SECRET or WEBHOOK_SECRET_{PROVIDER}).
// Persisting events onto the dashboards requires a database — until that is
// connected, received events are acknowledged and logged (not yet stored).

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Orum: header "x-webhook-signature: t={timestamp},s={base64 HMAC-SHA256}"
// signed value = "{timestamp}.{raw body}", HMAC-SHA256 with the signing key.
function verifyOrumSignature(rawBody: string, header: string | null, secret: string): {
  ok: boolean;
  reason?: string;
} {
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

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("base64");

  return timingSafeEqual(expected, signature)
    ? { ok: true }
    : { ok: false, reason: "signature mismatch" };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ provider: string }> }
) {
  const { provider } = await ctx.params;
  return NextResponse.json({
    ok: true,
    provider,
    message: `Signal webhook endpoint for "${provider}" is live. Send events via POST.`,
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ provider: string }> }
) {
  const { provider } = await ctx.params;
  const client = new URL(req.url).searchParams.get("client") ?? "unknown";
  const rawBody = await req.text();

  const secret =
    process.env[`WEBHOOK_SECRET_${provider.toUpperCase()}`] || process.env.WEBHOOK_SECRET || "";

  let verification: { ok: boolean; reason?: string } = { ok: true, reason: "no secret configured (setup mode)" };
  if (secret && provider === "orum") {
    verification = verifyOrumSignature(rawBody, req.headers.get("x-webhook-signature"), secret);
    if (!verification.ok) {
      return NextResponse.json({ ok: false, error: verification.reason }, { status: 401 });
    }
  }

  let event: unknown = null;
  try {
    event = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON body" }, { status: 400 });
  }

  // Received. Persistence is added when the database is connected.
  console.log(
    `[webhook] provider=${provider} client=${client} verified=${verification.ok} bytes=${rawBody.length}`
  );

  return NextResponse.json({
    ok: true,
    provider,
    client,
    verified: verification.ok,
    stored: false,
    note: "Event received. Storage is connected in the next step to display it live.",
    receivedKeys: event && typeof event === "object" ? Object.keys(event as object) : [],
  });
}
