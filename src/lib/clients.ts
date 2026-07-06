// Client roster for Pando v2. Derived from the historical import (the
// "MSP Results" sheet is canonical for who our clients are/were); DB
// client_settings can override status via Settings later.
import { CLIENT_ROSTER, type ClientMeta } from "./historical";

export const CLIENT_ORDER: string[] = CLIENT_ROSTER.map((c) => c.id);

const BY_ID: Record<string, ClientMeta> = Object.fromEntries(CLIENT_ROSTER.map((c) => [c.id, c]));

export function clientMeta(id: string): ClientMeta | undefined {
  return BY_ID[id];
}

export function clientName(id: string): string {
  return BY_ID[id]?.name ?? id;
}

export const ACTIVE_CLIENT_IDS: string[] = CLIENT_ROSTER.filter((c) => c.status === "active").map((c) => c.id);

export function formatEngagement(meta: ClientMeta): string {
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  return `${fmt(meta.engagementStart)} – ${meta.engagementEnd ? fmt(meta.engagementEnd) : "current"}`;
}
