"use client";

// Main Dashboard — the one screen that runs Pando v2.
// Aggregate view: the whole book (or any filtered set) side by side.
// Scoped view (exactly one client selected): that client's full results +
// activity story in a single scroll.
// Data: historical import (src/lib/historical.ts, generated from vetted
// sheets) merged with DB rows entered going forward; all math in the tested
// history/metrics engines.

import { useEffect, useMemo, useState } from "react";
import { X, Trophy } from "lucide-react";
import clsx from "clsx";
import { Card, SectionTitle, StatTile, Pill, HealthDot } from "@/components/ui";
import { MonthBars, Spark } from "@/components/dashboard/month-bars";
import { FilterButton } from "@/components/dashboard/filter-button";
import { CallsPanel, LinkedInPanel, EmailPanel, LivePanel } from "@/components/dashboard/client-detail";
import { useSession } from "@/lib/session";
import { clientMeta, clientName, formatEngagement } from "@/lib/clients";
import { RESULTS_MONTHLY, type MonthlyResults } from "@/lib/historical";
import {
  RANGE_LABELS,
  type RangeKey,
  filterMonthly,
  latestDataMonth,
  mergeMonthly,
  monthLabel,
  monthsForRange,
  perClientTotals,
  seriesByMonth,
  totalResults,
} from "@/lib/history";
import { money, num, pct } from "@/lib/format";

const RANGES: RangeKey[] = ["this_month", "quarter", "ytd"];
const SCOPE_KEY = "pando.dashboard.scope";
const RANGE_KEY = "pando.dashboard.range";

interface DbResultRow {
  client_id: string;
  month: string;
  closed_won: number | null;
  new_pipeline: number | null;
  meetings_held: number | null;
  meetings_scheduled: number | null;
}

