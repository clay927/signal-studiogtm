import { NextRequest, NextResponse } from "next/server";
import { listEvents, eventCounts } from "@/lib/db";

export const runtime = "nodejs";

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
