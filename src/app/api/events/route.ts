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

function rangeWindow(range: string | null): { since: Date | null; until: Date | null } {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const mondayStart = (d: Date) => {
    const day = (d.getUTCDay() + 6) % 7; // Monday = 0
    const m = new Date(d);
    m.setUTCDate(d.getUTCDate() - day);
    return m;
  };
  switch (range) {
    case "today":
      return { since: startOfDay, until: null };
    case "this_week":
      return { since: mondayStart(startOfDay), until: null };
    case "last_week": {
      const thisMon = mondayStart(startOfDay);
      const lastMon = new Date(thisMon);
      lastMon.setUTCDate(thisMon.getUTCDate() - 7);
      return { since: lastMon, until: thisMon };
    }
    case "this_month":
      return { since: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)), until: null };
    default:
      return { since: null, until: null };
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const client = url.searchParams.get("client");
  if (!client) return NextResponse.json({ ok: false, error: "missing client" }, { status: 400 });
  const { since, until } = rangeWindow(url.searchParams.get("range"));
  try {
    const [events, counts] = await Promise.all([
      listEvents(client, 50, since ? since.toISOString() : null, until ? until.toISOString() : null),
      eventCounts(client),
    ]);
    return NextResponse.json({ ok: true, events, counts });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, events: [], counts: { total: 0, today: 0 } });
  }
}
