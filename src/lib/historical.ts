// GENERATED from data/historical/*.csv — do not edit by hand.
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

export const CLIENT_ROSTER: ClientMeta[] = [
  { id: "snoball", name: "Snoball", status: "active", serviceType: "MSP", engagementStart: "2026-01-01", engagementEnd: null },
  { id: "flax", name: "Flax AI", status: "inactive", serviceType: "MSP", engagementStart: "2026-02-15", engagementEnd: "2026-06-30" },
  { id: "yeticonnect", name: "YetiConnect", status: "active", serviceType: "Diagnostic", engagementStart: "2026-05-15", engagementEnd: null },
  { id: "screensteps", name: "Screensteps", status: "active", serviceType: "Diagnostic", engagementStart: "2026-04-01", engagementEnd: "2026-07-15" },
  { id: "secondchair", name: "SecondChair", status: "inactive", serviceType: "Diagnostic", engagementStart: "2026-03-01", engagementEnd: "2026-04-30" },
  { id: "roster", name: "Roster", status: "inactive", serviceType: "MSP", engagementStart: "2026-04-01", engagementEnd: "2026-05-31" },
  { id: "arya", name: "Arya", status: "inactive", serviceType: "MSP", engagementStart: "2026-01-01", engagementEnd: "2026-02-15" },
];

export const RESULTS_MONTHLY: MonthlyResults[] = [
  { clientId: "snoball", month: "2026-01", closedWon: 53788, newPipeline: 369964, meetingsHeld: 39, meetingsScheduled: 99 },
  { clientId: "snoball", month: "2026-02", closedWon: 21576, newPipeline: 195740, meetingsHeld: 27, meetingsScheduled: 64 },
  { clientId: "snoball", month: "2026-03", closedWon: 73152, newPipeline: 228540, meetingsHeld: 28, meetingsScheduled: 46 },
  { clientId: "snoball", month: "2026-04", closedWon: 130000, newPipeline: 246247, meetingsHeld: 34, meetingsScheduled: 33 },
  { clientId: "snoball", month: "2026-05", closedWon: 64000, newPipeline: 298752, meetingsHeld: 42, meetingsScheduled: 56 },
  { clientId: "snoball", month: "2026-06", closedWon: 72000, newPipeline: 215440, meetingsHeld: 29, meetingsScheduled: 47 },
  { clientId: "flax", month: "2026-02", closedWon: 0, newPipeline: 132000, meetingsHeld: 2, meetingsScheduled: 4 },
  { clientId: "flax", month: "2026-03", closedWon: 0, newPipeline: 3000000, meetingsHeld: 8, meetingsScheduled: 12 },
  { clientId: "flax", month: "2026-04", closedWon: 0, newPipeline: 1206000, meetingsHeld: 6, meetingsScheduled: 8 },
  { clientId: "flax", month: "2026-05", closedWon: 105000, newPipeline: 156000, meetingsHeld: 2, meetingsScheduled: 4 },
  { clientId: "flax", month: "2026-06", closedWon: 25000, newPipeline: 1092000, meetingsHeld: 4, meetingsScheduled: 5 },
  { clientId: "yeticonnect", month: "2026-05", closedWon: 0, newPipeline: 10000, meetingsHeld: 1, meetingsScheduled: 3 },
  { clientId: "yeticonnect", month: "2026-06", closedWon: 0, newPipeline: 30000, meetingsHeld: 2, meetingsScheduled: 7 },
  { clientId: "screensteps", month: "2026-04", closedWon: 0, newPipeline: null, meetingsHeld: null, meetingsScheduled: null },
  { clientId: "screensteps", month: "2026-05", closedWon: 0, newPipeline: null, meetingsHeld: null, meetingsScheduled: null },
  { clientId: "screensteps", month: "2026-06", closedWon: 0, newPipeline: null, meetingsHeld: null, meetingsScheduled: null },
  { clientId: "secondchair", month: "2026-03", closedWon: 0, newPipeline: 36000, meetingsHeld: 12, meetingsScheduled: 29 },
  { clientId: "secondchair", month: "2026-04", closedWon: 21000, newPipeline: 18000, meetingsHeld: 6, meetingsScheduled: 14 },
  { clientId: "roster", month: "2026-04", closedWon: 0, newPipeline: 7500, meetingsHeld: 1, meetingsScheduled: 3 },
  { clientId: "roster", month: "2026-05", closedWon: 26066, newPipeline: 144000, meetingsHeld: 13, meetingsScheduled: 20 },
  { clientId: "arya", month: "2026-01", closedWon: 0, newPipeline: 48000, meetingsHeld: 3, meetingsScheduled: 9 },
  { clientId: "arya", month: "2026-02", closedWon: 16000, newPipeline: 32000, meetingsHeld: 2, meetingsScheduled: 7 },
];

export const CALLS_MONTHLY: MonthlyCalls[] = [
  { clientId: "snoball", month: "2026-02", dials: 7246, callbacks: 297, connects: 507, conversations: 238, meetings: 44 },
  { clientId: "snoball", month: "2026-03", dials: 5626, callbacks: 260, connects: 328, conversations: 159, meetings: 35 },
  { clientId: "snoball", month: "2026-04", dials: 3078, callbacks: 153, connects: 199, conversations: 119, meetings: 34 },
  { clientId: "snoball", month: "2026-05", dials: 1305, callbacks: 46, connects: 110, conversations: 53, meetings: 18 },
  { clientId: "snoball", month: "2026-06", dials: 3001, callbacks: 120, connects: 153, conversations: 89, meetings: 26 },
  { clientId: "secondchair", month: "2026-03", dials: 6261, callbacks: null, connects: 231, conversations: 107, meetings: 23 },
  { clientId: "secondchair", month: "2026-04", dials: 5065, callbacks: null, connects: 92, conversations: 53, meetings: 11 },
];

