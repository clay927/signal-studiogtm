# Signal — StudioGTM

Signal is StudioGTM's single source of truth: results, activity, projects, and
insights for every client engagement. It embodies the StudioGTM value to
**over-communicate** — clients, reps, and owners all see the same reporting,
scoped by access.

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- `next-themes` (per-user light/dark) · `lucide-react` icons

## Design

Brand DNA is navy / ivory / gold with a serif for hero numbers (Fraunces) and a
clean sans for everything else (Inter). One shared reporting UI for everyone —
roles change **access scope only**, never the layout.

Direction: "warm command center" (Attio/Notion clarity + Slack warmth) with the
insight headline and benchmark health woven into every screen. Owner Portfolio
uses a denser, board-ready treatment.

## Modules

- **Home** — insight headline, MTD results/activity, Wins Feed, open projects
- **Results** — scoreboard + pipeline drill-down (click any row)
- **Activity** — phone / email / LinkedIn + Active Leads capacity
- **Projects** — pizza-tracker lifecycle, owner aggregate view
- **Client brain** — Diagnostic (Data, Channel Fit, Message-Market Fit, Sales
  Unit Economics calculator) + Strategy Meetings, deep-linked to each client's
  Drive folders
- **Portfolio** (owner only) — all-clients health grid + churn-risk flags
- **Settings** — profile, admin users/clients, onboarding intake flow

## Data contract

All numbers are currently **sample data** (clearly labeled in the UI). The types
in `src/lib/types.ts` mirror the StudioGTM Google Sheet workbook contract so live
data is a drop-in swap:

| Signal type | Source workbook |
| --- | --- |
| `ResultsSummary` + `Meeting[]` | Results workbook (tab per client) |
| `PhoneStats` | Calls workbook |
| `EmailStats` + `Reply[]` | Emails workbook |
| `LinkedInStats` + `Reply[]` | LinkedIn workbook |
| `ActiveLeads` | Active Contacts workbook (Apollo) |

Roadmap: sheets first (admin-vetted), then live webhooks. Mock data lives in
`src/lib/data.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

The demo role switcher (bottom-left user menu → "Preview as") lets you see the
same UI as an owner, SDR, client founder, or client team member.
