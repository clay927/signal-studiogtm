import { NextRequest, NextResponse } from "next/server";
import { getUserByInviteToken, setPassword } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session-token";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }
  if (!body.token || !body.password) {
    return NextResponse.json({ ok: false, error: "Token and password are required" }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
  }
  try {
    const u = await getUserByInviteToken(body.token);
    if (!u) return NextResponse.json({ ok: false, error: "This link is invalid or has expired" }, { status: 400 });
    await setPassword(u.id, hashPassword(body.password));
    const token = await createSessionToken(u.id);
    const res = NextResponse.json({ ok: true, user: { id: u.id, name: u.name, email: u.email, role: u.role } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Could not set password right now" }, { status: 503 });
  }
}
