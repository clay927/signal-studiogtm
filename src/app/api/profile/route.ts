import { NextRequest, NextResponse } from "next/server";
import { setUserAvatar } from "@/lib/db";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session-token";

export const runtime = "nodejs";

// Save the logged-in user's profile photo (a small data URL — the client
// resizes before uploading). Stored on the user record so it follows the
// login across devices.
const MAX_AVATAR_CHARS = 300_000; // ~220KB binary — far above a resized 256px JPEG

export async function POST(req: NextRequest) {
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  let body: { avatar?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  const avatar = body.avatar ?? "";
  if (avatar && !avatar.startsWith("data:image/")) {
    return NextResponse.json({ ok: false, error: "avatar must be an image data URL" }, { status: 400 });
  }
  if (avatar.length > MAX_AVATAR_CHARS) {
    return NextResponse.json({ ok: false, error: "image too large" }, { status: 413 });
  }
  try {
    await setUserAvatar(session.uid, avatar);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}
