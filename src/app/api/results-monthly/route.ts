import { NextRequest, NextResponse } from "next/server";
import { listResultsMonthly, upsertResultsMonthly } from "@/lib/db";

export const runtime = "nodejs";

// Monthly results rows entered going forward (July 2026+). Merged client-side
// over the static historical import; a DB row for the same client+month wins.
// Auth: the whole /api surface (except webhooks) is gated by middleware.

export async function GET() {
  try {
    const rows = await listResultsMonthly();
    return NextResponse.json({ ok: true, rows });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, rows: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: {
    clientId?: string;
    month?: string;
    closedWon?: number | null;
    newPipeline?: number | null;
    meetingsHeld?: number | null;
    meetingsScheduled?: number | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!body.clientId || !/^\d{4}-\d{2}$/.test(body.month ?? "")) {
    return NextResponse.json({ ok: false, error: "clientId and month (YYYY-MM) required" }, { status: 400 });
  }
  try {
    await upsertResultsMonthly({
      clientId: body.clientId,
      month: body.month!,
      closedWon: body.closedWon ?? null,
      newPipeline: body.newPipeline ?? null,
      meetingsHeld: body.meetingsHeld ?? null,
      meetingsScheduled: body.meetingsScheduled ?? null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}
