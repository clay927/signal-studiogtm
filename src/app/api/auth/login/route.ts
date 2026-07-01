import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session-token";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid request" }, { status: 400 });
  }
  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
  }
  try {
    const u = await getUserByEmail(body.email);
    if (!u || !u.password_hash || !verifyPassword(body.password, u.password_hash)) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }
    if (u.status !== "active") {
      return NextResponse.json({ ok: false, error: "This account is deactivated. Contact your admin." }, { status: 403 });
    }
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
    return NextResponse.json({ ok: false, error: "Sign-in is temporarily unavailable" }, { status: 503 });
  }
}
