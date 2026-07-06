#!/usr/bin/env python3
"""Generate public/data/call-log.json from the per-call Orum export.

Run from the repo root: python3 scripts/gen_call_log.py
Source: data/historical/orum_calls_export_jun11_jul6.csv (2,447 calls,
Jun 11 - Jul 6 2026, YetiConnect + Screensteps mixed in one export).

Client attribution: by List prefix, falling back to Lists/Tags. The two
"Manually Dialed" rows with no list are skipped (unattributable).

Served as a static asset and fetched lazily by the Call log component —
too large to bundle into the app module.
"""
import csv
import json
from datetime import datetime

SRC = "data/historical/orum_calls_export_jun11_jul6.csv"
OUT = "public/data/call-log.json"

TZ_OFFSET = {"MDT": "-06:00", "MST": "-07:00", "PDT": "-07:00", "PST": "-08:00", "CDT": "-05:00", "CST": "-06:00", "EDT": "-04:00", "EST": "-05:00"}


def client_of(r):
    l = r["List"] or ""
    if l.startswith(("YetiConnect", "YC", "WF - Roof")):
        return "yeticonnect"
    if l.startswith(("SS ", "MA - SS", "CT-Edge")):
        return "screensteps"
    if "yc" in (r["Lists/Tags"] or "").lower():
        return "yeticonnect"
    return None


def iso_at(s):
    # "7/6/2026 2:53 PM MDT"
    try:
        parts = s.rsplit(" ", 1)
        dt = datetime.strptime(parts[0], "%m/%d/%Y %I:%M %p")
        return dt.strftime("%Y-%m-%dT%H:%M:%S") + TZ_OFFSET.get(parts[1] if len(parts) > 1 else "", "")
    except Exception:
        return ""


def tone_of(r):
    disp = (r["Disposition"] or "").lower()
    if r["Led to a Meeting"] == "true":
        return "good"
    if r["Led to a Conversation"] == "true":
        return "bad" if ("not interested" in disp or "disqualified" in disp) else "good"
    if r["Led to a Connect"] == "true":
        return "warn"
    return "neutral"


def main():
    with open(SRC, encoding="utf-8-sig") as f:
        data = list(csv.DictReader(f))

    rows = []
    skipped = 0
    for r in data:
        client = client_of(r)
        if not client:
            skipped += 1
            continue
        rows.append(
            {
                "c": client,
                "at": iso_at(r["Called At"]),
                "name": r["Prospect"] or "—",
                "co": r["Account"] or r["Contact Company Name"] or "",
                "rep": r["Rep"] or "—",
                "out": r["Disposition"] or "—",
                "tone": tone_of(r),
                "rec": r["Recording"] or "",
                "list": r["List"] or "",
            }
        )

    rows.sort(key=lambda x: x["at"], reverse=True)
    with open(OUT, "w") as f:
        json.dump(rows, f, separators=(",", ":"))
    print(f"wrote {OUT}: {len(rows)} calls ({skipped} unattributable rows skipped)")


if __name__ == "__main__":
    main()
