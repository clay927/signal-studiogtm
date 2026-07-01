import { NextRequest, NextResponse } from "next/server";
import { getAllClientSettings, upsertClientSettings, disableClientConnectors, deactivateClientUsers } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await getAllClientSettings();
    return NextResponse.json({ ok: true, settings });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, settings: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: { client?: string; status?: string; serviceType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!body.client) return NextResponse.json({ ok: false, error: "missing client" }, { status: 400 });
  try {
    await upsertClientSettings(body.client, { status: body.status, serviceType: body.serviceType });
    let applied: string[] = [];
    if (body.status === "paused" || body.status === "inactive") {
      await disableClientConnectors(body.client);
      await deactivateClientUsers(body.client);
      applied = ["connectors disabled", "client users deactivated"];
    }
    return NextResponse.json({ ok: true, applied });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}
