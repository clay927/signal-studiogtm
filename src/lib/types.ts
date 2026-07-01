// Signal data model.
// These types intentionally mirror the StudioGTM Google Sheet contract so that
// swapping mock data for live, admin-vetted workbook rows is a drop-in change:
//   Results workbook  -> ResultsSummary + Meeting[]
//   Calls workbook    -> PhoneStats
//   Emails workbook   -> EmailStats + Reply[]
//   LinkedIn workbook -> LinkedInStats + Reply[]
//   Active Contacts   -> ActiveLeads

export type Role = "owner" | "sdr" | "client" | "client_team";

export type ClientStatus = "active" | "onboarding" | "at_risk" | "churned";

export interface DriveLinks {
  data: string;
  channel: string;
  messaging: string;
  agreements: string;
  working: string;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  industry: string;
  ceo?: string;
  contractType?: string;
  accountOwner: string;
  sdrs: string[];
  status: ClientStatus;
  startDate: string;
  drive: DriveLinks;
}

export interface ResultsSummary {
  closedWon: number;
  newPipeline: number;
  meetingsHeld: number;
  meetingsScheduled: number;
  holdRate: number; // 0-100
  closedWonDelta: number;
  meetingsHeldDelta: number;
  pipelineOpps: number;
}

export type MeetingStage =
  | "demo_set"
  | "follow_up"
  | "nurture"
  | "held"
  | "won"
  | "no_show";

export interface Meeting {
  id: string;
  name: string;
  company: string;
  title?: string;
  campaign: string;
  stage: MeetingStage;
  dateScheduled: string;
  attended: boolean | null;
  rep: string;
  value: number;
  note: string; // the Nooks / call AI summary
  phone?: string;
  email?: string;
  linkedin?: string;
  transcript?: string;
  featured?: boolean;
}

export interface PhoneStats {
  dials: number;
  connects: number;
  conversations: number;
  meetings: number;
}

export interface EmailStats {
  sent: number;
  opens: number;
  replies: number;
  positiveReplies: number;
}

export interface LinkedInStats {
  contacts: number;
  connects: number;
  replies: number;
  positiveReplies: number;
}

export interface Reply {
  id: string;
  name: string;
  company: string;
  channel: "email" | "linkedin";
  sentiment: "positive" | "neutral" | "negative";
  message: string;
  date: string;
}

export interface LeadStatus {
  label: string;
  count: number;
}

export interface ActiveLeads {
  attempting: number;
  unworked: number;
  target: number; // capacity target of active leads to keep the team fed
  statuses: LeadStatus[];
}

export interface Benchmark {
  label: string;
  value: number;
  unit: string;
  benchmark: number;
  status: "good" | "warn" | "bad";
  higherIsBetter: boolean;
  note: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: "phone" | "email" | "linkedin" | "multi";
}

export type ProjectStageState = "done" | "active" | "todo";

export interface ProjectStage {
  label: string;
  state: ProjectStageState;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  stages: ProjectStage[];
  due: string;
  note?: string;
}

export interface UnitEconomics {
  meetingsPerMonth: number;
  showRate: number; // 0-100
  oppToWin: number; // 0-100
  avgDealValue: number;
  programCost: number;
}

export interface ClientData {
  client: Client;
  results: ResultsSummary;
  meetings: Meeting[];
  phone: PhoneStats;
  email: EmailStats;
  linkedin: LinkedInStats;
  replies: Reply[];
  activeLeads: ActiveLeads;
  benchmarks: Benchmark[];
  campaigns: Campaign[];
  projects: Project[];
  unitEconomics: UnitEconomics;
  insight: string;
  lastUpdated: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clientAccess: string[] | "all"; // client ids, or "all" for owners
  seesBilling: boolean;
}
