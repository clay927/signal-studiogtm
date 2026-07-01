import { NextRequest, NextResponse } from "next/server";
import { listConnectors, upsertConnector } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const client = new URL(req.url).searchParams.get("client");
  if (!client) return NextResponse.json({ ok: false, error: "missing client" }, { status: 400 });
  try {
    const connectors = await listConnectors(client);
    return NextResponse.json({ ok: true, connectors });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, connectors: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: { client?: string; connectorId?: string; enabled?: boolean; secret?: string; apiKey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!body.client || !body.connectorId) {
    return NextResponse.json({ ok: false, error: "missing client or connectorId" }, { status: 400 });
  }
  try {
    await upsertConnector(body.client, body.connectorId, {
      enabled: body.enabled ?? false,
      secret: body.secret,
      apiKey: body.apiKey,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}
