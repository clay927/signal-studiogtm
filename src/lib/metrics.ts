// Pando metrics engine — the single, audited source of every derived number.
//
// ACCURACY CONTRACT: all rate/summary math lives here (not scattered in
// components) so it can be unit-tested and reasoned about. Definitions are
// documented per-function; when we wire real sheet data, these are the rules
// that turn raw rows into the numbers clients see. Change a definition here and
// every screen + every test updates together.

import type { Meeting, ResultsSummary, UnitEconomics } from "./types";

export type Health = "good" | "warn" | "bad";

/** Percentage of part out of whole (0-100). Guards divide-by-zero. */
export function rate(part: number, whole: number): number {
  if (!whole || whole <= 0) return 0;
  return (part / whole) * 100;
}

/**
 * Health color for a value vs. its benchmark. One rule, everywhere.
 * ratio = how the value compares to benchmark (direction-aware):
 * - >= 0.95 (at/near or above benchmark) -> good
 * - >= 0.80 (up to 20% below)            -> warn
 * - <  0.80                              -> bad
 */
export function benchmarkStatus(
  value: number,
  benchmark: number,
  higherIsBetter = true
): Health {
  if (!benchmark || benchmark <= 0) return "warn";
  const ratio = higherIsBetter ? value / benchmark : benchmark / value;
  if (ratio >= 0.95) return "good";
  if (ratio >= 0.8) return "warn";
  return "bad";
}

/** Meeting hold-rate health. Benchmark is 82%. */
export function holdStatus(holdRate: number): Health {
  if (holdRate >= 82) return "good";
  if (holdRate >= 65) return "warn";
  return "bad";
}

/**
 * Lead capacity: are there enough active leads to keep the team fed?
 * Returns the percent-of-target (capped at 100) and its health.
 */
export function capacity(attempting: number, target: number): { pct: number; status: Health } {
  if (!target || target <= 0) return { pct: 0, status: "bad" };
  const pct = Math.min(100, Math.round((attempting / target) * 100));
  const status: Health = pct >= 90 ? "good" : pct >= 70 ? "warn" : "bad";
  return { pct, status };
}

export interface UnitEconomicsResult {
  meetingsHeld: number;
  newCustomers: number;
  monthlyRevenue: number;
  annualRevenue: number;
  roi: number;
  costPerMeeting: number;
}

/**
 * Project the SDR/GTM program's economics from inputs.
 *   held        = meetings booked × show rate
 *   customers   = held × opportunity-to-win rate
 *   revenue     = customers × average deal value
 *   roi         = monthly revenue ÷ program cost
 */
export function projectUnitEconomics(input: UnitEconomics): UnitEconomicsResult {
  const meetingsHeld = input.meetingsPerMonth * (input.showRate / 100);
  const newCustomers = meetingsHeld * (input.oppToWin / 100);
  const monthlyRevenue = newCustomers * input.avgDealValue;
  const annualRevenue = monthlyRevenue * 12;
  const roi = input.programCost > 0 ? monthlyRevenue / input.programCost : 0;
  const costPerMeeting = meetingsHeld > 0 ? input.programCost / meetingsHeld : 0;
  return { meetingsHeld, newCustomers, monthlyRevenue, annualRevenue, roi, costPerMeeting };
}

const PIPELINE_STAGES: Meeting["stage"][] = ["demo_set", "follow_up", "nurture", "held"];

/**
 * Derive the Results scoreboard from raw meeting rows. This is how live sheet
 * data becomes the top-line numbers.
 *   scheduled  = every meeting row (each row is a booked meeting)
 *   held       = rows marked attended === true
 *   noShow     = rows marked attended === false
 *   holdRate   = held ÷ (held + noShow)  — only counts meetings that occurred
 *   pipeline   = sum(value) of open stages; opps = their count
 *   closedWon  = sum(value) of stage === "won"
 * Deltas (vs last month) can't be derived from a single snapshot, so they are
 * passed through / defaulted to 0 here.
 */
export function deriveResults(meetings: Meeting[]): ResultsSummary {
  const scheduled = meetings.length;
  const held = meetings.filter((m) => m.attended === true).length;
  const noShow = meetings.filter((m) => m.attended === false).length;
  const occurred = held + noShow;
  const holdRate = occurred > 0 ? (held / occurred) * 100 : 0;

  const pipelineRows = meetings.filter((m) => PIPELINE_STAGES.includes(m.stage));
  const newPipeline = pipelineRows.reduce((sum, m) => sum + (m.value || 0), 0);
  const closedWon = meetings
    .filter((m) => m.stage === "won")
    .reduce((sum, m) => sum + (m.value || 0), 0);

  return {
    closedWon,
    newPipeline,
    meetingsHeld: held,
    meetingsScheduled: scheduled,
    holdRate: Math.round(holdRate),
    closedWonDelta: 0,
    meetingsHeldDelta: 0,
    pipelineOpps: pipelineRows.length,
  };
}
