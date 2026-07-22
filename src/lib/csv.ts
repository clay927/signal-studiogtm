import Papa from "papaparse";
import type { Meeting, MeetingStage } from "./types";

// Parse a vetted Results/meetings CSV into Signal meeting rows.
// Accepts the current YetiConnect tracker headers AND the Signal template
// headers, so exports from either work. Every row is validated; problems are
// reported (never silently dropped) so you can trust what came in.

const STAGES: MeetingStage[] = ["demo_set", "follow_up", "nurture", "held", "won", "no_show"];

// header alias -> canonical field. Compared case-insensitively, trimmed.
const ALIASES: Record<string, string[]> = {
  name: ["name", "contact", "full name", "prospect"],
  company: ["company", "account", "organization"],
  title: ["title", "role"],
  campaign: ["campaign", "list"],
  stage: ["stage", "status"],
  dateScheduled: ["date scheduled", "meeting date", "date", "scheduled"],
  attended: ["attended", "held", "showed"],
  value: ["deal value", "value", "amount", "deal amount"],
  rep: ["rep", "sdr", "booked by"],
  note: ["note", "notes", "summary", "call summary"],
  phone: ["phone", "phone number"],
  email: ["email", "email address"],
  linkedin: ["linkedin", "linkedin url"],
  transcript: ["transcript", "recording"],
};

export interface ImportResult {
  meetings: Meeting[];
  errors: string[];
  warnings: string[];
  stats: {
    totalRows: number;
    imported: number;
    withValue: number;
    withStage: number;
    withAttendance: number;
  };
}

function buildColumnMap(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  const norm = headers.map((h) => ({ raw: h, key: h.trim().toLowerCase() }));
  for (const [field, aliases] of Object.entries(ALIASES)) {
    const hit = norm.find((h) => aliases.includes(h.key));
    if (hit) map[field] = hit.raw;
  }
  return map;
}

function parseAttended(v: string): boolean | null {
  const s = (v || "").trim().toLowerCase();
  if (!s) return null;
  if (["yes", "y", "true", "1", "held", "attended", "showed"].includes(s)) return true;
  if (["no", "n", "false", "0", "no-show", "no show", "noshow", "missed"].includes(s)) return false;
  return null;
}

function parseValue(v: string): number {
  if (!v) return 0;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return isFinite(n) ? n : 0;
}

function inferStage(attended: boolean | null, value: number): MeetingStage {
  if (attended === true) return "held";
  if (attended === false) return "no_show";
  return value > 0 ? "follow_up" : "demo_set";
}

export function parseMeetingsCsv(csvText: string): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const meetings: Meeting[] = [];

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    for (const e of parsed.errors.slice(0, 5)) {
      warnings.push(`Row ${typeof e.row === "number" ? e.row + 2 : "?"}: ${e.message}`);
    }
  }

  const rows = parsed.data || [];
  if (!rows.length) {
    errors.push("No data rows found. Is the file empty or missing a header row?");
    return { meetings, errors, warnings, stats: emptyStats() };
  }

  const headers = parsed.meta.fields || [];
  const col = buildColumnMap(headers);

  if (!col.name && !col.company) {
    errors.push(
      'Could not find a "Name" or "Company" column. Check the header row against the template.'
    );
    return { meetings, errors, warnings, stats: { ...emptyStats(), totalRows: rows.length } };
  }
  if (!col.dateScheduled) warnings.push('No "Date Scheduled" column found — meeting dates will be blank.');
  if (!col.value) warnings.push('No "Deal Value" column found — pipeline $ can\'t be calculated. Add a "Deal Value" column to enable it.');
  if (!col.stage) warnings.push('No "Stage" column — stages will be inferred from attendance.');

  let withValue = 0;
  let withStage = 0;
  let withAttendance = 0;

  rows.forEach((row, i) => {
    const line = i + 2; // account for header row + 1-indexing
    const get = (field: string) => (col[field] ? (row[col[field]] || "").trim() : "");

    const name = get("name");
    const company = get("company");
    if (!name && !company) {
      warnings.push(`Row ${line}: skipped — no name or company.`);
      return;
    }

    const attendedRaw = get("attended");
    const attended = parseAttended(attendedRaw);
    if (attendedRaw && attended === null) {
      warnings.push(`Row ${line}: couldn't read attendance "${attendedRaw}" — treated as not yet held.`);
    }
    if (attended !== null) withAttendance++;

    const value = parseValue(get("value"));
    if (value > 0) withValue++;

    let stage: MeetingStage;
    const stageRaw = get("stage").toLowerCase().replace(/[\s-]/g, "_");
    if (stageRaw && STAGES.includes(stageRaw as MeetingStage)) {
      stage = stageRaw as MeetingStage;
      withStage++;
    } else {
      if (stageRaw) warnings.push(`Row ${line}: unknown stage "${get("stage")}" — inferred instead.`);
      stage = inferStage(attended, value);
    }

    meetings.push({
      id: `imp-${i}`,
      name: name || company,
      company: company || name,
      title: get("title") || undefined,
      campaign: get("campaign") || "Imported",
      stage,
      dateScheduled: get("dateScheduled"),
      attended,
      rep: get("rep") || "—",
      value,
      note: get("note"),
      phone: get("phone") || undefined,
      email: get("email") || undefined,
      linkedin: get("linkedin") || undefined,
      transcript: get("transcript") || undefined,
      featured: stage === "won" || attended === true,
    });
  });

  return {
    meetings,
    errors,
    warnings,
    stats: {
      totalRows: rows.length,
      imported: meetings.length,
      withValue,
      withStage,
      withAttendance,
    },
  };
}

function emptyStats() {
  return { totalRows: 0, imported: 0, withValue: 0, withStage: 0, withAttendance: 0 };
}

export function meetingsTemplateCsv(): string {
  const headers = [
    "Name",
    "Company",
    "Title",
    "Campaign",
    "Stage",
    "Date Scheduled",
    "Attended",
    "Deal Value",
    "Rep",
    "Note",
    "Phone",
    "Email",
    "LinkedIn",
    "Transcript",
  ];
  const example = [
    "Desiree O.",
    "Texas Dermatology and Laser Specialists",
    "Marketing",
    "MedSpa – Derek",
    "demo_set",
    "2026-06-30",
    "",
    "18000",
    "Derek",
    "Interested — scheduled a Zoom demo.",
    "(210) 707-9050",
    "desiree@texasdls.com",
    "",
    "",
  ];
  const example2 = [
    "Marcus Web",
    "Radiance Aesthetics",
    "Owner",
    "MedSpa – Derek",
    "won",
    "2026-06-18",
    "yes",
    "26000",
    "Derek",
    "Demo held and closed — 12-month agreement.",
    "",
    "",
    "",
    "",
  ];
  return Papa.unparse({ fields: headers, data: [example, example2] });
}
