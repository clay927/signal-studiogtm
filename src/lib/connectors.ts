// Catalog of tools Pando can ingest from. Each connector exposes an inbound
// webhook URL (tool -> Pando). Real-time, no manual exports.

export type ConnectorCategory = "dialer" | "email" | "linkedin" | "enablement";

export interface ConnectorDef {
  id: string;
  name: string;
  category: ConnectorCategory;
  webhooks: boolean;
  docsUrl?: string;
  logoDomain?: string; // used to render the tool's logo
  feeds: string; // plain-English: what data it sends into Pando
}

export const CONNECTORS: ConnectorDef[] = [
  { id: "orum", name: "Orum", category: "dialer", webhooks: true, logoDomain: "orum.com", docsUrl: "https://support.devrev.ai/en-US/orum/article/8nTlkv87-webhooks", feeds: "Dials, connects, conversations, dispositions, recordings" },
  { id: "nooks", name: "Nooks", category: "dialer", webhooks: true, logoDomain: "nooks.ai", feeds: "Dials, connects, AI call summaries, meetings booked" },
  { id: "smartlead", name: "Smartlead", category: "email", webhooks: true, logoDomain: "smartlead.ai", feeds: "Emails sent, opens, replies, positive replies" },
  { id: "instantly", name: "Instantly", category: "email", webhooks: true, logoDomain: "instantly.ai", feeds: "Emails sent, opens, replies, positive replies" },
  { id: "heyreach", name: "HeyReach", category: "linkedin", webhooks: true, logoDomain: "heyreach.io", feeds: "Connections, accepts, replies, positive replies" },
  { id: "lgm", name: "La Growth Machine", category: "linkedin", webhooks: true, logoDomain: "lagrowthmachine.com", feeds: "LinkedIn touches, connects, replies" },
  { id: "apollo", name: "Apollo", category: "enablement", webhooks: true, logoDomain: "apollo.io", feeds: "Active contacts, lead status, list volume" },
  { id: "hubspot", name: "HubSpot", category: "enablement", webhooks: true, logoDomain: "hubspot.com", feeds: "Deals, contacts, pipeline stages, closed won" },
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
