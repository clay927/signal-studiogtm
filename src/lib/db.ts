import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Neon (Vercel Postgres) access. Lazily initialized, and self-migrating:
// the first query per process ensures the schema exists (idempotent), so no
// separate migration step is needed. On Vercel, DATABASE_URL is injected at
// runtime by the Neon integration.

let _sql: NeonQueryFunction<false, false> | null = null;

export function hasDatabase(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}

function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error("No database URL configured (DATABASE_URL).");
    _sql = neon(url);
  }
  return _sql;
}

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS connectors (
     client_id text NOT NULL,
     connector_id text NOT NULL,
     enabled boolean NOT NULL DEFAULT false,
     secret text NOT NULL DEFAULT '',
     api_key text NOT NULL DEFAULT '',
     last_event_at timestamptz,
     PRIMARY KEY (client_id, connector_id)
   )`,
  `CREATE TABLE IF NOT EXISTS webhook_events (
     id bigserial PRIMARY KEY,
     provider text NOT NULL,
     client_id text NOT NULL,
     event_type text,
     verified boolean NOT NULL DEFAULT false,
     payload jsonb,
     received_at timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_webhook_events_client ON webhook_events (client_id, received_at DESC)`,
  `CREATE TABLE IF NOT EXISTS client_settings (
     client_id text PRIMARY KEY,
     status text,
     service_type text,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`,
];

let schemaPromise: Promise<void> | null = null;

async function db(): Promise<NeonQueryFunction<false, false>> {
  const sql = getSql();
  if (!schemaPromise) {
    schemaPromise = (async () => {
      for (const stmt of SCHEMA_STATEMENTS) await sql.query(stmt);
    })();
  }
  await schemaPromise;
  return sql;
}

// ---- Connectors ----

export interface ConnectorRow {
  connector_id: string;
  enabled: boolean;
  has_secret: boolean;
  has_api_key: boolean;
  last_event_at: string | null;
}

export async function listConnectors(clientId: string): Promise<ConnectorRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT connector_id, enabled,
           (secret <> '') AS has_secret,
           (api_key <> '') AS has_api_key,
           last_event_at
    FROM connectors WHERE client_id = ${clientId}
  `;
  return rows as ConnectorRow[];
}

export async function upsertConnector(
  clientId: string,
  connectorId: string,
  data: { enabled: boolean; secret?: string; apiKey?: string }
): Promise<void> {
  const sql = await db();
  const secret = data.secret ?? "";
  const apiKey = data.apiKey ?? "";
  await sql`
    INSERT INTO connectors (client_id, connector_id, enabled, secret, api_key)
    VALUES (${clientId}, ${connectorId}, ${data.enabled}, ${secret}, ${apiKey})
    ON CONFLICT (client_id, connector_id) DO UPDATE SET
      enabled = ${data.enabled},
      secret  = CASE WHEN ${secret} <> '' THEN ${secret} ELSE connectors.secret END,
      api_key = CASE WHEN ${apiKey} <> '' THEN ${apiKey} ELSE connectors.api_key END
  `;
}

export async function getConnectorSecret(clientId: string, connectorId: string): Promise<string> {
  const sql = await db();
  const rows = await sql`SELECT secret FROM connectors WHERE client_id = ${clientId} AND connector_id = ${connectorId}`;
  return (rows[0]?.secret as string) ?? "";
}

export async function touchConnector(clientId: string, connectorId: string): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO connectors (client_id, connector_id, enabled, last_event_at)
    VALUES (${clientId}, ${connectorId}, true, now())
    ON CONFLICT (client_id, connector_id) DO UPDATE SET last_event_at = now()
  `;
}

// ---- Webhook events ----

export interface EventRow {
  id: number;
  provider: string;
  event_type: string | null;
  verified: boolean;
  payload: Record<string, unknown> | null;
  received_at: string;
}

export async function insertWebhookEvent(e: {
  provider: string;
  clientId: string;
  eventType: string | null;
  verified: boolean;
  payload: unknown;
}): Promise<number> {
  const sql = await db();
  const rows = await sql`
    INSERT INTO webhook_events (provider, client_id, event_type, verified, payload)
    VALUES (${e.provider}, ${e.clientId}, ${e.eventType}, ${e.verified}, ${JSON.stringify(e.payload)})
    RETURNING id
  `;
  return rows[0]?.id as number;
}

export async function listEvents(clientId: string, limit = 25): Promise<EventRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT id, provider, event_type, verified, payload, received_at
    FROM webhook_events WHERE client_id = ${clientId}
    ORDER BY received_at DESC LIMIT ${limit}
  `;
  return rows as EventRow[];
}

export async function eventCounts(clientId: string): Promise<{ total: number; today: number }> {
  const sql = await db();
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE received_at >= date_trunc('day', now()))::int AS today
    FROM webhook_events WHERE client_id = ${clientId}
  `;
  return { total: (rows[0]?.total as number) ?? 0, today: (rows[0]?.today as number) ?? 0 };
}

// ---- Client settings (status / service type) ----

export interface ClientSettingsRow {
  client_id: string;
  status: string | null;
  service_type: string | null;
}

export async function getAllClientSettings(): Promise<ClientSettingsRow[]> {
  const sql = await db();
  const rows = await sql`SELECT client_id, status, service_type FROM client_settings`;
  return rows as ClientSettingsRow[];
}

export async function resetClient(clientId: string): Promise<void> {
  const sql = await db();
  await sql`DELETE FROM webhook_events WHERE client_id = ${clientId}`;
  await sql`DELETE FROM connectors WHERE client_id = ${clientId}`;
  await sql`DELETE FROM client_settings WHERE client_id = ${clientId}`;
}

export async function upsertClientSettings(
  clientId: string,
  data: { status?: string; serviceType?: string }
): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO client_settings (client_id, status, service_type, updated_at)
    VALUES (${clientId}, ${data.status ?? null}, ${data.serviceType ?? null}, now())
    ON CONFLICT (client_id) DO UPDATE SET
      status = COALESCE(${data.status ?? null}, client_settings.status),
      service_type = COALESCE(${data.serviceType ?? null}, client_settings.service_type),
      updated_at = now()
  `;
}
