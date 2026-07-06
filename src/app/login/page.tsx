"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.assign("/");
      } else {
        setError(data.error || "Sign-in failed");
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
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-navy text-[20px] font-medium text-gold">P</span>
          <h1 className="text-[20px] font-medium text-ink">Sign in to Pando</h1>
          <p className="text-[13px] text-ink-2">StudioGTM client operating system</p>
        </div>

        <form onSubmit={submit} className="rounded-[16px] border border-border bg-surface p-6">
          <label className="mb-3 block">
            <span className="mb-1 block text-[12px] text-ink-2">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[14px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-[12px] text-ink-2">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[14px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
          </label>

          {error && <p className="mb-3 rounded-[8px] bg-bad-soft px-3 py-2 text-[13px] text-bad-ink">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-[8px] bg-navy px-3 py-2.5 text-[14px] font-medium text-sidebar-ink-active hover:opacity-90 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-4 text-center text-[12px] text-ink-3">
            Need access or forgot your password? Ask your StudioGTM admin to send an invite link.
          </p>
        </form>
      </div>
    </div>
  );
}
