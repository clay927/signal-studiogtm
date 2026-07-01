import type { ClientData, User } from "./types";

// SAMPLE DATA. Every number here is illustrative and clearly labeled as sample
// in the UI. Real Signal reads from admin-vetted Google Sheet workbooks
// (Results / Calls / Emails / LinkedIn / Active Contacts), then live webhooks.
// The YetiConnect meeting rows are drawn from a real StudioGTM cold-call tracker.

const LAST_UPDATED = "Jul 1, 2026 · 8:04 AM";

export const CLIENTS: Record<string, ClientData> = {
  yeticonnect: {
    client: {
      id: "yeticonnect",
      name: "YetiConnect",
      slug: "yeticonnect",
      industry: "AI conversation platform (med spa + automotive)",
      serviceType: "MSP",
      accountOwner: "Blake Harber",
      sdrs: ["Derek"],
      status: "active",
      startDate: "2026-05-12",
      drive: {
        data: "https://drive.google.com/drive/folders/1TeZnZ6TIfz4OD-GVK9OXO5XNld6hhJED",
        channel: "#",
        messaging: "#",
        agreements: "#",
        working: "#",
      },
    },
    results: {
      closedWon: 0,
      newPipeline: 0,
      meetingsHeld: 0,
      meetingsScheduled: 0,
      holdRate: 0,
      closedWonDelta: 0,
      meetingsHeldDelta: 0,
      pipelineOpps: 0,
    },
    meetings: [],
    phone: { dials: 0, connects: 0, conversations: 0, meetings: 0 },
    email: { sent: 0, opens: 0, replies: 0, positiveReplies: 0 },
    linkedin: { contacts: 0, connects: 0, replies: 0, positiveReplies: 0 },
    replies: [],
    activeLeads: {
      attempting: 0,
      unworked: 0,
      target: 700,
      statuses: [{ label: "Yet to be worked", count: 0 }],
    },
    benchmarks: [],
    campaigns: [],
    projects: [],
    unitEconomics: {
      meetingsPerMonth: 18,
      showRate: 78,
      oppToWin: 22,
      avgDealValue: 24000,
      programCost: 6500,
    },
    insight:
      "YetiConnect is cleared and ready for live data. Connect the dialer, email, and LinkedIn tools in Settings \u2192 Connectors and activity will stream in.",
    lastUpdated: LAST_UPDATED,
  },
  pontelabor: {
    client: {
      id: "pontelabor",
      name: "Ponte Labor",
      slug: "pontelabor",
      industry: "Labor & staffing",
      serviceType: "Diagnostic",
      accountOwner: "Clay Tirrell",
      sdrs: ["Maria"],
      status: "onboarding",
      startDate: "2026-07-07",
      drive: {
        data: "https://drive.google.com/drive/folders/1TeZnZ6TIfz4OD-GVK9OXO5XNld6hhJED",
        channel: "https://drive.google.com/drive/folders/1KaGo2XufNJ7xjMJSurTEhPG6dTyxlSJY",
        messaging: "https://drive.google.com/drive/folders/1LNZX7vgSq402mzUSlQ7Ck3xUsbkdOKeD",
        agreements: "https://drive.google.com/drive/folders/1AjLk7wP-oTxE6lls464_TojcPko5e975",
        working: "https://drive.google.com/drive/folders/1pnVFAKp24IOJnR0vPQduOS4gZFmB0KdM",
      },
    },
    results: {
      closedWon: 0,
      newPipeline: 0,
      meetingsHeld: 0,
      meetingsScheduled: 0,
      holdRate: 0,
      closedWonDelta: 0,
      meetingsHeldDelta: 0,
      pipelineOpps: 0,
    },
    meetings: [],
    phone: { dials: 0, connects: 0, conversations: 0, meetings: 0 },
    email: { sent: 0, opens: 0, replies: 0, positiveReplies: 0 },
    linkedin: { contacts: 0, connects: 0, replies: 0, positiveReplies: 0 },
    replies: [],
    activeLeads: {
      attempting: 0,
      unworked: 0,
      target: 600,
      statuses: [{ label: "Yet to be worked", count: 0 }],
    },
    benchmarks: [],
    campaigns: [],
    projects: [
      {
        id: "pl1",
        name: "Onboarding & data packet",
        owner: "Clay Tirrell",
        due: "2026-07-07",
        stages: [
          { label: "Intake", state: "done" },
          { label: "Drive setup", state: "done" },
          { label: "ICP + segments", state: "active" },
          { label: "Scripts", state: "todo" },
          { label: "Launch", state: "todo" },
        ],
      },
    ],
    unitEconomics: {
      meetingsPerMonth: 15,
      showRate: 75,
      oppToWin: 20,
      avgDealValue: 18000,
      programCost: 6000,
    },
    insight:
      "Ponte Labor launches next week. Onboarding is on track — the data packet and Drive are set up, ICP and segments are in progress.",
    lastUpdated: LAST_UPDATED,
  },

  snoball: {
    client: {
      id: "snoball",
      name: "Snoball",
      slug: "snoball",
      industry: "Referral & advocacy marketing",
      ceo: "Landon Taylor",
      serviceType: "MSP",
      accountOwner: "Clay Tirrell",
      sdrs: [],
      status: "onboarding",
      startDate: "2026-07-01",
      drive: {
        data: "https://drive.google.com/drive/folders/1-zIrpYtBT5LuZQrUOHy9weCnuGpaH3S-",
        channel: "https://drive.google.com/drive/folders/1fBz9DT_uKIOnZ799dHBWmau7_XsE8yjn",
        messaging: "https://drive.google.com/drive/folders/1KZJQSZmIfSHy_ba2RKOvHJd1UluZ998T",
        agreements: "https://drive.google.com/drive/folders/13VabsDMNzMjaw1oiULvyjdxiDdfE15_q",
        working: "https://drive.google.com/drive/folders/1P-1FJ5AfzGrJj9643M8ZVkOUJiMi1i8A",
      },
    },
    results: {
      closedWon: 0,
      newPipeline: 0,
      meetingsHeld: 0,
      meetingsScheduled: 0,
      holdRate: 0,
      closedWonDelta: 0,
      meetingsHeldDelta: 0,
      pipelineOpps: 0,
    },
    meetings: [],
    phone: { dials: 0, connects: 0, conversations: 0, meetings: 0 },
    email: { sent: 0, opens: 0, replies: 0, positiveReplies: 0 },
    linkedin: { contacts: 0, connects: 0, replies: 0, positiveReplies: 0 },
    replies: [],
    activeLeads: {
      attempting: 0,
      unworked: 0,
      target: 800,
      statuses: [{ label: "Yet to be worked", count: 0 }],
    },
    benchmarks: [],
    campaigns: [],
    projects: [
      {
        id: "sb1",
        name: "Onboarding & connector setup",
        owner: "Clay Tirrell",
        due: "2026-07-08",
        stages: [
          { label: "Intake", state: "done" },
          { label: "Drive setup", state: "done" },
          { label: "Connectors", state: "active" },
          { label: "Live data", state: "todo" },
          { label: "Launch", state: "todo" },
        ],
      },
    ],
    unitEconomics: {
      meetingsPerMonth: 20,
      showRate: 78,
      oppToWin: 22,
      avgDealValue: 20000,
      programCost: 7000,
    },
    insight:
      "Snoball is our flagship MSP build — the most repeatable system to replicate. Onboarding is underway; next step is wiring live connectors (Orum, email, LinkedIn) so real activity streams in.",
    lastUpdated: LAST_UPDATED,
  },
};

