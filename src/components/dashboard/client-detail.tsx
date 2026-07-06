"use client";

import { useEffect, useState } from "react";
import { Phone, Contact, Mail, Radio } from "lucide-react";
import { Card, SectionTitle, EmptyState, Pill } from "@/components/ui";
import { LiveFeed } from "@/components/live-feed";
import { num, ratePct } from "@/lib/format";
import { monthLabel, monthKey } from "@/lib/history";
import {
  CALLS_MONTHLY,
  EMAIL_CAMPAIGNS,
  FLAX_CALL_LISTS,
  FLAX_CALL_TOTALS,
  FLAX_LINKEDIN_CAMPAIGNS,
  FLAX_LINKEDIN_TOTALS,
  type MonthlyCalls,
} from "@/lib/historical";
import { clientMeta } from "@/lib/clients";

export function FunnelTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[10px] border border-border bg-surface-2 px-3.5 py-3">
      <p className="text-[11px] uppercase tracking-wide text-ink-3">{label}</p>
      <p className="serif tabular mt-0.5 text-[22px] leading-none text-ink">{value}</p>
      {sub && <p className="mt-1 text-[11.5px] text-ink-2">{sub}</p>}
    </div>
  );
}

/** Calls: historical monthly rollups + a live current-month row from Orum events. */
export function CallsPanel({ clientId, months }: { clientId: string; months: string[] }) {
  const [live, setLive] = useState<MonthlyCalls | null>(null);
  const currentMonth = monthKey(new Date());

  useEffect(() => {
    let on = true;
    fetch(`/api/calls?client=${clientId}&range=this_month`)
      .then((r) => r.json())
      .then((d) => {
        if (on && d.ok && d.metrics && d.metrics.dials > 0) {
          setLive({
            clientId,
            month: currentMonth,
            dials: d.metrics.dials,
            callbacks: null,
            connects: d.metrics.connects,
            conversations: d.metrics.conversations,
            meetings: d.metrics.meetings,
          });
        }
      })
      .catch(() => {});
    return () => { on = false; };
  }, [clientId, currentMonth]);

  const monthSet = new Set(months);
  const rows = CALLS_MONTHLY.filter((r) => r.clientId === clientId && monthSet.has(r.month));
  const all = live && monthSet.has(live.month) ? [...rows, live] : rows;

  // Flax's dial export is an all-time rollup (not monthly), so it can't
  // follow the date filter — show it as clearly-labeled all-time totals.
  if (all.length === 0 && clientId === "flax") {
    const t = FLAX_CALL_TOTALS;
    return (
      <Card className="p-5">
        <SectionTitle
          icon={<Phone size={16} />}
          title="Calls"
          right={<span className="text-[12px] text-ink-3">all-time · dial export (not month-filterable)</span>}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <FunnelTile label="Dials" value={num(t.dials)} />
          <FunnelTile label="Connects" value={num(t.connects)} sub={`${ratePct(t.connects, t.dials)} of dials`} />
          <FunnelTile label="Conversations" value={num(t.conversations)} sub={`${ratePct(t.conversations, t.connects)} of connects`} />
          <FunnelTile label="Meetings" value={num(t.meetings)} sub={`${ratePct(t.meetings, t.conversations)} of conversations`} />
        </div>
        <p className="mb-1 mt-4 text-[11px] uppercase tracking-wide text-ink-3">Top lists (all-time)</p>
        <table className="w-full text-[12.5px]">
          <tbody>
            {FLAX_CALL_LISTS.slice(0, 5).map((l) => (
              <tr key={l.segment + l.list} className="border-b border-border/60 last:border-0">
                <td className="max-w-[280px] truncate py-1.5 text-ink">{l.list}</td>
                <td className="tabular py-1.5 text-right text-ink-2">{num(l.dials)} dials</td>
                <td className="tabular py-1.5 text-right text-ink-2">{num(l.connects)} connects</td>
                <td className="tabular py-1.5 text-right text-ink-2">{num(l.meetings)} mtgs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    );
  }

  if (all.length === 0) {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Phone size={16} />} title="Calls" />
        <EmptyState
          title="No calling data in this range"
          body="No calling history was imported for this client in the selected months, and no live dialer events have arrived. Live tracking starts as soon as a dialer connector fires."
        />
      </Card>
    );
  }

  const t = all.reduce(
    (a, r) => ({
      dials: a.dials + r.dials,
      connects: a.connects + r.connects,
      conversations: a.conversations + r.conversations,
      meetings: a.meetings + r.meetings,
    }),
    { dials: 0, connects: 0, conversations: 0, meetings: 0 }
  );

  const flaxLists = clientId === "flax" ? FLAX_CALL_LISTS.slice(0, 5) : [];

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Phone size={16} />}
        title="Calls"
        right={
          <span className="text-[12px] text-ink-3">
            {live ? "history + live (Orum)" : "historical import"}
          </span>
        }
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FunnelTile label="Dials" value={num(t.dials)} />
        <FunnelTile label="Connects" value={num(t.connects)} sub={`${ratePct(t.connects, t.dials)} of dials`} />
        <FunnelTile label="Conversations" value={num(t.conversations)} sub={`${ratePct(t.conversations, t.connects)} of connects`} />
        <FunnelTile label="Meetings" value={num(t.meetings)} sub={`${ratePct(t.meetings, t.conversations)} of conversations`} />
      </div>

      {all.length > 1 && (
        <table className="mt-4 w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-3">
              <th className="py-1.5 font-medium">Month</th>
              <th className="py-1.5 text-right font-medium">Dials</th>
              <th className="py-1.5 text-right font-medium">Connects</th>
              <th className="py-1.5 text-right font-medium">Conversations</th>
              <th className="py-1.5 text-right font-medium">Meetings</th>
            </tr>
          </thead>
          <tbody>
            {all.map((r) => (
              <tr key={r.month} className="border-b border-border/60 last:border-0">
                <td className="tabular py-1.5 text-ink">
                  {monthLabel(r.month)}
                  {live && r.month === live.month && <Pill tone="gold"> live</Pill>}
                </td>
                <td className="tabular py-1.5 text-right text-ink">{num(r.dials)}</td>
                <td className="tabular py-1.5 text-right text-ink">{num(r.connects)}</td>
                <td className="tabular py-1.5 text-right text-ink">{num(r.conversations)}</td>
                <td className="tabular py-1.5 text-right text-ink">{num(r.meetings)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {flaxLists.length > 0 && (
        <>
          <p className="mb-1 mt-4 text-[11px] uppercase tracking-wide text-ink-3">Top lists (all-time)</p>
          <table className="w-full text-[12.5px]">
            <tbody>
              {flaxLists.map((l) => (
                <tr key={l.segment + l.list} className="border-b border-border/60 last:border-0">
                  <td className="max-w-[280px] truncate py-1.5 text-ink">{l.list}</td>
                  <td className="tabular py-1.5 text-right text-ink-2">{num(l.dials)} dials</td>
                  <td className="tabular py-1.5 text-right text-ink-2">{num(l.connects)} connects</td>
                  <td className="tabular py-1.5 text-right text-ink-2">{num(l.meetings)} mtgs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Card>
  );
}

export function LinkedInPanel({ clientId }: { clientId: string }) {
  if (clientId !== "flax") {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Contact size={16} />} title="LinkedIn" />
        <EmptyState
          title="Awaiting data"
          body="No LinkedIn history has been imported for this client. Connect LGM or HeyReach webhooks (Settings → Connectors) to track it live."
        />
      </Card>
    );
  }
  const t = FLAX_LINKEDIN_TOTALS;
  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Contact size={16} />}
        title="LinkedIn"
        right={<span className="text-[12px] text-ink-3">LGM report · {t.campaignsLaunched} launched campaigns</span>}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FunnelTile label="Contacted" value={num(t.contacted)} />
        <FunnelTile label="Replies" value={num(t.replies)} sub={`${ratePct(t.replies, t.contacted)} blended reply rate`} />
        <FunnelTile label="Won" value={num(t.won)} sub="interested + booked" />
        <FunnelTile label="Audiences" value={num(t.audiences)} />
      </div>
      <p className="mb-1 mt-4 text-[11px] uppercase tracking-wide text-ink-3">Top campaigns by replies</p>
      <table className="w-full text-[12.5px]">
        <tbody>
          {FLAX_LINKEDIN_CAMPAIGNS.slice(0, 5).map((c) => (
            <tr key={c.campaign} className="border-b border-border/60 last:border-0">
              <td className="max-w-[300px] truncate py-1.5 text-ink">{c.campaign}</td>
              <td className="tabular py-1.5 text-right text-ink-2">{num(c.contacted)} contacted</td>
              <td className="tabular py-1.5 text-right text-ink-2">{num(c.replies)} replies</td>
              <td className="tabular py-1.5 text-right text-ink-2">{ratePct(c.replies, c.contacted)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function EmailPanel({ clientId }: { clientId: string }) {
  const campaigns = EMAIL_CAMPAIGNS.filter((c) => c.clientId === clientId);
  if (campaigns.length === 0) {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Mail size={16} />} title="Email" />
        <EmptyState
          title="Awaiting data"
          body="No email history has been imported for this client. Connect Smartlead or Instantly webhooks (Settings → Connectors) to track it live."
        />
      </Card>
    );
  }
  const totals = campaigns.reduce(
    (a, c) => ({ contacts: a.contacts + c.contacts, sent: a.sent + c.sent, replies: a.replies + c.replies }),
    { contacts: 0, sent: 0, replies: 0 }
  );
  return (
    <Card className="p-5">
      <SectionTitle icon={<Mail size={16} />} title="Email" right={<span className="text-[12px] text-ink-3">by campaign · historical import</span>} />
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-3">
            <th className="py-1.5 font-medium">Campaign</th>
            <th className="py-1.5 text-right font-medium">Contacts</th>
            <th className="py-1.5 text-right font-medium">Sent</th>
            <th className="py-1.5 text-right font-medium">Replies</th>
            <th className="py-1.5 text-right font-medium">Reply rate</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.campaign} className="border-b border-border/60">
              <td className="py-1.5 text-ink">{c.campaign}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.contacts)}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.sent)}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.replies)}</td>
              <td className="tabular py-1.5 text-right text-ink">{ratePct(c.replies, c.sent)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-1.5 font-medium text-ink">Total</td>
            <td className="tabular py-1.5 text-right font-medium text-ink">{num(totals.contacts)}</td>
            <td className="tabular py-1.5 text-right font-medium text-ink">{num(totals.sent)}</td>
            <td className="tabular py-1.5 text-right font-medium text-ink">{num(totals.replies)}</td>
            <td className="tabular py-1.5 text-right font-medium text-ink">{ratePct(totals.replies, totals.sent)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export function LivePanel({ clientId }: { clientId: string }) {
  const meta = clientMeta(clientId);
  if (meta?.status !== "active") {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Radio size={16} />} title="Live feed" />
        <EmptyState
          title={`No live connectors — ${meta?.name ?? clientId} is non-active`}
          body="This client's view is historical. Live events stream here for active clients with connected tools."
        />
      </Card>
    );
  }
  return <LiveFeed clientId={clientId} />;
}
