"use client";

// Your profile — everything specific to YOU (the account pages for clients
// live under /clients/[id]; admin tools live in /settings).

import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/session";
import { clientName } from "@/lib/clients";
import { Card, SectionTitle, Pill } from "@/components/ui";
import { User, KeyRound, Building2, BadgeCheck, Copy, Check } from "lucide-react";

// License labels (Clay's naming) on top of the internal role keys.
const LICENSE_LABELS: Record<string, string> = {
  owner: "Admin",
  sdr: "Sales pro",
  client: "Client",
  client_team: "Client team",
};

export default function ProfilePage() {
  const { user, role } = useSession();
  const isOwner = user.clientAccess === "all";
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetLink, setResetLink] = useState("");
  const [resetErr, setResetErr] = useState("");
  const [copied, setCopied] = useState(false);

  // Avatar lives on the user record (follows the login across devices).
  // One-time migration: if this device still has the old browser-local photo
  // and the account has none, upload it.
  const legacyKey = `signal.avatar.${user.id}`;
  useEffect(() => {
    setAvatar(user.avatar || null);
    if (!user.avatar) {
      try {
        const legacy = localStorage.getItem(legacyKey);
        if (legacy) {
          saveAvatar(legacy).then((ok) => {
            if (ok) localStorage.removeItem(legacyKey);
          });
        }
      } catch {
        // no legacy photo
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.avatar, legacyKey]);

  async function saveAvatar(url: string): Promise<boolean> {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: url }),
      });
      const d = await res.json();
      if (d.ok) {
        setAvatar(url);
        window.dispatchEvent(new CustomEvent("pando-avatar-updated", { detail: url }));
        return true;
      }
    } catch {
      // server unreachable — photo shows locally this session only
    }
    setAvatar(url);
    window.dispatchEvent(new CustomEvent("pando-avatar-updated", { detail: url }));
    return false;
  }

  /** Downscale to a 256px square-ish JPEG so the stored record stays small. */
  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        const max = 256;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error("could not read image"));
      };
      img.src = objUrl;
    });
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    resizeImage(file)
      .then(saveAvatar)
      .catch(() => {});
  }

  async function resetPassword() {
    setResetErr("");
    setResetLink("");
    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const d = await res.json();
      if (d.ok && d.link) setResetLink(d.link);
      else setResetErr(d.error || "Ask an admin to generate a reset link from Settings → Users.");
    } catch {
      setResetErr("Could not reach the server.");
    }
  }

  const accessList = user.clientAccess === "all" ? null : (user.clientAccess as string[]);

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-medium text-ink">Your profile</h1>
      <p className="mb-5 text-[14px] text-ink-2">Personal account details — admin tools live in Settings.</p>

      <div className="space-y-5">
        <Card className="p-5">
          <SectionTitle icon={<User size={16} />} title="Profile" />
          <div className="flex items-center gap-4">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-[18px] font-medium text-gold">
                {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
            )}
            <div className="flex-1">
              <p className="text-[15px] font-medium text-ink">{user.name}</p>
              <p className="text-[13px] text-ink-2">{user.email}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
            >
              {avatar ? "Change photo" : "Upload photo"}
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={<BadgeCheck size={16} />} title="License" />
          <div className="flex items-center gap-3">
            <Pill tone="gold">{LICENSE_LABELS[role] ?? role}</Pill>
            <p className="text-[13px] text-ink-2">
              {isOwner
                ? "Full access: every client, all admin tools, user management."
                : role === "sdr"
                  ? "Reporting access for your assigned client teams."
                  : "Reporting access for your company's engagement."}
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle icon={<Building2 size={16} />} title="Client access" />
          {accessList === null ? (
            <p className="text-[13.5px] text-ink-2">All clients (admin).</p>
          ) : accessList.length ? (
            <div className="flex flex-wrap gap-2">
              {accessList.map((id) => (
                <Pill key={id} tone="neutral">{clientName(id)}</Pill>
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] text-ink-2">No client access assigned yet — ask an admin.</p>
          )}
        </Card>

        <Card className="p-5">
          <SectionTitle icon={<KeyRound size={16} />} title="Password" />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetPassword}
              className="flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
            >
              <KeyRound size={14} /> Reset password
            </button>
            {resetLink && (
              <span className="flex items-center gap-2 text-[12.5px] text-ink-2">
                <a href={resetLink} className="text-gold hover:opacity-80">Open reset link</a>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(resetLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="inline-flex items-center gap-1 text-ink-3 hover:text-ink"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} copy
                </button>
              </span>
            )}
            {resetErr && <span className="text-[12.5px] text-ink-3">{resetErr}</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}
