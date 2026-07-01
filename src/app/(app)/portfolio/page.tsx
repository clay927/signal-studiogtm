"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { CLIENTS, CLIENT_ORDER } from "@/lib/data";
import { Card, StatTile, SampleBadge, HealthDot, Pill, EmptyState, UpdatedStamp } from "@/components/ui";
import { money, num, pct } from "@/lib/format";
import type { ClientStatus } from "@/lib/types";
import { holdStatus } from "@/lib/metrics";
import { AlertTriangle } from "lucide-react";
import clsx from "clsx";

const STATUS_META: Record<ClientStatus, { dot: "good" | "warn" | "bad" | "neutral"; label: string; tone: "good" | "warn" | "bad" | "neutral" }> = {
  active: { dot: "good", label: "Active", tone: "good" },
  onboarding: { dot: "neutral", label: "Onboarding", tone: "neutral" },
  at_risk: { dot: "bad", label: "At risk", tone: "bad" },
  churned: { dot: "bad", label: "Churned", tone: "bad" },
};

export default function PortfolioPage() {
  const { user, setClientId } = useSession();
  const router = useRouter();

  if (user.clientAccess !== "all") {
    return <EmptyState title="Owner access only" body="The portfolio view is available to StudioGTM owners." />;
  }

  const all = CLIENT_ORDER.map((id) => CLIENTS[id]);
  const active = all.filter((d) => d.client.status !== "churned");
  const totalMeetings = active.reduce((s, d) => s + d.results.meetingsHeld, 0);
  const totalPipeline = active.reduce((s, d) => s + d.results.newPipeline, 0);
  const totalWon = active.reduce((s, d) => s + d.results.closedWon, 0);
  const held = active.filter((d) => d.results.holdRate > 0);
  const avgHold = held.length ? Math.round(held.reduce((s, d) => s + d.results.holdRate, 0) / held.length) : 0;
  const atRisk = all.filter((d) => d.client.status === "at_risk");

  const open = (id: string) => {
    setClientId(id);
    router.push("/");
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">All clients</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            The book of business at a glance — and who needs your attention.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Meetings held (book)" value={num(totalMeetings)} sub="this month" status="good" />
        <StatTile label="New pipeline (book)" value={money(totalPipeline)} sub="this month" status="good" accent />
        <StatTile label="Closed won (book)" value={money(totalWon)} sub="this month" status="good" />
        <StatTile label="Avg hold rate" value={pct(avgHold)} sub="across active" status={holdStatus(avgHold)} />
      </div>

      {atRisk.length > 0 && (
        <div className="mb-5 flex items-start gap-2 rounded-[12px] border border-bad bg-bad-soft px-4 py-3 text-[13.5px] text-bad-ink">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-medium">{atRisk.length} account{atRisk.length > 1 ? "s" : ""} at risk:</span>{" "}
            {atRisk.map((d) => d.client.name).join(", ")}. Results are below expectations — get ahead of it.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {all.map((d) => {
          const c = d.client;
          const meta = STATUS_META[c.status];
          return (
            <Card
              key={c.id}
              className={clsx(
                "transition-colors hover:border-border-strong",
                c.status === "at_risk" && "border-bad/40"
              )}
            >
              <button onClick={() => open(c.id)} className="block w-full p-4 text-left">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HealthDot status={meta.dot} />
                    <span className="text-[15px] font-medium text-ink">{c.name}</span>
                  </div>
                  <Pill tone={meta.tone}>{meta.label}</Pill>
                </div>
                <p className="mb-3 text-[12px] text-ink-3">
                  {c.industry} · owner {c.accountOwner}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <MiniStat label="Meetings" value={num(d.results.meetingsHeld)} />
                  <MiniStat label="Pipeline" value={money(d.results.newPipeline)} accent />
                  <MiniStat label="Hold" value={d.results.holdRate ? pct(d.results.holdRate) : "—"} status={d.results.holdRate ? holdStatus(d.results.holdRate) : "neutral"} />
                </div>
              </button>
            </Card>
          );
        })}
      </div>

      <UpdatedStamp when={all[0].lastUpdated} />
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
  status,
}: {
  label: string;
  value: string;
  accent?: boolean;
  status?: "good" | "warn" | "bad" | "neutral";
}) {
  const color =
    status === "good" ? "text-good-ink" : status === "warn" ? "text-warn-ink" : status === "bad" ? "text-bad-ink" : accent ? "text-gold" : "text-ink";
  return (
    <div className="rounded-[10px] bg-surface-2 py-2">
      <div className={clsx("tabular text-[16px]", color)}>{value}</div>
      <div className="text-[11px] text-ink-3">{label}</div>
    </div>
  );
}
