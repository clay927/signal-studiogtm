import { describe, it, expect } from "vitest";
import { parseMeetingsCsv } from "./csv";
import { deriveResults } from "./metrics";

describe("parseMeetingsCsv", () => {
  it("parses a template CSV with quoted notes containing commas", () => {
    const csv = [
      "Name,Company,Title,Campaign,Stage,Date Scheduled,Attended,Deal Value,Rep,Note",
      '"Desiree O.","Texas Dermatology","Marketing","MedSpa","demo_set","2026-06-30","","18000","Derek","Interested, aligned, scheduled a demo"',
      '"Marcus Web","Radiance Aesthetics","Owner","MedSpa","won","2026-06-18","yes","26000","Derek","Closed, 12-month deal"',
    ].join("\n");

    const r = parseMeetingsCsv(csv);
    expect(r.errors).toHaveLength(0);
    expect(r.meetings).toHaveLength(2);
    expect(r.meetings[0].note).toBe("Interested, aligned, scheduled a demo");
    expect(r.meetings[0].value).toBe(18000);
    expect(r.meetings[1].stage).toBe("won");
    expect(r.meetings[1].attended).toBe(true);
    expect(r.stats.withValue).toBe(2);
  });

  it("computes accurate results from parsed rows", () => {
    const csv = [
      "Name,Company,Stage,Attended,Deal Value",
      "A,Co A,won,yes,20000",
      "B,Co B,held,yes,15000",
      "C,Co C,no_show,no,0",
      "D,Co D,demo_set,,18000",
    ].join("\n");

    const r = parseMeetingsCsv(csv);
    const res = deriveResults(r.meetings);
    expect(res.meetingsScheduled).toBe(4);
    expect(res.meetingsHeld).toBe(2); // won + held, both attended
    expect(res.holdRate).toBe(67); // 2 held / 3 occurred
    expect(res.closedWon).toBe(20000);
    expect(res.newPipeline).toBe(33000); // held 15000 + demo_set 18000
  });

  it("warns (not errors) when the deal value column is missing", () => {
    const csv = ["Name,Company,Stage,Attended", "A,Co A,held,yes"].join("\n");
    const r = parseMeetingsCsv(csv);
    expect(r.errors).toHaveLength(0);
    expect(r.warnings.some((w) => w.toLowerCase().includes("deal value"))).toBe(true);
  });

  it("infers stage when unknown and records a warning", () => {
    const csv = ["Name,Company,Stage,Attended", "A,Co A,banana,yes"].join("\n");
    const r = parseMeetingsCsv(csv);
    expect(r.meetings[0].stage).toBe("held"); // inferred from attended=yes
    expect(r.warnings.some((w) => w.includes("banana"))).toBe(true);
  });

  it("errors clearly when the name/company columns are absent", () => {
    const csv = ["Foo,Bar", "1,2"].join("\n");
    const r = parseMeetingsCsv(csv);
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.meetings).toHaveLength(0);
  });

  it("maps the legacy YetiConnect tracker headers (List, Note)", () => {
    const csv = [
      "Client,List,Name,Company,Date Scheduled,Attended,Note,Rep",
      "YetiConnect,MedSpa,Noah England,Piedmont,2026-07-02,,Interested COO,Derek",
    ].join("\n");
    const r = parseMeetingsCsv(csv);
    expect(r.meetings).toHaveLength(1);
    expect(r.meetings[0].campaign).toBe("MedSpa");
    expect(r.meetings[0].note).toBe("Interested COO");
    expect(r.meetings[0].rep).toBe("Derek");
  });
});
