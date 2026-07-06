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
  { clientId: "screensteps", month: "2026-06", dials: 555, callbacks: null, connects: 12, conversations: 3, meetings: 0 },
  { clientId: "screensteps", month: "2026-07", dials: 53, callbacks: null, connects: 1, conversations: 1, meetings: 0 },
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

export interface YetiCallWeek {
  weekLabel: string;
  weekStart: string; // week is assigned to the month this date falls in
  weekEnd: string;
  callsMade: number;
  meetingsBooked: number;
  outcomes: { label: string; count: number }[];
}

export const YETI_CALL_WEEKS: YetiCallWeek[] = [
  { weekLabel: "Jun 22–28", weekStart: "2026-06-22", weekEnd: "2026-06-28", callsMade: 765, meetingsBooked: 2, outcomes: [{ label: "Meetings Booked", count: 2 }, { label: "Email Follow Up Requested", count: 3 }, { label: "Elevator Pitch Rejected", count: 26 }, { label: "Connected", count: 7 }, { label: "No Longer with Company", count: 18 }, { label: "Wrong ICP", count: 2 }, { label: "Wrong Number", count: 39 }, { label: "Busy, Call Later", count: 3 }, { label: "No Answer", count: 665 }] },
  { weekLabel: "Jun 29–Jul 5", weekStart: "2026-06-29", weekEnd: "2026-07-05", callsMade: 773, meetingsBooked: 4, outcomes: [{ label: "Meetings Booked", count: 4 }, { label: "Email Follow Up Requested", count: 7 }, { label: "Elevator Pitch Rejected", count: 40 }, { label: "Connected", count: 7 }, { label: "No Longer with Company", count: 11 }, { label: "Wrong ICP", count: 13 }, { label: "Wrong Number", count: 20 }, { label: "Busy, Call Later", count: 14 }, { label: "No Answer", count: 657 }] },
  { weekLabel: "Jul 6–12", weekStart: "2026-07-06", weekEnd: "2026-07-12", callsMade: 409, meetingsBooked: 2, outcomes: [{ label: "Meetings Booked", count: 2 }, { label: "Email Follow Up Requested", count: 3 }, { label: "Elevator Pitch Rejected", count: 15 }, { label: "Connected", count: 5 }, { label: "No Longer with Company", count: 6 }, { label: "Wrong ICP", count: 1 }, { label: "Wrong Number", count: 9 }, { label: "Busy, Call Later", count: 8 }, { label: "No Answer", count: 360 }] },
];

export interface HistoricalCall {
  outcome: string;
  name: string;
  company: string;
  list: string;
  rep: string;
  calledAt: string;
  transcript: string;
}

