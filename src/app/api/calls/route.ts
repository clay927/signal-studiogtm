import { NextRequest, NextResponse } from "next/server";
import { listEventsByProvider } from "@/lib/db";
import { aggregateCalls } from "@/lib/calls";

export const runtime = "nodejs";

function rangeWindow(range: string | null): { since: Date | null; until: Date | null } {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const mondayStart = (d: Date) => {
    const day = (d.getUTCDay() + 6) % 7;
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
    const events = await listEventsByProvider(
      client,
      "orum",
      since ? since.toISOString() : null,
      until ? until.toISOString() : null
    );
    const { metrics, calls } = aggregateCalls(events);
    return NextResponse.json({ ok: true, metrics, calls });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, metrics: null, calls: [] });
  }
}
