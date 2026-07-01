"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/session";
import { CLIENTS } from "@/lib/data";
import {
  CONNECTORS,
  CATEGORY_LABELS,
  webhookUrl,
  type ConnectorCategory,
  type ConnectorConfig,
} from "@/lib/connectors";
import { Card, SectionTitle, Pill } from "@/components/ui";
import { Plug, Copy, Check, ExternalLink, Phone, Mail, Contact, Sparkles } from "lucide-react";
import clsx from "clsx";

type ConfigMap = Record<string, ConnectorConfig>;

const CATEGORY_ICON: Record<ConnectorCategory, React.ReactNode> = {
  dialer: <Phone size={15} />,
  email: <Mail size={15} />,
  linkedin: <Contact size={15} />,
  enablement: <Sparkles size={15} />,
};

export function ConnectorsPanel() {
  const { clientId } = useSession();
  const client = CLIENTS[clientId].client;
  const [config, setConfig] = useState<ConfigMap>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("https://signal-app-ten-zeta.vercel.app");

  const storageKey = `signal.connectors.${clientId}`;

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setConfig(raw ? JSON.parse(raw) : {});
    } catch {
      setConfig({});
    }
  }, [storageKey]);

  function save(next: ConfigMap) {
    setConfig(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const grouped = useMemo(() => {
    const g: Record<ConnectorCategory, typeof CONNECTORS> = {
      dialer: [],
      email: [],
      linkedin: [],
      enablement: [],
    };
    for (const c of CONNECTORS) g[c.category].push(c);
    return g;
  }, []);

  const connectedCount = Object.values(config).filter((c) => c?.enabled).length;

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Plug size={16} />}
        title="Connectors"
        right={
          <span className="text-[12px] text-ink-3">
            {connectedCount} connected · for {client.name}
          </span>
        }
      />
      <p className="mb-4 text-[13px] text-ink-2">
        Connect your tools so activity streams into Signal in real time — no manual exports. Paste
        each connector&apos;s webhook URL into that tool, add the signing secret, and save.
      </p>

      <div className="space-y-5">
        {(Object.keys(grouped) as ConnectorCategory[]).map((cat) => (
          <div key={cat}>
            <div className="mb-2 flex items-center gap-2 text-[12px] uppercase tracking-wide text-ink-3">
              {CATEGORY_ICON[cat]} {CATEGORY_LABELS[cat]}
            </div>
            <div className="space-y-2">
              {grouped[cat].map((def) => {
                const cfg = config[def.id];
                const connected = !!cfg?.enabled;
                const open = openId === def.id;
                const url = webhookUrl(origin, def.id, clientId);
                return (
                  <div key={def.id} className="rounded-[12px] border border-border bg-surface-2">
                    <button
                      onClick={() => setOpenId(open ? null : def.id)}
                      className="flex w-full items-center gap-3 p-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-ink">{def.name}</span>
                          {connected ? <Pill tone="good">Connected</Pill> : <Pill tone="neutral">Not connected</Pill>}
                        </div>
                        <p className="truncate text-[12px] text-ink-3">{def.feeds}</p>
                      </div>
                      <span className="text-[12px] text-gold">{open ? "Close" : "Configure"}</span>
                    </button>

                    {open && (
                      <div className="space-y-3 border-t border-border p-3">
                        <Field label="Inbound webhook URL (paste this into the tool)">
                          <CopyRow value={url} />
                        </Field>
                        <Field label="Signing secret (from the tool, used to verify events)">
                          <input
                            type="text"
                            value={cfg?.secret ?? ""}
                            placeholder="whsec_…"
                            onChange={(e) => save({ ...config, [def.id]: { ...(cfg ?? blank()), secret: e.target.value } })}
                            className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
                          />
                        </Field>
                        <Field label="API key (optional — for pulling data or backfills)">
                          <input
                            type="password"
                            value={cfg?.apiKey ?? ""}
                            placeholder="••••••••"
                            onChange={(e) => save({ ...config, [def.id]: { ...(cfg ?? blank()), apiKey: e.target.value } })}
                            className="w-full rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
                          />
                        </Field>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            onClick={() => save({ ...config, [def.id]: { ...(cfg ?? blank()), enabled: true } })}
                            className="flex items-center gap-1.5 rounded-[8px] bg-navy px-3 py-1.5 text-[13px] text-sidebar-ink-active hover:opacity-90"
                          >
                            <Check size={14} /> {connected ? "Update connection" : "Connect"}
                          </button>
                          {connected && (
                            <button
                              onClick={() => save({ ...config, [def.id]: { ...(cfg ?? blank()), enabled: false } })}
                              className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
                            >
                              Disconnect
                            </button>
                          )}
                          {def.docsUrl && (
                            <a
                              href={def.docsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-auto flex items-center gap-1 text-[12.5px] text-gold hover:underline"
                            >
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

      <p className="mt-4 rounded-[10px] bg-warn-soft px-3 py-2 text-[12.5px] text-warn-ink">
        Endpoint is live and will accept + verify events now. Streaming received data onto the
        dashboards turns on once storage is connected (a ~5-click, one-time step).
      </p>
    </Card>
  );
}

function blank(): ConnectorConfig {
  return { enabled: false, secret: "", apiKey: "" };
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
      <code className="flex-1 truncate rounded-[8px] border border-border bg-surface px-3 py-2 text-[12.5px] text-ink">
        {value}
      </code>
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