export const YETI_CALL_LOG: HistoricalCall[] = [
  { outcome: "Meeting booked", name: "Desiree Or***s", company: "Texas Dermatology and Laser Specialists", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 11:18:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=8652214b-b59a-4084-affc-83ce4df42f8a" },
  { outcome: "Meeting booked", name: "Noah England", company: "Piedmont Plastic Surgery & Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 10:37:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=7d53e63a-b686-42a1-8e44-4ce7f510eb65" },
  { outcome: "Meeting booked", name: "Justin Kohll", company: "Preventative Medical Clinic", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:24:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=32450685-80b2-4588-9e5d-7f7d7fde8bfd" },
  { outcome: "Meeting booked", name: "Larry Dobbs", company: "Classic Cruisers", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 09:59:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=654e91a3-f59e-44a3-8ac7-e49f763199b7" },
  { outcome: "Meeting booked", name: "Asmore Richards", company: "Auto Body World", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 10:36:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=03bed1d0-b65a-443d-b108-9733bf16d185" },
  { outcome: "Meeting booked", name: "Denise Walton", company: "Seidner", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 10:56:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=5f764049-cbd9-4404-aee4-4f6037214e27" },
  { outcome: "Meeting booked", name: "Dan Sundstrom", company: "Custom Sounds", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 10:58:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=23bab7ea-80d2-4780-bef0-48d3dfda3bc5" },
  { outcome: "Meeting booked", name: "Ron McCoy", company: "OK Tire Store", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 11:27:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=3b1c0d3e-c820-4cc0-b734-cce32a790aa0" },
  { outcome: "Email follow-up requested", name: "Amy Christian", company: "JECT", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 10:51:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=79c60e86-3cc5-431e-8fae-09a9978d373e" },
  { outcome: "Email follow-up requested", name: "Olyvia N.", company: "Clearstone Laser Hair Removal and Med Spa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:38:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=c129cbf1-bd8c-459b-bd00-29c831c2b5d2" },
  { outcome: "Email follow-up requested", name: "Kayla Kaufman", company: "Invision Health", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 11:58:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=6c478a13-763e-4a5d-97b3-caf7918d0f0a" },
  { outcome: "Email follow-up requested", name: "Jodi Jaffe", company: "Valley Medical Weight Loss & Med Spa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:19:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=1d9f2d0b-2896-4627-a955-1b5bfab9a1e8" },
  { outcome: "Email follow-up requested", name: "Brian McMillan", company: "Sun Auto Tire & Service", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:15:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=58a18017-bc95-4db4-b597-b501b1e698fd" },
  { outcome: "Email follow-up requested", name: "Todd Secor", company: "Toys for Trucks", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:05:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=25990dce-ac50-4d7b-ac57-a53239749d4b" },
  { outcome: "Email follow-up requested", name: "Brian Irvin", company: "New Life Transport Parts Center", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:22:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=992aa20a-a646-4f1d-8c43-1dc1150188a3" },
  { outcome: "Email follow-up requested", name: "Julie Smyth", company: "Henise Tire Service", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:29:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=f506c667-3ef5-4e25-acda-5c7ba29bc840" },
  { outcome: "Email follow-up requested", name: "Daniel Bronfman", company: "Fix Network World", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 12:01:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=43df72bd-7607-4e20-a54d-b82ec755c461" },
  { outcome: "Email follow-up requested", name: "Darius Cazacu", company: "Big St Charles Motorsports", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 12:04:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=cf061f21-595d-44ca-bb0e-7079c71f7135" },
  { outcome: "Email follow-up requested", name: "Darren Yaphe", company: "Victoria Park Medispa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 09:59:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=3b89cbb2-b874-45d9-83de-dd0c54502c1f" },
  { outcome: "Email follow-up requested", name: "Parinita Amin", company: "MDCS: Manhattan Dermatology and Cosmetic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:17:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=47c90ad3-b1f8-4657-904b-5b672d8d4635" },
  { outcome: "Email follow-up requested", name: "KASSIE AVILA", company: "The Roxbury Institute", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:37:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=1e6281a1-1366-4b6b-a597-1871693be8cc" },
  { outcome: "Elevator pitch rejected", name: "Karen Cobb", company: "AesthetiCare Medspa + Wellness", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 10:28:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=0d61cce1-4ef5-4d2a-9059-a1f66aea77c4" },
  { outcome: "Elevator pitch rejected", name: "Rachel Rearden", company: "Ideal Image", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 10:32:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=449d26da-0c06-4f73-80f8-415381d07c12" },
  { outcome: "Elevator pitch rejected", name: "Alan Hartman", company: "Bucky Plastic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 10:38:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=e3719020-9fe3-4cce-b87b-5eb0f572989d" },
  { outcome: "Elevator pitch rejected", name: "Ama Sk***e", company: "AMA Skincare", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-23 10:39:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=4e207f1c-b7d4-4569-960a-75fd2300ca42" },
  { outcome: "Elevator pitch rejected", name: "Alisha Morrissey", company: "MD Esthetics Brand", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 07:56:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=d9abc2e2-352a-42b6-971e-0d5581efe549" },
  { outcome: "Elevator pitch rejected", name: "Brian Farnan", company: "Bravia Dermatology Group", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:14:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=ecdd4ddf-d15e-4235-b3c3-805b342a4268" },
  { outcome: "Elevator pitch rejected", name: "Denise Tricoci", company: "Waccamaw Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:27:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=d9d20c80-0863-45bd-872e-02961f94174c" },
  { outcome: "Elevator pitch rejected", name: "Dr. Marc DuPere, plastic surgeon and President", company: "VISAGE Clinic - Cosmetic Plastic Surgery - Yorkville Toronto", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:29:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b13fc38f-970b-491d-8149-e50c71e8a2ca" },
  { outcome: "Elevator pitch rejected", name: "Jamaira Estrada", company: "Bay Dermatology and Cosmetic Surgery, P.A.", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:39:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=73c7d66a-0de8-46de-8cb8-b87733783c69" },
  { outcome: "Elevator pitch rejected", name: "Jonathan Ford", company: "Smiley Aesthetics", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:48:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=772307ee-050d-459b-90ce-dbfe08be931d" },
  { outcome: "Elevator pitch rejected", name: "Juah McManomy", company: "Rajeunir Medical Spas", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:50:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=dc42e7b7-4e67-486c-88bc-5b66aa9ea682" },
  { outcome: "Elevator pitch rejected", name: "Katie Simione", company: "Skin MD, Laser & Cosmetic Group", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 08:55:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=ca987fe2-7742-409f-90ed-5e014003fda7" },
  { outcome: "Elevator pitch rejected", name: "Kelsi Chapman Martin", company: "Grafton Dermatology & Cosmetic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:03:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=f1b635ce-f61d-4e65-985d-4215c2077430" },
  { outcome: "Elevator pitch rejected", name: "Kristine Walters", company: "Metropolitan Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:07:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b0b85480-ed06-42a9-92f3-5a243583f8c3" },
  { outcome: "Elevator pitch rejected", name: "Molly-Claire West", company: "Hopkins Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:28:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=fbeb4df5-3e77-456d-9d69-9fab1fb8a2f5" },
  { outcome: "Elevator pitch rejected", name: "Nirav Savalia", company: "Savalia Plastic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:32:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=cfe8ca93-edd5-4569-8f69-3cb34d29e222" },
  { outcome: "Elevator pitch rejected", name: "Paul Leong", company: "Sistine Aesthetics and Facial Plastic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:39:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=c69148d3-a287-40b7-ab7c-bb662d50c00e" },
  { outcome: "Elevator pitch rejected", name: "Samantha He***n", company: "Lazaderm", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:50:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=577554fb-9197-436e-b88d-9a8882d9002c" },
  { outcome: "Elevator pitch rejected", name: "Sarah Anthony", company: "Bay Dermatology and Cosmetic Surgery, P.A.", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 09:57:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=2c05cd15-ed7f-43be-bb39-ff33bdb4bb4e" },
  { outcome: "Elevator pitch rejected", name: "Kelly Froby", company: "Thomas Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 10:30:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=c3ffaac9-acc9-4700-a05f-f8032a071e07" },
  { outcome: "Elevator pitch rejected", name: "Reza Tirgari", company: "Avalon Laser", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-24 11:26:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=aa822f79-0484-4628-bfbf-281c5d24c9b4" },
  { outcome: "Elevator pitch rejected", name: "Wendy Green", company: "Dermani Medspa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 08:44:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=c87e01ff-98a8-4c5f-ae2e-203afdde3207" },
  { outcome: "Elevator pitch rejected", name: "Allison G.", company: "Davis Cosmetic Plastic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 08:57:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=79c6a933-6e85-4aeb-b4cb-0027d0983dc6" },
  { outcome: "Elevator pitch rejected", name: "Alison Albanese Basso", company: "Blaine Plastic Surgery", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 12:03:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=cf23a296-a701-4e2a-9c38-1bc6298157bc" },
  { outcome: "Elevator pitch rejected", name: "Dominique Waples-Trefil", company: "RESTOR", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 12:21:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=60913069-075a-49ee-942b-82cd808c6c06" },
  { outcome: "Elevator pitch rejected", name: "Dustin Kahn", company: "GraceMed", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-25 12:24:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b1204170-3251-4345-8f30-aa2c43c9176f" },
  { outcome: "Elevator pitch rejected", name: "Callie Valko", company: "Valley Medical Weight Loss & Med Spa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:06:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=0beed13f-1756-4641-893e-fae2d901ca10" },
  { outcome: "Elevator pitch rejected", name: "Longfei (Allen) Sun", company: "Wave Plastic Surgery & Laser Center", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:29:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=e45e2eee-ff58-4aaf-b4e7-3070a9b33d08" },
  { outcome: "Elevator pitch rejected", name: "Mala Joshi-Lomaga", company: "DermEdge", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:31:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=d2231b05-cdfe-4892-8b87-1049da79fe7f" },
  { outcome: "Elevator pitch rejected", name: "Rachel Wilson", company: "Spa Medical", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:37:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=42d3d50e-7006-4629-82bd-10f703409bb8" },
  { outcome: "Elevator pitch rejected", name: "Timothy Mountcastle", company: "Mountcastle Plastic Surgery & Vein Institute", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:42:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=93ab0094-0640-4fe6-bd88-9b22f378e515" },
  { outcome: "Elevator pitch rejected", name: "Nicole Jelmberg-Brayton", company: "Cascade Eye & Skin Centers", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-29 09:54:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=4523559c-9d78-4559-b217-55dba201f784" },
  { outcome: "Elevator pitch rejected", name: "Baylee Johnson", company: "B Street Collision Center", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:07:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=8c2269f1-5515-4f1d-b58c-b1e2408340a6" },
  { outcome: "Elevator pitch rejected", name: "Benjamin Johnson", company: "Meyer Distributing", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:09:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=ae1b79b1-2d0b-473d-b7ca-dd57b85182ab" },
  { outcome: "Elevator pitch rejected", name: "Doug Petersen", company: "SSF", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:27:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b6de5495-6584-4218-b04b-abcf0db7c077" },
  { outcome: "Elevator pitch rejected", name: "Jon Hughes", company: "MOC Products Company", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:35:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=86601483-5cb6-4075-a352-4a1412a356bc" },
  { outcome: "Elevator pitch rejected", name: "Lance Hurd", company: "Arnold Motor Supply", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:38:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=8533579f-5519-49e8-8e07-23a635e4a854" },
  { outcome: "Elevator pitch rejected", name: "Michael Diamond", company: "Diamond Parking", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:44:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=3cc5a21c-89c8-4975-acf0-ecdb85df1ffe" },
  { outcome: "Elevator pitch rejected", name: "Nathan Jakub", company: "GGMC Parking", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:47:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=990d62be-63bb-4a18-8758-779591b8f1bb" },
  { outcome: "Elevator pitch rejected", name: "Nicholas Stanley", company: "Automotive Concepts", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:51:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=272eca12-1550-46db-bcce-8fb974b0d597" },
  { outcome: "Elevator pitch rejected", name: "Richard Johnston", company: "NexaMotion Group", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:55:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=319686be-b12d-4a63-b998-644dcab54a14" },
  { outcome: "Elevator pitch rejected", name: "Robert Santor", company: "Tireco", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 10:56:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=4a762055-e2d9-41a1-ac37-6fcdad022083" },
  { outcome: "Elevator pitch rejected", name: "Shashi Shah", company: "Penn Power Group", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:01:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=e7ad3d74-260f-4972-9a44-d73e034fed01" },
  { outcome: "Elevator pitch rejected", name: "Blaine Bessler", company: "G&C Auto Body", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:18:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b8fa516f-0d96-4428-9ce0-aa4b013fc39f" },
  { outcome: "Elevator pitch rejected", name: "David Johnson", company: "Aftermarket Performance Group", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:24:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=78b24e95-4643-4467-a5f1-44d1aeb4b194" },
  { outcome: "Elevator pitch rejected", name: "Bill Lindsay", company: "Aftermarket Performance Group", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:39:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=3cfd53ae-6380-4c58-940c-d0015e33fc88" },
  { outcome: "Elevator pitch rejected", name: "Chris Parks", company: "Commercial Tire", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-29 11:52:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=e47a5533-a745-419b-bc9c-0dec003029d2" },
  { outcome: "Elevator pitch rejected", name: "Braden Walton", company: "Automotive of York", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 09:34:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=35611e21-7312-4615-b1e2-3ee088e290e3" },
  { outcome: "Elevator pitch rejected", name: "Eli Padilla", company: "LaMettry's Collision", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 09:36:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=bd6a756a-97c7-46f7-a939-c0b9cc382633" },
  { outcome: "Elevator pitch rejected", name: "Jason Hall", company: "Team Allied", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 09:40:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=11bd759f-1c71-425c-aac3-fe13cb5805bf" },
  { outcome: "Elevator pitch rejected", name: "John DeCampos", company: "Agility Auto Parts", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 09:46:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=cd22b41a-31d0-4a7e-bd45-48910ccd3514" },
  { outcome: "Elevator pitch rejected", name: "Luke Nicholson", company: "Colors On Parade", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:01:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=86a86640-0fec-4a05-bd9e-d81f92a850c6" },
  { outcome: "Elevator pitch rejected", name: "Mark Kazmierski", company: "US AutoForce", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:11:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=11cdb424-3d5d-43ca-a1a7-04216ecc1839" },
  { outcome: "Elevator pitch rejected", name: "Mike Bloom", company: "Nuss Truck Group", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:12:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=6172c5f5-f825-4ec8-8e56-9a3907b9c937" },
  { outcome: "Elevator pitch rejected", name: "Ryan Hoover", company: "Premier Automotive Services", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:27:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=7d87d637-6a11-49aa-ab53-5d7ff2d8ddd9" },
  { outcome: "Elevator pitch rejected", name: "Shawn Eggermont", company: "OK Tire Store", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:29:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=888d7790-709b-4604-9fa0-da972407e6e2" },
  { outcome: "Elevator pitch rejected", name: "Vaughn Willenberger", company: "Pohanka Automotive Group of Salisbury Contact", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:53:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=73bacc57-f41e-4136-82cd-84d8532c7ad2" },
  { outcome: "Elevator pitch rejected", name: "William Fuentes", company: "Rice Tire", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 10:56:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=16f7df27-e219-4185-9f16-e9f061585e7d" },
  { outcome: "Elevator pitch rejected", name: "Mike Luna", company: "Custom Sounds", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-06-30 11:08:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=883fe8ea-9e57-4e84-9c35-540f7c305ab4" },
  { outcome: "Elevator pitch rejected", name: "Chelsie Di Paola", company: "The Roxbury Institute", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-30 11:17:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=9c5d05e5-0254-4aa5-9e99-2dc55daf6401" },
  { outcome: "Elevator pitch rejected", name: "Katherine Pettengill", company: "Associated Dermatologists", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-30 11:24:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=929b7268-f072-4412-9dff-3c815a895a46" },
  { outcome: "Elevator pitch rejected", name: "Mark Ch***n", company: "Skin Cancer Specialists, P.C. & Aesthetic Center", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-06-30 11:28:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=38bb7ead-e43c-42ce-93b2-2b19fb5cc7d4" },
  { outcome: "Elevator pitch rejected", name: "Carter Darrington", company: "Pohanka Automotive Group of Salisbury Contact", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 10:47:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=2551e5fa-08b7-48db-b7d6-492d7c223c23" },
  { outcome: "Elevator pitch rejected", name: "Derek Shillcox", company: "1-800 Radiator & A/C", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 11:06:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=be96027f-1987-4013-84f9-7d8c49f40cc7" },
  { outcome: "Elevator pitch rejected", name: "Nafe Alsawfta", company: "NuBrakes", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 11:13:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=85e751c1-3070-470b-bcba-1d5b9911de05" },
  { outcome: "Elevator pitch rejected", name: "Shawn Loney", company: "Dee Zee", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-02 11:15:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=27250933-646f-416f-a940-278fb2db6d8c" },
  { outcome: "Elevator pitch rejected", name: "Amber Shelnutt-York", company: "Aurora Medical Spa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 09:50:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=4800c3d0-a3d7-4b68-b654-9d4c56450dc0" },
  { outcome: "Elevator pitch rejected", name: "Claudine Dogon", company: "Bella Santé Spas", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 09:56:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=7ba72c2f-4ccc-4cbf-832e-15b172e12558" },
  { outcome: "Elevator pitch rejected", name: "Crystal Valtierra", company: "Plastic Surgery Associates", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 09:58:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=0761ebd3-9406-4427-89c0-4c3fddf9e029" },
  { outcome: "Elevator pitch rejected", name: "Karine Pare", company: "Victoria Park Medispa", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:09:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=b598a341-b99b-4053-b8c9-17a45dc5c3ea" },
  { outcome: "Elevator pitch rejected", name: "Laura Cassady", company: "Face Forward Aesthetics", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:12:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=a28ce44e-14cb-40dc-9abf-29e9b945c7d2" },
  { outcome: "Elevator pitch rejected", name: "Rob Ol***r", company: "Plastic Surgery Specialists", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:19:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=9f000817-bf65-4fe3-92ca-892b146436ab" },
  { outcome: "Elevator pitch rejected", name: "Vickie Miles", company: "Skin Wellness Dermatology", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:25:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=fadbec48-bad5-4b5b-920b-2dff25320a1d" },
  { outcome: "Elevator pitch rejected", name: "Elaine Brunner", company: "L&P Aesthetics", list: "YetiConnect MedSpa Derek 6_22.csv", rep: "Derek", calledAt: "2026-07-06 10:33:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=80b543dc-7b87-4897-a72e-7192d1e22a04" },
  { outcome: "Elevator pitch rejected", name: "Alyson Martin", company: "OK Tire Store", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 10:48:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=7fda43f4-7cf8-455d-bf48-7195a92a60ce" },
  { outcome: "Elevator pitch rejected", name: "Amy Capuozzo", company: "UCX", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 10:48:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=216d2a18-3475-48b3-a2ef-e5265c3aa8bd" },
  { outcome: "Elevator pitch rejected", name: "Arron Starwalt", company: "Bauer Built", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 10:49:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=aa7be6b8-5260-449d-8485-f77aff38806e" },
  { outcome: "Elevator pitch rejected", name: "Luis Aguirre", company: "AA Auto Care", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 11:16:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=a42fc499-bec4-421c-a44b-e2be0257d6f6" },
  { outcome: "Elevator pitch rejected", name: "Joe LoGiudice", company: "ACE PARKING MANAGEMENT", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 11:29:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=78a6d68d-30e5-44c9-9d4c-2ae037e2e182" },
  { outcome: "Elevator pitch rejected", name: "Tim Alspaugh", company: "Tidewater Fleet Supply", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 11:33:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=41c9f3c9-debc-45d8-a771-565633710760" },
  { outcome: "Elevator pitch rejected", name: "Todd Kosloski", company: "Diamond Parking", list: "YetiConnect-Automotive-FINAL-Targets.xlsx#Target Contacts — Master", rep: "Derek", calledAt: "2026-07-06 11:34:00", transcript: "https://app.nooks.in/workspaces/4iyXLdUJrGPZD8eJ/transcript?callId=3e53f3df-7249-4a19-9a64-b2bcad8353a5" },
];
