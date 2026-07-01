"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, SectionTitle, Pill } from "@/components/ui";
import { Radio, RefreshCw } from "lucide-react";

interface EventRow {
  id: number;
  provider: string;
  event_type: string | null;
  verified: boolean;
  payload: Record<string, unknown> | null;
  received_at: string;
}

function summarize(payload: Record<string, unknown> | null): string {
  if (!payload) return "";
  const p = (payload.payload && typeof payload.payload === "object" ? payload.payload : payload) as Record<string, unknown>;
  const pick = ["disposition", "prospect name", "prospectName", "list name", "listName", "user email", "userEmail", "subject", "outcome"];
  const parts: string[] = [];
  for (const k of pick) {
    if (p[k] != null && String(p[k]).trim()) parts.push(String(p[k]));
    if (parts.length >= 2) break;
  }
  return parts.join(" · ");
}

export function LiveFeed({ clientId }: { clientId: string }) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [counts, setCounts] = useState({ total: 0, today: 0 });
  const [dbDown, setDbDown] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/events?client=${clientId}`);
      const data = await res.json();
      setDbDown(!!data.dbUnavailable);
      setEvents(data.events ?? []);
      setCounts(data.counts ?? { total: 0, today: 0 });
    } catch {
      setDbDown(true);
    } finally {
      setLoaded(true);
    }
  }, [clientId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000); // poll for a live feel
    return () => clearInterval(t);
  }, [load]);

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Radio size={16} />}
        title="Live from your connectors"
        right={
          <button onClick={load} className="flex items-center gap-1 text-[12px] text-ink-3 hover:text-ink">
            <RefreshCw size={13} /> {counts.today} today · {counts.total} total
          </button>
        }
      />
      {!loaded ? (
        <p className="text-[13px] text-ink-3">Loading…</p>
      ) : dbDown ? (
        <p className="rounded-[10px] bg-warn-soft px-3 py-2 text-[12.5px] text-warn-ink">
          Live feed connects in production (database not reachable here).
        </p>
      ) : events.length === 0 ? (
        <p className="text-[13px] text-ink-2">
          No live events yet. Connect a tool in Settings → Connectors and events will stream in here in real time.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-2 p-2.5">
              <Pill tone="gold">{e.provider}</Pill>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-ink">{e.event_type ?? "event"}</p>
                {summarize(e.payload) && <p className="truncate text-[12px] text-ink-3">{summarize(e.payload)}</p>}
              </div>
              {!e.verified && <span className="text-[11px] text-warn-ink">unverified</span>}
              <span className="shrink-0 text-[11px] text-ink-3">{new Date(e.received_at).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
