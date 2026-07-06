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
  `CREATE TABLE IF NOT EXISTS users (
     id text PRIMARY KEY,
     name text NOT NULL DEFAULT '',
     email text NOT NULL DEFAULT '',
     role text NOT NULL DEFAULT 'client_team',
     client_access text[] NOT NULL DEFAULT '{}',
     status text NOT NULL DEFAULT 'active',
     created_at timestamptz NOT NULL DEFAULT now()
   )`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text NOT NULL DEFAULT ''`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_token text NOT NULL DEFAULT ''`,
  `CREATE TABLE IF NOT EXISTS results_monthly (
     client_id text NOT NULL,
     month text NOT NULL,
     closed_won numeric,
     new_pipeline numeric,
     meetings_held integer,
     meetings_scheduled integer,
     source text NOT NULL DEFAULT 'manual',
     updated_at timestamptz NOT NULL DEFAULT now(),
     PRIMARY KEY (client_id, month)
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

export async function listEvents(
  clientId: string,
  limit = 25,
  sinceIso: string | null = null,
  untilIso: string | null = null
): Promise<EventRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT id, provider, event_type, verified, payload, received_at
    FROM webhook_events
    WHERE client_id = ${clientId}
      AND (${sinceIso}::timestamptz IS NULL OR received_at >= ${sinceIso}::timestamptz)
      AND (${untilIso}::timestamptz IS NULL OR received_at < ${untilIso}::timestamptz)
    ORDER BY received_at DESC LIMIT ${limit}
  `;
  return rows as EventRow[];
}

export async function listEventsByProvider(
  clientId: string,
  provider: string,
  sinceIso: string | null = null,
  untilIso: string | null = null,
  limit = 5000
): Promise<EventRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT id, provider, event_type, verified, payload, received_at
    FROM webhook_events
    WHERE client_id = ${clientId} AND provider = ${provider}
      AND (${sinceIso}::timestamptz IS NULL OR received_at >= ${sinceIso}::timestamptz)
      AND (${untilIso}::timestamptz IS NULL OR received_at < ${untilIso}::timestamptz)
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

// ---- Monthly results (going-forward entry; overrides/extends the historical import) ----

export interface ResultsMonthlyRow {
  client_id: string;
  month: string;
  closed_won: number | null;
  new_pipeline: number | null;
  meetings_held: number | null;
  meetings_scheduled: number | null;
  source: string;
}

export async function listResultsMonthly(): Promise<ResultsMonthlyRow[]> {
  const sql = await db();
  const rows = await sql`
    SELECT client_id, month, closed_won::float8 AS closed_won, new_pipeline::float8 AS new_pipeline,
           meetings_held, meetings_scheduled, source
    FROM results_monthly ORDER BY month
  `;
  return rows as ResultsMonthlyRow[];
}

export async function upsertResultsMonthly(r: {
  clientId: string;
  month: string;
  closedWon: number | null;
  newPipeline: number | null;
  meetingsHeld: number | null;
  meetingsScheduled: number | null;
  source?: string;
}): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO results_monthly (client_id, month, closed_won, new_pipeline, meetings_held, meetings_scheduled, source, updated_at)
    VALUES (${r.clientId}, ${r.month}, ${r.closedWon}, ${r.newPipeline}, ${r.meetingsHeld}, ${r.meetingsScheduled}, ${r.source ?? "manual"}, now())
    ON CONFLICT (client_id, month) DO UPDATE SET
      closed_won = ${r.closedWon},
      new_pipeline = ${r.newPipeline},
      meetings_held = ${r.meetingsHeld},
      meetings_scheduled = ${r.meetingsScheduled},
      source = ${r.source ?? "manual"},
      updated_at = now()
  `;
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

// ---- Users ----

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  client_access: string[];
  status: string;
}

export async function listUsers(): Promise<UserRow[]> {
  const sql = await db();
  const rows = await sql`SELECT id, name, email, role, client_access, status FROM users ORDER BY created_at`;
  return rows as UserRow[];
}

export async function upsertUser(u: {
  id: string;
  name: string;
  email: string;
  role: string;
  clientAccess: string[];
  status?: string;
}): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO users (id, name, email, role, client_access, status)
    VALUES (${u.id}, ${u.name}, ${u.email}, ${u.role}, ${u.clientAccess}, ${u.status ?? "active"})
    ON CONFLICT (id) DO UPDATE SET
      name = ${u.name}, email = ${u.email}, role = ${u.role},
      client_access = ${u.clientAccess}, status = ${u.status ?? "active"}
  `;
}

export async function deleteUser(id: string): Promise<void> {
  const sql = await db();
  await sql`DELETE FROM users WHERE id = ${id}`;
}

// ---- Auth ----

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  client_access: string[];
  status: string;
  password_hash: string;
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const sql = await db();
  const rows = await sql`
    SELECT id, name, email, role, client_access, status, password_hash
    FROM users WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  return (rows[0] as AuthUser) ?? null;
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const sql = await db();
  const rows = await sql`
    SELECT id, name, email, role, client_access, status, password_hash
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as AuthUser) ?? null;
}

export async function getUserByInviteToken(token: string): Promise<AuthUser | null> {
  const sql = await db();
  const rows = await sql`
    SELECT id, name, email, role, client_access, status, password_hash
    FROM users WHERE invite_token = ${token} AND invite_token <> '' LIMIT 1
  `;
  return (rows[0] as AuthUser) ?? null;
}

export async function setPassword(id: string, passwordHash: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE users SET password_hash = ${passwordHash}, invite_token = '', status = 'active' WHERE id = ${id}`;
}

export async function setInviteToken(id: string, token: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE users SET invite_token = ${token} WHERE id = ${id}`;
}

// Rule: when a client is paused/inactive, deactivate its client-side users and
// turn off its connectors. StudioGTM staff (owner/sdr) are left untouched.
export async function deactivateClientUsers(clientId: string): Promise<void> {
  const sql = await db();
  await sql`
    UPDATE users SET status = 'deactivated'
    WHERE role IN ('client', 'client_team') AND ${clientId} = ANY(client_access)
  `;
}

export async function disableClientConnectors(clientId: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE connectors SET enabled = false WHERE client_id = ${clientId}`;
}

export async function enableClientConnectors(clientId: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE connectors SET enabled = true WHERE client_id = ${clientId}`;
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
