// Stateless signed session tokens. Uses Web Crypto (HMAC-SHA256) so the SAME
// code verifies in both the Edge middleware and Node route handlers.
// Secret: AUTH_SECRET if set, else derived from DATABASE_URL (always present on
// Vercel), so no extra env setup is strictly required.

export const SESSION_COOKIE = "signal_session";

interface SessionPayload {
  uid: string;
  exp: number; // epoch ms
}

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToString(s: string): string {
  const p = s.replace(/-/g, "+").replace(/_/g, "/");
  return atob(p);
}

async function getKey(): Promise<CryptoKey> {
  const raw = process.env.AUTH_SECRET || process.env.DATABASE_URL || "signal-dev-secret";
  const material = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw + "|signal-auth-v1"));
  return crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(data: string): Promise<string> {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return b64url(new Uint8Array(sig));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(uid: string, days = 30): Promise<string> {
  const payload: SessionPayload = { uid, exp: Date.now() + days * 86400000 };
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await sign(body);
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(b64urlToString(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
