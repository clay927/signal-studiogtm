// Pure aggregation over monthly reporting rows (historical import + DB rows
// + live rollups). Part of the accuracy contract: every derived number on the
// dashboard comes from these tested functions.
import type { MonthlyResults } from "./historical";

export type RangeKey = "this_month" | "quarter" | "ytd" | "custom";

export const RANGE_LABELS: Record<RangeKey, string> = {
  this_month: "This month",
  quarter: "Quarter",
  ytd: "YTD",
  custom: "Custom",
};

/** Inclusive month span between two YYYY-MM keys (order-tolerant, capped at 36 months). */
export function monthsBetween(from: string, to: string): string[] {
  const parse = (s: string) => {
    const m = /^(\d{4})-(\d{2})$/.exec(s);
    return m ? Number(m[1]) * 12 + (Number(m[2]) - 1) : null;
  };
  let a = parse(from);
  let b = parse(to);
  if (a == null || b == null) return [];
  if (a > b) [a, b] = [b, a];
  b = Math.min(b, a + 35);
  const months: string[] = [];
  for (let i = a; i <= b; i++) months.push(`${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`);
  return months;
}

export function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Months (YYYY-MM) covered by a preset range, from range start through the current month. */
export function monthsForRange(range: Exclude<RangeKey, "custom">, now: Date): string[] {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0-based
  const startMonth = range === "this_month" ? m : range === "quarter" ? Math.floor(m / 3) * 3 : 0;
  const months: string[] = [];
  for (let i = startMonth; i <= m; i++) months.push(`${y}-${String(i + 1).padStart(2, "0")}`);
  return months;
}

/** Later rows win on (clientId, month) — DB/live rows override the static import. */
export function mergeMonthly<T extends { clientId: string; month: string }>(base: T[], overrides: T[]): T[] {
  const map = new Map<string, T>();
  for (const r of [...base, ...overrides]) map.set(`${r.clientId}|${r.month}`, r);
  return [...map.values()];
}

export function filterMonthly<T extends { clientId: string; month: string }>(
  rows: T[],
  clientIds: ReadonlySet<string>,
  months: readonly string[]
): T[] {
  const monthSet = new Set(months);
  return rows.filter((r) => clientIds.has(r.clientId) && monthSet.has(r.month));
}

export interface ResultsTotals {
  closedWon: number;
  newPipeline: number;
  meetingsHeld: number;
  meetingsScheduled: number;
  /** null when no meetings were scheduled in the window (never fabricate a rate) */
  holdRate: number | null;
  /** true when at least one row contributed any value */
  hasData: boolean;
}

export function totalResults(rows: MonthlyResults[]): ResultsTotals {
  let closedWon = 0;
  let newPipeline = 0;
  let held = 0;
  let scheduled = 0;
  let hasData = false;
  for (const r of rows) {
    if (r.closedWon != null) { closedWon += r.closedWon; hasData = true; }
    if (r.newPipeline != null) { newPipeline += r.newPipeline; hasData = true; }
    if (r.meetingsHeld != null) { held += r.meetingsHeld; hasData = true; }
    if (r.meetingsScheduled != null) { scheduled += r.meetingsScheduled; hasData = true; }
  }
  return {
    closedWon,
    newPipeline,
    meetingsHeld: held,
    meetingsScheduled: scheduled,
    holdRate: scheduled > 0 ? held / scheduled : null,
    hasData,
  };
}

export interface MonthPoint {
  month: string;
  held: number;
  scheduled: number;
  closedWon: number;
  newPipeline: number;
}

export function seriesByMonth(rows: MonthlyResults[], months: readonly string[]): MonthPoint[] {
  return months.map((month) => {
    const t = totalResults(rows.filter((r) => r.month === month));
    return { month, held: t.meetingsHeld, scheduled: t.meetingsScheduled, closedWon: t.closedWon, newPipeline: t.newPipeline };
  });
}

export function perClientTotals(rows: MonthlyResults[], clientIds: readonly string[]): Map<string, ResultsTotals> {
  const out = new Map<string, ResultsTotals>();
  for (const id of clientIds) out.set(id, totalResults(rows.filter((r) => r.clientId === id)));
  return out;
}

/** Most recent month (YYYY-MM) that has any data, for the "data through" stamp. */
export function latestDataMonth(rows: MonthlyResults[]): string | null {
  let latest: string | null = null;
  for (const r of rows) {
    const any = r.closedWon != null || r.newPipeline != null || r.meetingsHeld != null || r.meetingsScheduled != null;
    if (any && (!latest || r.month > latest)) latest = r.month;
  }
  return latest;
}

export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
}
