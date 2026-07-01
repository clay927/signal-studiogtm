import { NextRequest, NextResponse } from "next/server";
import { listEvents, eventCounts, resetClient } from "@/lib/db";

export const runtime = "nodejs";

// Admin: reset a client's ingested data (events + connectors + settings).
// Guarded by a key so it can't be triggered casually.
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const client = url.searchParams.get("client");
  const key = url.searchParams.get("key");
  const expected = process.env.RESET_KEY || "signal-admin-reset-2026";
  if (key !== expected) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!client) return NextResponse.json({ ok: false, error: "missing client" }, { status: 400 });
  try {
    await resetClient(client);
    return NextResponse.json({ ok: true, reset: client });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const client = new URL(req.url).searchParams.get("client");
  if (!client) return NextResponse.json({ ok: false, error: "missing client" }, { status: 400 });
  try {
    const [events, counts] = await Promise.all([listEvents(client, 25), eventCounts(client)]);
    return NextResponse.json({ ok: true, events, counts });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, events: [], counts: { total: 0, today: 0 } });
  }
}
