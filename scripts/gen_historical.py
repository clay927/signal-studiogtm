#!/usr/bin/env python3
"""Regenerate src/lib/historical.ts from data/historical/*.csv.

Run from the repo root: python3 scripts/gen_historical.py
The CSVs are the source of truth for imported history; this keeps the app
module byte-identical to them (no hand-copied numbers).
"""
import csv


def read(f):
    with open(f"data/historical/{f}") as fh:
        return list(csv.DictReader(fh))


def num(v):
    if v is None or v == "":
        return "null"
    f = float(v)
    return str(int(f)) if f == int(f) else str(f)


def main():
    clients = read("clients.csv")
    results = read("results_monthly.csv")
    calls = read("calls_monthly.csv")
    emails = read("secondchair_email_campaigns.csv")
    lists_ = read("flax_calls_by_list.csv")
    lgm = read("flax_linkedin_campaigns.csv")

    out = []
    out.append('''// GENERATED from data/historical/*.csv — do not edit by hand.
// Regenerate with: python3 scripts/gen_historical.py
// Sources: MSP Results tab (canonical results), Nooks Analytics screenshots
// (Snoball calls), Sales-2026 rollup (SecondChair), Flax dial + LGM workbooks.

export interface ClientMeta {
  id: string;
  name: string;
  status: "active" | "inactive";
  serviceType: string;
  engagementStart: string;
  engagementEnd: string | null;
}

export interface MonthlyResults {
  clientId: string;
  month: string; // YYYY-MM
  closedWon: number | null;
  newPipeline: number | null;
  meetingsHeld: number | null;
  meetingsScheduled: number | null;
}

export interface MonthlyCalls {
  clientId: string;
  month: string;
  dials: number;
  callbacks: number | null;
  connects: number;
  conversations: number;
  meetings: number;
}

export interface EmailCampaign {
  clientId: string;
  campaign: string;
  contacts: number;
  sent: number;
  bounceRate: number;
  replies: number;
}

export interface LinkedInCampaign {
  campaign: string;
  contacted: number;
  replies: number;
}

export interface CallList {
  segment: string;
  list: string;
  dials: number;
  connects: number;
  conversations: number;
  meetings: number;
}
''')

    out.append("export const CLIENT_ROSTER: ClientMeta[] = [")
    for c in clients:
        status = "active" if c["status"] == "active" else "inactive"
        end = f'"{c["engagement_end"]}"' if c["engagement_end"] else "null"
        st = c["service_type"].upper() if c["service_type"] == "msp" else c["service_type"].capitalize()
        out.append(
            f'  {{ id: "{c["client"]}", name: "{c["display_name"]}", status: "{status}", serviceType: "{st}", engagementStart: "{c["engagement_start"]}", engagementEnd: {end} }},'
        )
    out.append("];\n")

    out.append("export const RESULTS_MONTHLY: MonthlyResults[] = [")
    for r in results:
        out.append(
            f'  {{ clientId: "{r["client"]}", month: "{r["month"]}", closedWon: {num(r["closed_won"])}, newPipeline: {num(r["new_pipeline"])}, meetingsHeld: {num(r["meetings_held"])}, meetingsScheduled: {num(r["meetings_scheduled"])} }},'
        )
    out.append("];\n")

    out.append("export const CALLS_MONTHLY: MonthlyCalls[] = [")
    for r in calls:
        out.append(
            f'  {{ clientId: "{r["client"]}", month: "{r["month"]}", dials: {num(r["dials"])}, callbacks: {num(r["callbacks"])}, connects: {num(r["connects"])}, conversations: {num(r["conversations"])}, meetings: {num(r["meetings_scheduled"])} }},'
        )
    out.append("];\n")

    out.append("export const EMAIL_CAMPAIGNS: EmailCampaign[] = [")
    for r in emails:
        out.append(
            f'  {{ clientId: "{r["client"]}", campaign: "{r["campaign"]}", contacts: {num(r["contacts"])}, sent: {num(r["emails_sent"])}, bounceRate: {num(r["bounce_rate"])}, replies: {num(r["replies"])} }},'
        )
    out.append("];\n")

    lgm_rows = sorted(lgm, key=lambda r: -float(r["Replied"] or 0))
    out.append("// Flax LGM (LinkedIn) — campaign-level; totals from report Overview tab.")
    out.append(
        "export const FLAX_LINKEDIN_TOTALS = { contacted: 2274, replies: 217, won: 13, audiences: 17, campaignsLaunched: 16 };\n"
    )
    out.append("export const FLAX_LINKEDIN_CAMPAIGNS: LinkedInCampaign[] = [")
    for r in lgm_rows:
        name = r["Campaign"].replace('"', '\\"')
        out.append(f'  {{ campaign: "{name}", contacted: {num(r["Contacted"])}, replies: {num(r["Replied"])} }},')
    out.append("];\n")

    lists_rows = sorted(lists_, key=lambda r: -float(r["dials"] or 0))
    out.append("export const FLAX_CALL_LISTS: CallList[] = [")
    for r in lists_rows:
        name = r["list_name"].replace('"', '\\"')
        out.append(
            f'  {{ segment: "{r["segment"]}", list: "{name}", dials: {num(r["dials"])}, connects: {num(r["connects"])}, conversations: {num(r["conversations"])}, meetings: {num(r["meetings"])} }},'
        )
    out.append("];\n")

    out.append("// All-time Flax dial totals across all dialer segments (workbook header).")
    out.append("export const FLAX_CALL_TOTALS = { dials: 9578, connects: 405, conversations: 196, meetings: 29 };")

    with open("src/lib/historical.ts", "w") as fh:
        fh.write("\n".join(out) + "\n")
    print(f"wrote src/lib/historical.ts ({len(out)} lines)")


if __name__ == "__main__":
    main()
