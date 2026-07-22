# Signal — Historical data staging (v2 rebuild)

Assembled 2026-07-06 from Clay's exports. These files feed the one-time historical
import; going forward the same DB tables are fed live by webhooks.

## Canonical rules (per Clay)
- **Results source of truth = "MSP Results" tab** of "StudioGTM Team - Sales 2026"
  (sheet id `1DNyVThnZrbavoi-idnJBHxK92zQd6LSmn-JW0BQ7Vl0`). Per-client tabs
  (incl. SecondChair FFES) are diagnostics/working sheets — do NOT import from them.
- Historical scope = results only (closed won, pipeline, meetings booked/held)
  plus whatever activity rollups exist. No historical contact/account imports.
- Rates are always computed from raw counts by the metrics engine, never imported.

## Files
| File | Grain | Source |
|---|---|---|
| `clients.csv` | client | MSP Results row labels (status + engagement dates) |
| `results_monthly.csv` | client × month | MSP Results tab (canonical) |
| `calls_monthly.csv` | client × month | Snoball: Nooks Analytics screenshots (Feb–Jun 2026); SecondChair: Sales-2026 rollup |
| `secondchair_email_campaigns.csv` | campaign | Sales-2026 rollup |
| `flax_calls_by_list.csv` | list | "Flax Dials Data ALL TIME" workbook (sdr_dialer + blake_clay segments) |
| `flax_calls_segments.csv` | dialer segment | same workbook (incl. Trellus/Brandon totals + all-time header totals) |
| `flax_linkedin_campaigns.csv` | campaign | "LGM Campaign Report (LinkedIn+Email)" workbook |

## Known gaps / open questions (awaiting Clay)
- Snoball **January** calling data (screenshots start Feb 2; engagement started Jan 1).
- Snoball email + LinkedIn history (links not yet provided).
- Flax email: is the LGM report the email source of truth, or is there a separate export?
- Activity history for YetiConnect / Screensteps / Roster / Arya — exists anywhere?
- Screensteps results: only closed-won ($0) present; pipeline/meetings blank in MSP Results.
- Note: Nooks "dial to connect %" on screenshots differs slightly from connects÷dials
  (Nooks excludes callback-driven connects); we store raw counts only.