export const CLIENT_ORDER = ["yeticonnect", "snoball", "pontelabor"];

// Demo users — one per role, to show how access scope changes the same view.
export const USERS: Record<string, User> = {
  owner: {
    id: "owner",
    name: "Clay Tirrell",
    email: "clay@studiogtm.co",
    role: "owner",
    clientAccess: "all",
    seesBilling: true,
  },
  sdr: {
    id: "sdr",
    name: "Derek (SDR)",
    email: "derek@studiogtm.co",
    role: "sdr",
    clientAccess: ["yeticonnect"],
    seesBilling: false,
  },
  client: {
    id: "client",
    name: "YetiConnect Founder",
    email: "founder@yeticonnect.com",
    role: "client",
    clientAccess: ["yeticonnect"],
    seesBilling: true,
  },
  client_team: {
    id: "client_team",
    name: "YetiConnect Sales Lead",
    email: "sales@yeticonnect.com",
    role: "client_team",
    clientAccess: ["yeticonnect"],
    seesBilling: false,
  },
};

export function getClientData(id: string): ClientData | undefined {
  return CLIENTS[id];
}

export function accessibleClientIds(user: User): string[] {
  if (user.clientAccess === "all") return CLIENT_ORDER;
  return CLIENT_ORDER.filter((id) => (user.clientAccess as string[]).includes(id));
}
