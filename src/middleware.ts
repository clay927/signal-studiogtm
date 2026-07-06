import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";

// Public paths that never require a session:
// - /login, /set-password        : the auth screens
// - /api/auth/*                  : login / logout / set-password / me / invite
// - /api/webhooks/*              : tools POST here — MUST stay open so data flows
const PUBLIC_PREFIXES = ["/login", "/set-password", "/api/auth", "/api/webhooks"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Local-dev bypass: only honored outside production AND when explicitly set
  // in .env.local (gitignored). Lets `npm run dev` work without the prod DB.
  if (process.env.NODE_ENV !== "production" && process.env.PANDO_DEV_BYPASS === "1") {
    return NextResponse.next();
  }

  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"))) {
    return NextResponse.next();
  }

  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)"],
};
