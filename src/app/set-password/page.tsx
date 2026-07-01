"use client";

import { useEffect, useState } from "react";

export default function SetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (password !== confirm) return setError("Passwords don't match");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.assign("/");
      } else {
        setError(data.error || "Could not set password");
        setBusy(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-navy text-[20px] font-medium text-gold">S</span>
          <h1 className="text-[20px] font-medium text-ink">Set your password</h1>
          <p className="text-[13px] text-ink-2">Choose a password to access Signal</p>
        </div>

        <form onSubmit={submit} className="rounded-[16px] border border-border bg-surface p-6">
          {!token && <p className="mb-3 rounded-[8px] bg-warn-soft px-3 py-2 text-[13px] text-warn-ink">This link is missing its token. Ask your admin for a new invite link.</p>}
          <label className="mb-3 block">
            <span className="mb-1 block text-[12px] text-ink-2">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[14px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-[12px] text-ink-2">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[14px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
          </label>

          {error && <p className="mb-3 rounded-[8px] bg-bad-soft px-3 py-2 text-[13px] text-bad-ink">{error}</p>}

          <button
            type="submit"
            disabled={busy || !token}
            className="w-full rounded-[8px] bg-navy px-3 py-2.5 text-[14px] font-medium text-sidebar-ink-active hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Set password & sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
