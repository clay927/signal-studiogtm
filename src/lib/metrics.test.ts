import { describe, it, expect } from "vitest";
import {
  rate,
  benchmarkStatus,
  holdStatus,
  capacity,
  projectUnitEconomics,
  deriveResults,
} from "./metrics";
import type { Meeting } from "./types";

describe("rate", () => {
  it("computes a percentage", () => {
    expect(rate(50, 200)).toBe(25);
  });
  it("guards divide-by-zero", () => {
    expect(rate(5, 0)).toBe(0);
    expect(rate(5, -1)).toBe(0);
  });
});

describe("benchmarkStatus", () => {
  it("good when at or above benchmark (higher is better)", () => {
    expect(benchmarkStatus(4.1, 1.8, true)).toBe("good");
    expect(benchmarkStatus(1.8, 1.8, true)).toBe("good");
  });
  it("warn when within 15% below benchmark", () => {
    expect(benchmarkStatus(8.2, 10, true)).toBe("warn"); // 0.82 ratio
  });
  it("bad when well below benchmark", () => {
    expect(benchmarkStatus(6.8, 10, true)).toBe("bad"); // 0.68 ratio
  });
  it("handles lower-is-better metrics", () => {
    expect(benchmarkStatus(5, 10, false)).toBe("good"); // 5 is better than 10
  });
});

describe("holdStatus", () => {
  it("colors by threshold", () => {
    expect(holdStatus(84)).toBe("good");
    expect(holdStatus(78)).toBe("warn");
    expect(holdStatus(44)).toBe("bad");
  });
});

describe("capacity", () => {
  it("computes percent of target and health", () => {
    expect(capacity(612, 700)).toEqual({ pct: 87, status: "warn" });
    expect(capacity(940, 900)).toEqual({ pct: 100, status: "good" });
    expect(capacity(240, 500)).toEqual({ pct: 48, status: "bad" });
  });
  it("guards zero target", () => {
    expect(capacity(100, 0)).toEqual({ pct: 0, status: "bad" });
  });
});

describe("projectUnitEconomics", () => {
  it("projects revenue and ROI from inputs", () => {
    const r = projectUnitEconomics({
      meetingsPerMonth: 18,
      showRate: 78,
      oppToWin: 22,
      avgDealValue: 24000,
      programCost: 6500,
    });
    expect(r.meetingsHeld).toBeCloseTo(14.04, 2);
    expect(r.newCustomers).toBeCloseTo(3.0888, 3);
    expect(r.monthlyRevenue).toBeCloseTo(74131.2, 1);
    expect(r.annualRevenue).toBeCloseTo(889574.4, 1);
    expect(r.roi).toBeCloseTo(11.4, 1);
    expect(r.costPerMeeting).toBeCloseTo(463.0, 0);
  });
  it("guards zero program cost", () => {
    const r = projectUnitEconomics({
      meetingsPerMonth: 10,
      showRate: 100,
      oppToWin: 100,
      avgDealValue: 1000,
      programCost: 0,
    });
    expect(r.roi).toBe(0);
    expect(r.costPerMeeting).toBe(0);
  });
});

describe("deriveResults", () => {
  const meetings: Meeting[] = [
    { id: "1", name: "A", company: "Co A", campaign: "c", stage: "won", dateScheduled: "2026-06-01", attended: true, rep: "Derek", value: 20000, note: "" },
    { id: "2", name: "B", company: "Co B", campaign: "c", stage: "held", dateScheduled: "2026-06-02", attended: true, rep: "Derek", value: 15000, note: "" },
    { id: "3", name: "C", company: "Co C", campaign: "c", stage: "no_show", dateScheduled: "2026-06-03", attended: false, rep: "Derek", value: 0, note: "" },
    { id: "4", name: "D", company: "Co D", campaign: "c", stage: "demo_set", dateScheduled: "2026-07-10", attended: null, rep: "Derek", value: 18000, note: "" },
    { id: "5", name: "E", company: "Co E", campaign: "c", stage: "follow_up", dateScheduled: "2026-07-12", attended: null, rep: "Derek", value: 12000, note: "" },
  ];

  it("counts scheduled, held, and hold rate from occurred meetings only", () => {
    const r = deriveResults(meetings);
    expect(r.meetingsScheduled).toBe(5);
    expect(r.meetingsHeld).toBe(2); // attended === true
    // occurred = held(2) + noShow(1) = 3; holdRate = 2/3 = 67
    expect(r.holdRate).toBe(67);
  });

  it("sums pipeline (open stages) and closed won separately", () => {
    const r = deriveResults(meetings);
    // pipeline = held(15000) + demo_set(18000) + follow_up(12000) = 45000
    expect(r.newPipeline).toBe(45000);
    expect(r.pipelineOpps).toBe(3);
    expect(r.closedWon).toBe(20000);
  });

  it("handles an empty set without dividing by zero", () => {
    const r = deriveResults([]);
    expect(r).toMatchObject({ meetingsScheduled: 0, meetingsHeld: 0, holdRate: 0, newPipeline: 0, closedWon: 0 });
  });
});
