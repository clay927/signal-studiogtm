"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { CLIENTS, CLIENT_ORDER } from "@/lib/data";
import { Card, StatTile, SampleBadge, HealthDot, Pill, EmptyState, UpdatedStamp } from "@/components/ui";
import { Menu, MenuItem } from "@/components/menu";
import { money, num, pct } from "@/lib/format";
import { holdStatus } from "@/lib/metrics";
import type { ClientStatus, ServiceType } from "@/lib/types";
import { AlertTriangle, ChevronDown } from "lucide-react";
import clsx from "clsx";

const STATUSES: ClientStatus[] = ["onboarding", "active", "paused", "inactive"];
const SERVICES: ServiceType[] = ["Diagnostic", "MSP", "Build", "Complete"];

const STATUS_META: Record<ClientStatus, { dot: "good" | "warn" | "bad" | "neutral"; label: string; tone: "good" | "warn" | "bad" | "neutral" }> = {
  onboarding: { dot: "neutral", label: "Onboarding", tone: "neutral" },
  active: { dot: "good", label: "Active", tone: "good" },
  paused: { dot: "warn", label: "Paused", tone: "warn" },
  inactive: { dot: "neutral", label: "Inactive", tone: "neutral" },
};

type Overrides = Record<string, { status?: ClientStatus; service_type?: ServiceType }>;

export default function PortfolioPage() {
  const { user, setClientId } = useSession();
  const router = useRouter();
  const [overrides, setOverrides] = useState<Overrides>({});
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetch("/api/client-settings")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.settings) return;
        const map: Overrides = {};
        for (const s of d.settings) map[s.client_id] = { status: s.status ?? undefined, service_type: s.service_type ?? undefined };
        setOverrides(map);
      })
      .catch(() => {});
  }, []);

  if (user.clientAccess !== "all") {
    return <EmptyState title="Owner access only" body="The portfolio view is available to StudioGTM owners." />;
  }

  const statusOf = (id: string): ClientStatus => overrides[id]?.status ?? CLIENTS[id].client.status;
  const serviceOf = (id: string): ServiceType | undefined => overrides[id]?.service_type ?? CLIENTS[id].client.serviceType;

  async function updateSetting(id: string, patch: { status?: ClientStatus; serviceType?: ServiceType }) {
    setOverrides((prev) => ({
      ...prev,
      [id]: {
        status: patch.status ?? prev[id]?.status,
        service_type: patch.serviceType ?? prev[id]?.service_type,
      },
    }));
    try {
      await fetch("/api/client-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: id, ...patch }),
      });
    } catch {
      // optimistic; keep local
    }
  }

  const all = CLIENT_ORDER.map((id) => CLIENTS[id]);
  const activeSet = all.filter((d) => statusOf(d.client.id) !== "inactive");
  const totalMeetings = activeSet.reduce((s, d) => s + d.results.meetingsHeld, 0);
  const totalPipeline = activeSet.reduce((s, d) => s + d.results.newPipeline, 0);
  const totalWon = activeSet.reduce((s, d) => s + d.results.closedWon, 0);
  const held = activeSet.filter((d) => d.results.holdRate > 0);
  const avgHold = held.length ? Math.round(held.reduce((s, d) => s + d.results.holdRate, 0) / held.length) : 0;
  const paused = all.filter((d) => statusOf(d.client.id) === "paused");
  const hiddenCount = all.filter((d) => ["paused", "inactive"].includes(statusOf(d.client.id))).length;
  const visible = showInactive ? all : all.filter((d) => !["paused", "inactive"].includes(statusOf(d.client.id)));

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
            The book of business at a glance. Change status and service type inline.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Meetings held (book)" value={num(totalMeetings)} sub="this month" status="good" />
        <StatTile label="New pipeline (book)" value={money(totalPipeline)} sub="this month" status="good" accent />
        <StatTile label="Closed won (book)" value={money(totalWon)} sub="this month" status="good" />
        <StatTile label="Avg hold rate" value={pct(avgHold)} sub="across active" status={avgHold ? holdStatus(avgHold) : "neutral"} />
      </div>

      {paused.length > 0 && (
        <div className="mb-5 flex items-start gap-2 rounded-[12px] border border-warn bg-warn-soft px-4 py-3 text-[13.5px] text-warn-ink">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span>
            <span className="font-medium">{paused.length} account{paused.length > 1 ? "s" : ""} paused:</span>{" "}
            {paused.map((d) => d.client.name).join(", ")}.
          </span>
        </div>
      )}

      <div className="mb-3 flex items-center justify-end gap-2 text-[12.5px]">
        <span className="text-ink-3">
          {showInactive ? "Showing all statuses" : `Showing active${hiddenCount ? ` · ${hiddenCount} hidden` : ""}`}
        </span>
        <button
          onClick={() => setShowInactive((s) => !s)}
          className="rounded-full border border-border px-3 py-1 text-ink-2 hover:border-border-strong"
        >
          {showInactive ? "Show active only" : "Show all statuses"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visible.map((d) => {
          const c = d.client;
          const status = statusOf(c.id);
          const service = serviceOf(c.id);
          const meta = STATUS_META[status];
          return (
            <Card key={c.id} className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <button onClick={() => open(c.id)} className="flex min-w-0 items-center gap-2 text-left">
                  <HealthDot status={meta.dot} />
                  <span className="truncate text-[15px] font-medium text-ink hover:text-gold">{c.name}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Menu
                    align="right"
                    width={150}
                    trigger={() => (
                      <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[12px] text-ink-2 hover:border-border-strong">
                        {meta.label} <ChevronDown size={12} />
                      </span>
                    )}
                  >
                    {(close) => (
                      <>
                        {STATUSES.map((s) => (
                          <MenuItem key={s} active={s === status} onClick={() => { updateSetting(c.id, { status: s }); close(); }}>
                            {STATUS_META[s].label}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </Menu>
                  <Menu
                    align="right"
                    width={150}
                    trigger={() => (
                      <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-[12px] text-gold hover:opacity-90">
                        {service ?? "Service"} <ChevronDown size={12} />
                      </span>
                    )}
                  >
                    {(close) => (
                      <>
                        {SERVICES.map((s) => (
                          <MenuItem key={s} active={s === service} onClick={() => { updateSetting(c.id, { serviceType: s }); close(); }}>
                            {s}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </Menu>
                </div>
              </div>
              <p className="mb-3 text-[12px] text-ink-3">
                {c.industry} · owner {c.accountOwner}
              </p>
              <button onClick={() => open(c.id)} className="grid w-full grid-cols-3 gap-2 text-center">
                <MiniStat label="Meetings" value={num(d.results.meetingsHeld)} />
                <MiniStat label="Pipeline" value={money(d.results.newPipeline)} accent />
                <MiniStat label="Hold" value={d.results.holdRate ? pct(d.results.holdRate) : "—"} status={d.results.holdRate ? holdStatus(d.results.holdRate) : "neutral"} />
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