export default function DashboardPage() {
  const { clients } = useSession(); // ids this user can access (roster-ordered)
  const [range, setRange] = useState<RangeKey>("ytd");
  const [selected, setSelected] = useState<string[]>([]);
  const [dbRows, setDbRows] = useState<MonthlyResults[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore persisted scope/range once we know the accessible client list.
  useEffect(() => {
    if (!clients.length || hydrated) return;
    try {
      const r = localStorage.getItem(RANGE_KEY) as RangeKey | null;
      if (r && RANGES.includes(r)) setRange(r);
      const s = JSON.parse(localStorage.getItem(SCOPE_KEY) ?? "[]") as string[];
      const valid = s.filter((id) => clients.includes(id));
      setSelected(valid.length ? valid : clients);
    } catch {
      setSelected(clients);
    }
    setHydrated(true);
  }, [clients, hydrated]);

  const setRangePersist = (r: RangeKey) => {
    setRange(r);
    try { localStorage.setItem(RANGE_KEY, r); } catch {}
  };
  const setSelectedPersist = (ids: string[]) => {
    setSelected(ids);
    try { localStorage.setItem(SCOPE_KEY, JSON.stringify(ids)); } catch {}
  };

  // Going-forward rows from the DB override the static import on (client, month).
  useEffect(() => {
    fetch("/api/results-monthly")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.rows)) {
          setDbRows(
            (d.rows as DbResultRow[]).map((r) => ({
              clientId: r.client_id,
              month: r.month,
              closedWon: r.closed_won,
              newPipeline: r.new_pipeline,
              meetingsHeld: r.meetings_held,
              meetingsScheduled: r.meetings_scheduled,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const merged = useMemo(() => mergeMonthly(RESULTS_MONTHLY, dbRows), [dbRows]);
  const months = useMemo(() => monthsForRange(range, new Date()), [range]);
  const scope = useMemo(() => new Set(selected), [selected]);
  const rows = useMemo(() => filterMonthly(merged, scope, months), [merged, scope, months]);
  const totals = useMemo(() => totalResults(rows), [rows]);
  const series = useMemo(() => seriesByMonth(rows, months), [rows, months]);
  const single = selected.length === 1 ? selected[0] : null;
  const dataThrough = useMemo(() => latestDataMonth(merged), [merged]);

  if (!hydrated) return null;

  return (
    <div>
      {/* Header + controls */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-[22px] font-medium text-ink">
            Main Dashboard
            {single && (
              <button
                onClick={() => setSelectedPersist(clients)}
                className="flex items-center gap-1.5 rounded-full border border-gold-line bg-gold-soft px-2.5 py-0.5 text-[13px] text-gold hover:opacity-80"
                title="Clear client filter"
              >
                {clientName(single)} <X size={13} />
              </button>
            )}
          </h1>
          <p className="mt-0.5 text-[13.5px] text-ink-2">
            {single
              ? `${clientMeta(single)?.serviceType} · engaged ${formatEngagement(clientMeta(single)!)}`
              : `${selected.length} of ${clients.length} clients`}
            {dataThrough && ` · results through ${monthLabel(dataThrough)} 2026`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-[10px] border border-border bg-surface text-[13px]">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRangePersist(r)}
                className={clsx(
                  "border-r border-border px-3 py-1.5 last:border-r-0",
                  r === range ? "bg-navy text-sidebar-ink-active" : "text-ink-2 hover:text-ink"
                )}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
          <FilterButton available={clients} selected={selected} onChange={setSelectedPersist} />
        </div>
      </div>

      {/* Results tiles — same four numbers whatever the scope */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Closed Won" value={totals.hasData ? money(totals.closedWon) : "—"} sub={rangeSub(range)} accent />
        <StatTile label="New Pipeline" value={totals.hasData ? money(totals.newPipeline) : "—"} sub={pipelineSub(totals.closedWon, totals.newPipeline)} />
        <StatTile label="Meetings Held" value={totals.hasData ? num(totals.meetingsHeld) : "—"} sub={totals.hasData ? `of ${num(totals.meetingsScheduled)} scheduled` : undefined} />
        <StatTile
          label="Hold Rate"
          value={totals.holdRate != null ? pct(totals.holdRate * 100) : "—"}
          sub={totals.holdRate != null ? "held ÷ scheduled" : "no meetings in range"}
        />
      </div>

      {!totals.hasData && (
        <Card className="mb-4 p-4 text-[13.5px] text-ink-2">
          No results recorded in this range for the selected {selected.length === 1 ? "client" : "clients"}. Historical
          results run January–June 2026; new months appear as they're entered or arrive from connectors.
        </Card>
      )}

      {/* Meetings month over month */}
      {totals.hasData && months.length > 1 && (
        <Card className="mb-4 p-5">
          <SectionTitle icon={<Trophy size={16} />} title="Meetings — month over month" right={<span className="text-[12px] text-ink-3">source: results import + live entries</span>} />
          <MonthBars points={series} />
        </Card>
      )}

      {single ? (
        <div className="space-y-4">
          <CallsPanel clientId={single} months={months} />
          <LinkedInPanel clientId={single} />
          <EmailPanel clientId={single} />
          <LivePanel clientId={single} />
        </div>
      ) : (
        <ClientsTable
          clientIds={selected}
          rows={rows}
          months={months}
          totals={totals}
          onPick={(id) => setSelectedPersist([id])}
        />
      )}

      <p className="mt-4 text-[11px] text-ink-3">
        Results source: MSP Results import (Jan–Jun 2026) + Pando entries · rates computed by the tested metrics engine · no
        estimated or filler numbers.
      </p>
    </div>
  );
}

function rangeSub(range: RangeKey): string {
  return range === "ytd" ? "year to date" : range === "quarter" ? "this quarter" : "this month";
}

function pipelineSub(closedWon: number, pipeline: number): string | undefined {
  if (closedWon > 0 && pipeline > 0) return `${(pipeline / closedWon).toFixed(1)}× closed won`;
  return undefined;
}

function ClientsTable({
  clientIds,
  rows,
  months,
  totals,
  onPick,
}: {
  clientIds: string[];
  rows: MonthlyResults[];
  months: string[];
  totals: ReturnType<typeof totalResults>;
  onPick: (id: string) => void;
}) {
  const per = perClientTotals(rows, clientIds);

  return (
    <Card className="p-5">
      <SectionTitle title="Clients" right={<span className="text-[12px] text-ink-3">click a row to scope the dashboard to that client</span>} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-[13px]">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-3">
              <th className="py-2 font-medium">Client</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 text-right font-medium">Closed Won</th>
              <th className="py-2 text-right font-medium">Pipeline</th>
              <th className="py-2 text-right font-medium">Held</th>
              <th className="py-2 text-right font-medium">Scheduled</th>
              <th className="py-2 text-right font-medium">Hold rate</th>
              <th className="py-2 text-right font-medium">Trend (held)</th>
            </tr>
          </thead>
          <tbody>
            {clientIds.map((id) => {
              const meta = clientMeta(id);
              const t = per.get(id)!;
              const inactive = meta?.status !== "active";
              const clientRows = rows.filter((r) => r.clientId === id);
              // Per-field presence: a metric with no recorded values shows "—", never a fabricated 0.
              const has = {
                closedWon: clientRows.some((r) => r.closedWon != null),
                pipeline: clientRows.some((r) => r.newPipeline != null),
                held: clientRows.some((r) => r.meetingsHeld != null),
                scheduled: clientRows.some((r) => r.meetingsScheduled != null),
              };
              const heldByMonth = months.map(
                (m) => clientRows.filter((r) => r.month === m).reduce((a, r) => a + (r.meetingsHeld ?? 0), 0)
              );
              return (
                <tr
                  key={id}
                  onClick={() => onPick(id)}
                  className={clsx("cursor-pointer border-b border-border/60 hover:bg-surface-2", inactive && "opacity-55")}
                >
                  <td className="py-2.5 font-medium text-ink">{meta?.name ?? id}</td>
                  <td className="py-2.5">
                    <Pill tone={inactive ? "neutral" : "good"}>
                      <HealthDot status={inactive ? "neutral" : "good"} /> {inactive ? "Non-active" : "Active"}
                    </Pill>
                  </td>
                  {t.hasData ? (
                    <>
                      <td className="tabular py-2.5 text-right text-ink">{has.closedWon ? money(t.closedWon) : "—"}</td>
                      <td className="tabular py-2.5 text-right text-ink">{has.pipeline ? money(t.newPipeline) : "—"}</td>
                      <td className="tabular py-2.5 text-right text-ink">{has.held ? num(t.meetingsHeld) : "—"}</td>
                      <td className="tabular py-2.5 text-right text-ink">{has.scheduled ? num(t.meetingsScheduled) : "—"}</td>
                      <td className="tabular py-2.5 text-right text-ink">{t.holdRate != null ? pct(t.holdRate * 100) : "—"}</td>
                      <td className="py-2.5 text-right">{has.held ? <Spark values={heldByMonth} /> : <Pill tone="neutral">awaiting data</Pill>}</td>
                    </>
                  ) : (
                    <>
                      <td className="tabular py-2.5 text-right text-ink-3">—</td>
                      <td className="tabular py-2.5 text-right text-ink-3">—</td>
                      <td className="tabular py-2.5 text-right text-ink-3">—</td>
                      <td className="tabular py-2.5 text-right text-ink-3">—</td>
                      <td className="tabular py-2.5 text-right text-ink-3">—</td>
                      <td className="py-2.5 text-right"><Pill tone="neutral">awaiting data</Pill></td>
                    </>
                  )}
                </tr>
              );
            })}
            <tr className="bg-surface-2/50">
              <td className="py-2.5 font-medium text-ink">Total</td>
              <td className="py-2.5" />
              <td className="tabular py-2.5 text-right font-medium text-ink">{money(totals.closedWon)}</td>
              <td className="tabular py-2.5 text-right font-medium text-ink">{money(totals.newPipeline)}</td>
              <td className="tabular py-2.5 text-right font-medium text-ink">{num(totals.meetingsHeld)}</td>
              <td className="tabular py-2.5 text-right font-medium text-ink">{num(totals.meetingsScheduled)}</td>
              <td className="tabular py-2.5 text-right font-medium text-ink">{totals.holdRate != null ? pct(totals.holdRate * 100) : "—"}</td>
              <td className="py-2.5" />
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
