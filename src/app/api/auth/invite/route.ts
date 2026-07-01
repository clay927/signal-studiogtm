import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, getUserById, setInviteToken } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";
import { randomToken } from "@/lib/password";

export const runtime = "nodejs";

// Generate a set-password (invite/reset) link for a user. Allowed for a
// logged-in owner, or with the admin key (used to bootstrap the first login).
export async function POST(req: NextRequest) {
  let body: { email?: string; key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }
  if (!body.email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

  const adminKey = process.env.RESET_KEY || "signal-admin-reset-2026";
  let authorized = body.key === adminKey;
  if (!authorized) {
    const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (session) {
      const me = await getUserById(session.uid);
      authorized = me?.role === "owner" && me.status === "active";
    }
  }
  if (!authorized) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  try {
    const u = await getUserByEmail(body.email);
    if (!u) return NextResponse.json({ ok: false, error: "No user with that email" }, { status: 404 });
    const token = randomToken();
    await setInviteToken(u.id, token);
    const origin = new URL(req.url).origin;
    return NextResponse.json({ ok: true, link: `${origin}/set-password?token=${token}` });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not create invite link" }, { status: 503 });
  }
}
