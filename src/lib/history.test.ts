import { describe, expect, it } from "vitest";
import {
  filterMonthly,
  latestDataMonth,
  mergeMonthly,
  monthsBetween,
  monthsForRange,
  perClientTotals,
  seriesByMonth,
  totalResults,
} from "./history";
import { CLIENT_ROSTER, RESULTS_MONTHLY } from "./historical";

const JUL_6 = new Date(Date.UTC(2026, 6, 6)); // 2026-07-06

describe("monthsForRange", () => {
  it("this_month = current month only", () => {
    expect(monthsForRange("this_month", JUL_6)).toEqual(["2026-07"]);
  });
  it("quarter = quarter start through current month", () => {
    expect(monthsForRange("quarter", JUL_6)).toEqual(["2026-07"]);
    expect(monthsForRange("quarter", new Date(Date.UTC(2026, 8, 15)))).toEqual(["2026-07", "2026-08", "2026-09"]);
  });
  it("ytd = January through current month", () => {
    expect(monthsForRange("ytd", JUL_6)).toEqual([
      "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07",
    ]);
  });
});

describe("totals against the canonical MSP Results import", () => {
  const ytd = monthsForRange("ytd", JUL_6);
  const allClients = new Set(CLIENT_ROSTER.map((c) => c.id));
  const rows = filterMonthly(RESULTS_MONTHLY, allClients, ytd);

  it("book YTD matches the sheet's own totals row", () => {
    const t = totalResults(rows);
    expect(t.closedWon).toBe(607582);
    expect(t.newPipeline).toBe(7466183);
    expect(t.meetingsHeld).toBe(261);
    expect(t.meetingsScheduled).toBe(470);
    expect(t.holdRate).toBeCloseTo(261 / 470, 10);
  });

  it("per-client totals match the sheet (Snoball, Flax)", () => {
    const per = perClientTotals(rows, ["snoball", "flax"]);
    expect(per.get("snoball")!.closedWon).toBe(414516);
    expect(per.get("snoball")!.meetingsHeld).toBe(199);
    expect(per.get("snoball")!.meetingsScheduled).toBe(345);
    expect(per.get("flax")!.closedWon).toBe(130000);
    expect(per.get("flax")!.newPipeline).toBe(5586000);
  });

  it("monthly series matches the sheet's book-wide monthly rollup", () => {
    const series = seriesByMonth(rows, ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]);
    expect(series.map((p) => p.held)).toEqual([42, 31, 48, 47, 58, 35]);
    expect(series.map((p) => p.scheduled)).toEqual([108, 75, 87, 58, 83, 59]);
  });

  it("screensteps has closed-won data but no meetings data (nulls stay null)", () => {
    const t = totalResults(RESULTS_MONTHLY.filter((r) => r.clientId === "screensteps"));
    expect(t.closedWon).toBe(0);
    expect(t.meetingsScheduled).toBe(0);
    expect(t.holdRate).toBeNull(); // never fabricated
    expect(t.hasData).toBe(true);
  });
});

describe("monthsBetween (custom range)", () => {
  it("inclusive span", () => {
    expect(monthsBetween("2026-02", "2026-05")).toEqual(["2026-02", "2026-03", "2026-04", "2026-05"]);
  });
  it("single month + order-tolerant + year boundary", () => {
    expect(monthsBetween("2026-04", "2026-04")).toEqual(["2026-04"]);
    expect(monthsBetween("2026-02", "2025-12")).toEqual(["2025-12", "2026-01", "2026-02"]);
  });
  it("rejects malformed input", () => {
    expect(monthsBetween("garbage", "2026-05")).toEqual([]);
  });
});

describe("mergeMonthly", () => {
  it("override rows win on (client, month); others pass through", () => {
    const base = [
      { clientId: "a", month: "2026-01", v: 1 },
      { clientId: "a", month: "2026-02", v: 2 },
    ];
    const merged = mergeMonthly(base, [{ clientId: "a", month: "2026-02", v: 99 }]);
    expect(merged.find((r) => r.month === "2026-02")!.v).toBe(99);
    expect(merged).toHaveLength(2);
  });
});

describe("latestDataMonth", () => {
  it("finds the newest month with any value", () => {
    expect(latestDataMonth(RESULTS_MONTHLY)).toBe("2026-06");
  });
  it("returns null when every field is null", () => {
    expect(
      latestDataMonth([{ clientId: "x", month: "2026-03", closedWon: null, newPipeline: null, meetingsHeld: null, meetingsScheduled: null }])
    ).toBeNull();
  });
});
