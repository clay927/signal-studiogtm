"use client";

// Client account page (owner-only): everything specific to one client's
// engagement — connectors, team access, engagement terms. Reporting lives on
// the Main Dashboard (scope to the client there).

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/session";
import { clientMeta, formatEngagement } from "@/lib/clients";
import { ConnectorsPanel } from "@/components/connectors-panel";
import { Card, SectionTitle, Pill, HealthDot, EmptyState, Avatar } from "@/components/ui";
import { ArrowLeft, Building2, Users, FileText, BarChart3 } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  client_access: string[];
  status: string;
}

const ROLE_TAG: Record<string, string> = {
  owner: "Admin",
  sdr: "Sales pro",
  client: "Client",
  client_team: "Client team",
};

export default function ClientPage() {
  const params = useParams<{ id: string }>();
  const clientId = params.id;
  const { user } = useSession();
  const isOwner = user.clientAccess === "all";
  const meta = clientMeta(clientId);

  const [team, setTeam] = useState<UserRow[]>([]);
  const [terms, setTerms] = useState("");
  const [termsSaved, setTermsSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [dbService, setDbService] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch("/api/users").then((r) => r.json()),
        fetch("/api/client-settings").then((r) => r.json()),
      ]);
      if (usersRes.ok) {
        setTeam(
          (usersRes.users as UserRow[]).filter(
            (u) => u.role === "owner" || u.client_access.includes(clientId)
          )
        );
      }
      if (settingsRes.ok) {
        const row = (settingsRes.settings as { client_id: string; status: string | null; service_type: string | null; terms?: string }[]).find(
          (s) => s.client_id === clientId
        );
        if (row) {
          setDbStatus(row.status);
          setDbService(row.service_type);
          setTerms(row.terms ?? "");
        }
      }
    } catch {
      // DB unavailable — page still renders from the static roster
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveTerms() {
    setTermsSaved("saving");
    try {
      await fetch("/api/client-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: clientId, terms }),
      });
      setTermsSaved("saved");
      setTimeout(() => setTermsSaved("idle"), 1500);
    } catch {
      setTermsSaved("idle");
    }
  }

  if (!meta) {
    return <EmptyState title="Unknown client" body={`No client "${clientId}" in the roster.`} />;
  }
  if (!isOwner) {
    return <EmptyState title="Admins only" body="Client account pages are for StudioGTM admins." />;
  }

  const status = dbStatus ?? meta.status;
  const isActive = status === "active" || status === "onboarding";

  return (
    <div>
      <Link href="/settings" className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-ink">
        <ArrowLeft size={14} /> Settings
      </Link>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-medium text-ink">{meta.name}</h1>
        <Pill tone={isActive ? "good" : "neutral"}>
          <HealthDot status={isActive ? "good" : "neutral"} /> {isActive ? "Active" : "Non-active"}
        </Pill>
        <Pill tone="neutral">{dbService ?? meta.serviceType}</Pill>
        <Link
          href="/"
          className="ml-auto inline-flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
        >
          <BarChart3 size={14} /> View reporting
        </Link>
      </div>

      <div className="space-y-5">
        <Card className="p-5">
          <SectionTitle icon={<Building2 size={16} />} title="Engagement" />
          <div className="grid gap-3 text-[13.5px] sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-3">Started</p>
              <p className="mt-0.5 text-ink">{formatEngagement(meta).split(" – ")[0]}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-3">Through</p>
              <p className="mt-0.5 text-ink">{formatEngagement(meta).split(" – ")[1]}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-3">Service</p>
              <p className="mt-0.5 text-ink">{dbService ?? meta.serviceType}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-ink">
              <FileText size={13} className="text-ink-3" /> Terms of engagement
            </p>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Contract terms, pricing, commitments… (contracts themselves live in the client's Drive — 04 Agreements & SOW)"
              rows={3}
              className="w-full rounded-[10px] border border-border bg-surface-2 p-3 text-[13px] text-ink placeholder:text-ink-3"
            />
            <button
              onClick={saveTerms}
              className="mt-2 rounded-[8px] bg-navy px-3 py-1.5 text-[12.5px] text-sidebar-ink-active hover:opacity-90"
            >
              {termsSaved === "saving" ? "Saving…" : termsSaved === "saved" ? "Saved ✓" : "Save terms"}
            </button>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle
            icon={<Users size={16} />}
            title="People on this account"
            right={<Link href="/settings" className="text-[12.5px] text-gold hover:opacity-80">Manage users →</Link>}
          />
          {team.length ? (
            team.map((u) => (
              <div key={u.id} className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
                <Avatar name={u.name || u.email} tone={u.role === "owner" ? "navy" : "gold"} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] text-ink">{u.name || u.email}</p>
                  <p className="truncate text-[12px] text-ink-3">{u.email}</p>
                </div>
                <Pill tone={u.role === "owner" ? "gold" : "neutral"}>{ROLE_TAG[u.role] ?? u.role}</Pill>
                {u.status !== "active" && <Pill tone="neutral">deactivated</Pill>}
              </div>
            ))
          ) : (
            <p className="text-[13.5px] text-ink-2">Loading team…</p>
          )}
        </Card>

        <ConnectorsPanel clientId={clientId} />
      </div>
    </div>
  );
}
