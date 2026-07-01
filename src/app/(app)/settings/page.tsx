"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, ROLE_LABELS } from "@/lib/session";
import { CLIENTS, CLIENT_ORDER } from "@/lib/data";
import { Card, SectionTitle, Pill, HealthDot } from "@/components/ui";
import { STATUS_DOT } from "@/components/shell/topbar";
import { ConnectorsPanel } from "@/components/connectors-panel";
import { UserManager } from "@/components/user-manager";
import { User, Users, Building2, KeyRound, Plus, Lock } from "lucide-react";

export default function SettingsPage() {
  const { user, role } = useSession();
  const isOwner = user.clientAccess === "all";
  const isClient = role === "client";
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const avatarKey = `signal.avatar.${user.id}`;
  useEffect(() => {
    try {
      setAvatar(localStorage.getItem(avatarKey));
    } catch {
      setAvatar(null);
    }
  }, [avatarKey]);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setAvatar(url);
      try {
        localStorage.setItem(avatarKey, url);
      } catch {
        // image too large for storage — keep in memory
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <h1 className="mb-1 text-[22px] font-medium text-ink">Account &amp; settings</h1>
      <p className="mb-5 text-[14px] text-ink-2">
        Signed in as {user.name} · {ROLE_LABELS[role]}
      </p>

      <div className="space-y-5">
        <Card className="p-5">
          <SectionTitle icon={<User size={16} />} title="Your profile" />
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
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <button className="flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong">
              <KeyRound size={14} /> Reset password
            </button>
          </div>
        </Card>

        {isClient && !isOwner && <ClientTeamPanel />}
        {isOwner && <AdminPanel />}

        <Card className="p-5">
          <SectionTitle icon={<Lock size={16} />} title="Contracts & billing" />
          <p className="text-[13.5px] text-ink-2">
            Contracts and agreements live in each client&apos;s shared Drive (04 — Agreements &amp; SOW). Billing management isn&apos;t part of this version of Signal.
          </p>
        </Card>
      </div>
    </div>
  );
}

function ClientTeamPanel() {
  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Users size={16} />}
        title="Your team"
        right={
          <button className="flex items-center gap-1.5 rounded-[8px] bg-navy px-2.5 py-1.5 text-[12.5px] text-sidebar-ink-active hover:opacity-90">
            <Plus size={14} /> Invite teammate
          </button>
        }
      />
      <p className="mb-3 text-[13px] text-ink-2">
        Add or remove people on your team. Teammates see the same reporting you do, without billing.
      </p>
      <TeamRow name="YetiConnect Founder" email="founder@yeticonnect.com" tag="Owner" />
      <TeamRow name="YetiConnect Sales Lead" email="sales@yeticonnect.com" tag="Team" />
    </Card>
  );
}

function TeamRow({ name, email, tag }: { name: string; email: string; tag: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[12px] text-sidebar-ink-active">
        {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] text-ink">{name}</p>
        <p className="truncate text-[12px] text-ink-3">{email}</p>
      </div>
      <Pill tone="neutral">{tag}</Pill>
      <button className="text-[12.5px] text-ink-3 hover:text-ink">Reset</button>
    </div>
  );
}

function AdminPanel() {
  const [showIntake, setShowIntake] = useState(false);

  return (
    <>
      <ConnectorsPanel />

      <UserManager />

      <Card className="p-5">
        <SectionTitle
          icon={<Building2 size={16} />}
          title="Clients"
          right={
            <button
              onClick={() => setShowIntake((s) => !s)}
              className="flex items-center gap-1.5 rounded-[8px] bg-navy px-2.5 py-1.5 text-[12.5px] text-sidebar-ink-active hover:opacity-90"
            >
              <Plus size={14} /> Add client
            </button>
          }
        />

        {showIntake && <IntakeForm onClose={() => setShowIntake(false)} />}

        <div className="mt-1 space-y-2">
          {CLIENT_ORDER.map((id) => {
            const c = CLIENTS[id].client;
            return (
              <div key={id} className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
                <HealthDot status={STATUS_DOT[c.status]} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-ink">{c.name}</p>
                  <p className="truncate text-[12px] text-ink-3">
                    {c.industry} · owner {c.accountOwner} · SDRs: {c.sdrs.join(", ")}
                  </p>
                </div>
                <button className="text-[12.5px] text-ink-3 hover:text-ink">Manage</button>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function IntakeForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-4 rounded-[12px] border border-gold-line bg-surface-2 p-4">
      <p className="mb-1 text-[13.5px] font-medium text-ink">New client intake</p>
      <p className="mb-3 text-[12.5px] text-ink-2">
        On submit, Signal creates the client, provisions a shared Drive, and emails an onboarding invite with a Signal login.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Company name" placeholder="Acme Health" />
        <Field label="Website" placeholder="acmehealth.com" />
        <Field label="CEO name" placeholder="Jordan Lee" />
        <Field label="CEO email" placeholder="jordan@acmehealth.com" />
        <Field label="Account owner" placeholder="Clay Tirrell" />
        <Field label="Assigned SDR" placeholder="Derek" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button className="rounded-[8px] bg-navy px-3 py-1.5 text-[13px] text-sidebar-ink-active hover:opacity-90">
          Create client &amp; send invite
        </button>
        <button onClick={onClose} className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong">
          Cancel
        </button>
        <span className="ml-auto text-[11px] text-ink-3">Demo — not yet wired to Drive/email</span>
      </div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-ink-2">{label}</span>
      <input
        placeholder={placeholder}
        className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[13.5px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
      />
    </label>
  );
}
