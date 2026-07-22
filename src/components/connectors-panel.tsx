"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/session";
import { clientName } from "@/lib/clients";
import { ClientSelect } from "@/components/client-select";
import {
  CONNECTORS,
  CATEGORY_LABELS,
  webhookUrl,
  type ConnectorCategory,
  type ConnectorDef,
} from "@/lib/connectors";
import { Card, SectionTitle, Pill } from "@/components/ui";
import { Plug, Copy, Check, ExternalLink, Phone, Mail, Contact, Sparkles, Webhook, KeyRound } from "lucide-react";
import clsx from "clsx";

interface Row {
  connector_id: string;
  enabled: boolean;
  has_secret: boolean;
  has_api_key: boolean;
  last_event_at: string | null;
}

const CATEGORY_ICON: Record<ConnectorCategory, React.ReactNode> = {
  dialer: <Phone size={15} />,
  email: <Mail size={15} />,
  linkedin: <Contact size={15} />,
  enablement: <Sparkles size={15} />,
};

export function ConnectorsPanel({ clientId: fixedClientId }: { clientId?: string }) {
  const { clientId: sessionClientId } = useSession();
  const clientId = fixedClientId ?? sessionClientId;
  const client = { name: clientName(clientId) };
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [inputs, setInputs] = useState<Record<string, { secret: string; apiKey: string }>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://signal-app-ten-zeta.vercel.app");
  const [dbDown, setDbDown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/connectors?client=${clientId}`);
      const data = await res.json();
      setDbDown(!!data.dbUnavailable);
      const map: Record<string, Row> = {};
      for (const r of data.connectors ?? []) map[r.connector_id] = r;
      setRows(map);
    } catch {
      setDbDown(true);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveConnector(id: string, enabled: boolean) {
    const inp = inputs[id] ?? { secret: "", apiKey: "" };
    await fetch("/api/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client: clientId, connectorId: id, enabled, secret: inp.secret, apiKey: inp.apiKey }),
    });
    setInputs((prev) => ({ ...prev, [id]: { secret: "", apiKey: "" } }));
    await load();
  }

  const grouped = useMemo(() => {
    const g: Record<ConnectorCategory, ConnectorDef[]> = { dialer: [], email: [], linkedin: [], enablement: [] };
    for (const c of CONNECTORS) g[c.category].push(c);
    return g;
  }, []);

  const connectedCount = Object.values(rows).filter((r) => r?.enabled).length;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Plug size={16} />}
        title="Connectors"
        right={
          <span className="flex items-center gap-2 text-[12px] text-ink-3">
            {connectedCount} connected{fixedClientId ? ` · ${client.name}` : <> · <ClientSelect /></>}
          </span>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-start gap-2 rounded-[10px] bg-surface-2 p-3 text-[12.5px] text-ink-2">
          <Webhook size={16} className="mt-0.5 shrink-0 text-gold" />
          <span><span className="font-medium text-ink">Webhook</span> — the tool pushes events to Signal in real time. Paste the URL below into the tool.</span>
        </div>
        <div className="flex items-start gap-2 rounded-[10px] bg-surface-2 p-3 text-[12.5px] text-ink-2">
          <KeyRound size={16} className="mt-0.5 shrink-0 text-gold" />
          <span><span className="font-medium text-ink">API key</span> — lets Signal pull from the tool for history/backfills. Optional.</span>
        </div>
      </div>

      {dbDown && (
        <p className="mb-4 rounded-[10px] bg-warn-soft px-3 py-2 text-[12.5px] text-warn-ink">
          Database not reachable in this environment — saving is disabled locally but works in production.
        </p>
      )}

      <div className="space-y-5">
        {(Object.keys(grouped) as ConnectorCategory[]).map((cat) => (
          <div key={cat}>
            <div className="mb-2 flex items-center gap-2 text-[12px] uppercase tracking-wide text-ink-3">
              {CATEGORY_ICON[cat]} {CATEGORY_LABELS[cat]}
            </div>
            <div className="space-y-2">
              {grouped[cat].map((def) => {
                const row = rows[def.id];
                const connected = !!row?.enabled;
                const open = openId === def.id;
                const url = webhookUrl(origin, def.id, clientId);
                const inp = inputs[def.id] ?? { secret: "", apiKey: "" };
                return (
                  <div key={def.id} className="rounded-[12px] border border-border bg-surface-2">
                    <button onClick={() => setOpenId(open ? null : def.id)} className="flex w-full items-center gap-3 p-3 text-left">
                      <Logo def={def} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-ink">{def.name}</span>
                          {connected ? <Pill tone="good">Connected</Pill> : <Pill tone="neutral">Not connected</Pill>}
                          {row?.has_secret && <span className="text-[11px] text-ink-3">secret set</span>}
                        </div>
                        <p className="truncate text-[12px] text-ink-3">
                          {def.feeds}
                          {row?.last_event_at ? ` · last event ${new Date(row.last_event_at).toLocaleString()}` : ""}
                        </p>
                      </div>
                      <span className="text-[12px] text-gold">{open ? "Close" : "Configure"}</span>
                    </button>

                    {open && (
                      <div className="space-y-3 border-t border-border p-3">
                        <Field label="Inbound webhook URL (paste this into the tool)">
                          <CopyRow value={url} />
                        </Field>
                        <Field label={row?.has_secret ? "Signing secret (saved — enter a new value to replace)" : "Signing secret (from the tool, verifies events)"}>
                          <input
                            type="password"
                            value={inp.secret}
                            placeholder={row?.has_secret ? "•••••••• (unchanged)" : "whsec_…"}
                            onChange={(e) => setInputs((prev) => ({ ...prev, [def.id]: { ...inp, secret: e.target.value } }))}
                            className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
                          />
                        </Field>
                        <Field label={row?.has_api_key ? "API key (saved — enter a new value to replace)" : "API key (optional — for pulling data / backfills)"}>
                          <input
                            type="password"
                            value={inp.apiKey}
                            placeholder={row?.has_api_key ? "•••••••• (unchanged)" : "••••••••"}
                            onChange={(e) => setInputs((prev) => ({ ...prev, [def.id]: { ...inp, apiKey: e.target.value } }))}
                            className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
                          />
                        </Field>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() => saveConnector(def.id, true)}
                            className="flex items-center gap-1.5 rounded-[8px] bg-navy px-3 py-1.5 text-[13px] text-sidebar-ink-active hover:opacity-90"
                          >
                            <Check size={14} /> {connected ? "Update connection" : "Connect"}
                          </button>
                          {connected && (
                            <button
                              onClick={() => saveConnector(def.id, false)}
                              className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
                            >
                              Disconnect
                            </button>
                          )}
                          {def.docsUrl && (
                            <a href={def.docsUrl} target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1 text-[12.5px] text-gold hover:underline">
                              Webhook docs <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Logo({ def }: { def: ConnectorDef }) {
  const [err, setErr] = useState(false);
  if (def.logoDomain && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://unavatar.io/${def.logoDomain}?fallback=false`}
        alt=""
        onError={() => setErr(true)}
        className="h-7 w-7 shrink-0 rounded-[7px] bg-white object-contain"
      />
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-gold-soft text-[12px] font-medium text-gold">
      {def.name[0]}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-ink-2">{label}</span>
      {children}
    </label>
  );
}

function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-stretch gap-2">
      <code className="flex-1 truncate rounded-[8px] border border-border bg-surface px-3 py-2 text-[12.5px] text-ink">{value}</code>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            // clipboard unavailable
          }
        }}
        className={clsx(
          "flex items-center gap-1.5 rounded-[8px] border px-3 text-[12.5px]",
          copied ? "border-good text-good-ink" : "border-border text-ink-2 hover:border-border-strong"
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
