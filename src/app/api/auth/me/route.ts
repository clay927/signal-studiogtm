import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Matches the middleware's local-dev bypass (never active in production).
  if (process.env.NODE_ENV !== "production" && process.env.PANDO_DEV_BYPASS === "1") {
    return NextResponse.json({
      ok: true,
      user: { id: "dev", name: "Dev Owner", email: "dev@localhost", role: "owner", clientAccess: [], status: "active" },
    });
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) return NextResponse.json({ ok: false, user: null }, { status: 401 });
  try {
    const u = await getUserById(session.uid);
    if (!u || u.status !== "active") return NextResponse.json({ ok: false, user: null }, { status: 401 });
    return NextResponse.json({
      ok: true,
      user: { id: u.id, name: u.name, email: u.email, role: u.role, clientAccess: u.client_access, status: u.status },
    });
  } catch {
    return NextResponse.json({ ok: false, user: null }, { status: 503 });
  }
}
