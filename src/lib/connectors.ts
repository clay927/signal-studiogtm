// Catalog of tools Signal can ingest from. Each connector exposes an inbound
// webhook URL (tool -> Signal). Real-time, no manual exports.

export type ConnectorCategory = "dialer" | "email" | "linkedin" | "enablement";

export interface ConnectorDef {
  id: string;
  name: string;
  category: ConnectorCategory;
  webhooks: boolean;
  docsUrl?: string;
  feeds: string; // plain-English: what data it sends into Signal
}

export const CONNECTORS: ConnectorDef[] = [
  { id: "orum", name: "Orum", category: "dialer", webhooks: true, docsUrl: "https://support.devrev.ai/en-US/orum/article/8nTlkv87-webhooks", feeds: "Dials, connects, conversations, dispositions, recordings" },
  { id: "nooks", name: "Nooks", category: "dialer", webhooks: true, feeds: "Dials, connects, AI call summaries, meetings booked" },
  { id: "smartlead", name: "Smartlead", category: "email", webhooks: true, feeds: "Emails sent, opens, replies, positive replies" },
  { id: "instantly", name: "Instantly", category: "email", webhooks: true, feeds: "Emails sent, opens, replies, positive replies" },
  { id: "heyreach", name: "HeyReach", category: "linkedin", webhooks: true, feeds: "Connections, accepts, replies, positive replies" },
  { id: "lgm", name: "La Growth Machine", category: "linkedin", webhooks: true, feeds: "LinkedIn touches, connects, replies" },
  { id: "apollo", name: "Apollo", category: "enablement", webhooks: true, feeds: "Active contacts, lead status, list volume" },
  { id: "custom", name: "Custom webhook", category: "enablement", webhooks: true, feeds: "Any tool that can POST JSON to a URL" },
];

export const CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  dialer: "Dialer",
  email: "Email",
  linkedin: "LinkedIn",
  enablement: "Sales enablement & data",
};

export interface ConnectorConfig {
  enabled: boolean;
  secret: string;
  apiKey: string;
  lastEventAt?: string;
}

export function webhookUrl(origin: string, connectorId: string, clientId: string): string {
  return `${origin}/api/webhooks/${connectorId}?client=${clientId}`;
}