export const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  { clientId: "secondchair", campaign: "MTMP", contacts: 242, sent: 242, bounceRate: 0, replies: 2 },
  { clientId: "secondchair", campaign: "NetNew", contacts: 5223, sent: 16264, bounceRate: 0.004978, replies: 69 },
  { clientId: "secondchair", campaign: "Cold Batch 1", contacts: 4961, sent: 29915, bounceRate: 0, replies: 360 },
];

// Flax LGM (LinkedIn) — campaign-level; totals from report Overview tab.
export const FLAX_LINKEDIN_TOTALS = { contacted: 2274, replies: 217, won: 13, audiences: 17, campaignsLaunched: 16 };

export const FLAX_LINKEDIN_CAMPAIGNS: LinkedInCampaign[] = [
  { campaign: "Flax002 - LTC100 Conference V2", contacted: 180, replies: 47 },
  { campaign: "Flax005 - LTC100 Pre-Conference from Justin Only", contacted: 268, replies: 43 },
  { campaign: "Flax004 - Trent - Execs hiring Admissions", contacted: 339, replies: 21 },
  { campaign: "Flax005 - Pre-LTC100 VIP Dinner Invite", contacted: 71, replies: 18 },
  { campaign: "Flax005 - Justin - Execs hiring Admissions", contacted: 332, replies: 17 },
  { campaign: "Flax008 - Admissions Operators - High Intent (Trent) 17", contacted: 406, replies: 17 },
  { campaign: "Flax010 - Admissions Operators Execs -  MM Target Accounts - Justin", contacted: 41, replies: 13 },
  { campaign: "Flax010 - Trent - MM Target Accounts", contacted: 157, replies: 10 },
  { campaign: "Flax007 - Admissions Operators - High Intent", contacted: 222, replies: 10 },
  { campaign: "Flax006 - LTC100 FINAL Pre-Conference from Trent", contacted: 74, replies: 6 },
  { campaign: "FLAX - OHCA Event Ohio 5/19/26", contacted: 80, replies: 5 },
  { campaign: "Warm signal through cold call", contacted: 13, replies: 3 },
  { campaign: "Flax003 - ACHCA Chapter Heads", contacted: 16, replies: 2 },
  { campaign: "OHCA pre and post event", contacted: 3, replies: 1 },
  { campaign: "Flax001 - LTC100 Conference", contacted: 28, replies: 0 },
];

export const FLAX_CALL_LISTS: CallList[] = [
  { segment: "sdr_dialer", list: "LB - FLAX T. 1 Executives Only", dials: 1647, connects: 70, conversations: 11, meetings: 1 },
  { segment: "sdr_dialer", list: "Flax - ACHA Didn't Meet (Attempting)", dials: 1206, connects: 30, conversations: 14, meetings: 0 },
  { segment: "sdr_dialer", list: "BL_CAHF Event 2025 (Attempting)", dials: 943, connects: 36, conversations: 26, meetings: 1 },
  { segment: "sdr_dialer", list: "BL_PACS (Attempting)", dials: 864, connects: 53, conversations: 31, meetings: 4 },
  { segment: "sdr_dialer", list: "Flax - ACHA Met (Attempting)", dials: 330, connects: 4, conversations: 1, meetings: 0 },
  { segment: "blake_clay", list: "Flax - ACHA Didn't Meet (Attempting)", dials: 307, connects: 23, conversations: 16, meetings: 4 },
  { segment: "sdr_dialer", list: "LB - Tier 1 Administrators CMS FLAX  (Attempting)", dials: 287, connects: 19, conversations: 4, meetings: 0 },
  { segment: "blake_clay", list: "Flax - ACHA Met (Attempting)", dials: 185, connects: 11, conversations: 10, meetings: 1 },
  { segment: "blake_clay", list: "Flax - AHCA Met in Person", dials: 97, connects: 16, conversations: 8, meetings: 1 },
  { segment: "blake_clay", list: "BH - FLAX T. 1 Executives Only", dials: 86, connects: 4, conversations: 2, meetings: 0 },
  { segment: "blake_clay", list: "BH - Tier 1 Administrators CMS  (Attempting)", dials: 86, connects: 1, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "LB_Vi Living", dials: 80, connects: 1, conversations: 1, meetings: 0 },
  { segment: "blake_clay", list: "CT_FLAX LGM Opened", dials: 78, connects: 8, conversations: 8, meetings: 1 },
  { segment: "blake_clay", list: "Flax - AHCA Didn't Meet", dials: 54, connects: 1, conversations: 1, meetings: 0 },
  { segment: "blake_clay", list: "CT - Tier 1 Administrators CMS  (Attempting)", dials: 35, connects: 1, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "LB_American_Senior_Communities", dials: 30, connects: 1, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "All sequence due tasks", dials: 8, connects: 0, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "BL - AXON", dials: 8, connects: 4, conversations: 2, meetings: 0 },
  { segment: "sdr_dialer", list: "Flax - AHCA Met in Person", dials: 7, connects: 0, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "LB_Care_Roanoke", dials: 7, connects: 0, conversations: 0, meetings: 0 },
  { segment: "sdr_dialer", list: "Flax - AHCA Didn't Meet", dials: 3, connects: 0, conversations: 0, meetings: 0 },
];

// All-time Flax dial totals across all dialer segments (workbook header).
export const FLAX_CALL_TOTALS = { dials: 9578, connects: 405, conversations: 196, meetings: 29 };
