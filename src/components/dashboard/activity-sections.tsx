"use client";

// Aggregate (book-wide) activity sections for the Main Dashboard section
// toggle. Same accuracy rules as everywhere: month-filtered sums come only
// from monthly rows + live events; all-time exports and different-taxonomy
// datasets are shown separately and clearly labeled, never mixed into a
// filtered funnel total.

import { useEffect, useState } from "react";
import { Phone, Contact, Mail } from "lucide-react";
import { Card, SectionTitle, EmptyState, Pill } from "@/components/ui";
import { CallStats, FunnelTile } from "@/components/dashboard/client-detail";
import { num, ratePct } from "@/lib/format";
import { monthKey } from "@/lib/history";
import { clientName } from "@/lib/clients";
import {
  CALLS_MONTHLY,
  EMAIL_CAMPAIGNS,
  FLAX_CALL_TOTALS,
  FLAX_LINKEDIN_CAMPAIGNS,
  FLAX_LINKEDIN_TOTALS,
  YETI_CALL_WEEKS,
} from "@/lib/historical";

interface CallTotals {
  dials: number;
  callbacks: number | null;
  connects: number;
  conversations: number;
  meetings: number;
}

const ZERO: CallTotals = { dials: 0, callbacks: null, connects: 0, conversations: 0, meetings: 0 };

function addTotals(a: CallTotals, b: CallTotals): CallTotals {
  return {
    dials: a.dials + b.dials,
    callbacks: b.callbacks != null ? (a.callbacks ?? 0) + b.callbacks : a.callbacks,
    connects: a.connects + b.connects,
    conversations: a.conversations + b.conversations,
    meetings: a.meetings + b.meetings,
  };
}

export function AggCallsSection({ selected, months }: { selected: string[]; months: string[] }) {
  const currentMonth = monthKey(new Date());
  const includesCurrent = months.includes(currentMonth);
  const [live, setLive] = useState<Record<string, CallTotals>>({});

  // Live current-month overlay per selected client (only clients with events return data).
  useEffect(() => {
    if (!includesCurrent) {
      setLive({});
      return;
    }
    let on = true;
    Promise.all(
      selected.map((id) =>
        fetch(`/api/calls?client=${id}&range=this_month`)
          .then((r) => r.json())
          .then((d) => [id, d.ok && d.metrics && d.metrics.dials > 0 ? d.metrics : null] as const)
          .catch(() => [id, null] as const)
      )
    ).then((pairs) => {
      if (!on) return;
      const map: Record<string, CallTotals> = {};
      for (const [id, m] of pairs) {
        if (m) map[id] = { dials: m.dials, callbacks: null, connects: m.connects, conversations: m.conversations, meetings: m.meetings };
      }
      setLive(map);
    });
    return () => { on = false; };
  }, [selected, includesCurrent]);

  const monthSet = new Set(months);
  const perClient = new Map<string, CallTotals>();
  for (const id of selected) {
    const hist = CALLS_MONTHLY.filter((r) => r.clientId === id && monthSet.has(r.month)).reduce(
      (a, r) => addTotals(a, { dials: r.dials, callbacks: r.callbacks, connects: r.connects, conversations: r.conversations, meetings: r.meetings }),
      ZERO
    );
    const withLive = live[id] ? addTotals(hist, live[id]) : hist;
    if (withLive.dials > 0) perClient.set(id, withLive);
  }
  const total = [...perClient.values()].reduce(addTotals, ZERO);
  const flaxSelected = selected.includes("flax");

  // YetiConnect's second dialer (Derek on Nooks): weekly rollups with their
  // own outcome taxonomy — shown as a separate labeled row, never mixed into
  // the funnel totals. (The Orum side is in CALLS_MONTHLY and counts above.)
  const yetiWeeks = selected.includes("yeticonnect")
    ? YETI_CALL_WEEKS.filter((w) => monthSet.has(w.weekStart.slice(0, 7)))
    : [];
  const yeti = yetiWeeks.length
    ? { dials: yetiWeeks.reduce((a, w) => a + w.callsMade, 0), meetings: yetiWeeks.reduce((a, w) => a + w.meetingsBooked, 0) }
    : null;

  if (perClient.size === 0 && !flaxSelected && !yeti) {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Phone size={16} />} title="Calls — all selected clients" />
        <EmptyState
          title="No calling data in this range"
          body="No imported calling history or live dialer events fall in the selected months for the selected clients."
        />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Phone size={16} />}
        title="Calls — all selected clients"
        right={<span className="text-[12px] text-ink-3">history{Object.keys(live).length ? " + live (Orum)" : ""}</span>}
      />
      {perClient.size > 0 && (
        <>
          <CallStats dials={total.dials} callbacks={total.callbacks} connects={total.connects} conversations={total.conversations} meetings={total.meetings} />
          <table className="mt-4 w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-3">
                <th className="py-1.5 font-medium">Client</th>
                <th className="py-1.5 text-right font-medium">Dials</th>
                <th className="py-1.5 text-right font-medium">Callbacks</th>
                <th className="py-1.5 text-right font-medium">Connects</th>
                <th className="py-1.5 text-right font-medium">Conversations</th>
                <th className="py-1.5 text-right font-medium">Meetings</th>
              </tr>
            </thead>
            <tbody>
              {[...perClient.entries()].map(([id, t]) => (
                <tr key={id} className="border-b border-border/60 last:border-0">
                  <td className="py-1.5 text-ink">
                    {clientName(id)}
                    {live[id] && <Pill tone="gold"> live</Pill>}
                  </td>
                  <td className="tabular py-1.5 text-right text-ink">{num(t.dials)}</td>
                  <td className="tabular py-1.5 text-right text-ink">{t.callbacks != null ? num(t.callbacks) : "—"}</td>
                  <td className="tabular py-1.5 text-right text-ink">{num(t.connects)}</td>
                  <td className="tabular py-1.5 text-right text-ink">{num(t.conversations)}</td>
                  <td className="tabular py-1.5 text-right text-ink">{num(t.meetings)}</td>
                </tr>
              ))}
              {yeti && (
                <tr className="border-b border-border/60 last:border-0">
                  <td className="py-1.5 text-ink">YetiConnect — Nooks dialer (Derek) <span className="text-ink-3">†</span></td>
                  <td className="tabular py-1.5 text-right text-ink">{num(yeti.dials)}</td>
                  <td className="tabular py-1.5 text-right text-ink-3">—</td>
                  <td className="tabular py-1.5 text-right text-ink-3">—</td>
                  <td className="tabular py-1.5 text-right text-ink-3">—</td>
                  <td className="tabular py-1.5 text-right text-ink">{num(yeti.meetings)}</td>
                </tr>
              )}
            </tbody>
          </table>
          {yeti && (
            <p className="mt-2 text-[11.5px] text-ink-3">
              † YetiConnect runs two dialers: the Orum side (row above) has full funnel data and counts in the totals; the
              Nooks tracker reports only calls + meetings in its own taxonomy, so it's listed separately and excluded from
              the funnel totals. Scope to YetiConnect for the full breakdown.
            </p>
          )}
        </>
      )}

      {perClient.size === 0 && yeti && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <FunnelTile label="Dials" value={num(yeti.dials)} sub="YetiConnect tracker" />
          <FunnelTile label="Meetings" value={num(yeti.meetings)} sub="YetiConnect tracker" />
        </div>
      )}

      {flaxSelected && (
        <p className="mt-4 rounded-[10px] bg-surface-2 p-3 text-[12.5px] text-ink-2">
          <span className="font-medium text-ink">Flax AI</span> calling history is an all-time export and can't follow the
          month filter, so it's excluded from the totals above: {num(FLAX_CALL_TOTALS.dials)} dials ·{" "}
          {num(FLAX_CALL_TOTALS.connects)} connects · {num(FLAX_CALL_TOTALS.conversations)} conversations ·{" "}
          {num(FLAX_CALL_TOTALS.meetings)} meetings. Scope to Flax for the full breakdown.
        </p>
      )}
    </Card>
  );
}

export function AggEmailSection({ selected }: { selected: string[] }) {
  const campaigns = EMAIL_CAMPAIGNS.filter((c) => selected.includes(c.clientId));
  const withData = new Set(campaigns.map((c) => c.clientId));
  const missing = selected.filter((id) => !withData.has(id));

  if (campaigns.length === 0) {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Mail size={16} />} title="Email — all selected clients" />
        <EmptyState
          title="No email history for the selected clients"
          body="Share an email-campaign export to backfill, or connect Smartlead / Instantly webhooks (Settings → Connectors) to track it live."
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
      <SectionTitle icon={<Mail size={16} />} title="Email — all selected clients" right={<span className="text-[12px] text-ink-3">historical import · all-time per campaign</span>} />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <FunnelTile label="Contacts" value={num(totals.contacts)} />
        <FunnelTile label="Emails sent" value={num(totals.sent)} />
        <FunnelTile label="Replies" value={num(totals.replies)} sub={`${ratePct(totals.replies, totals.sent)} reply rate`} />
      </div>
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-ink-3">
            <th className="py-1.5 font-medium">Client</th>
            <th className="py-1.5 font-medium">Campaign</th>
            <th className="py-1.5 text-right font-medium">Contacts</th>
            <th className="py-1.5 text-right font-medium">Sent</th>
            <th className="py-1.5 text-right font-medium">Replies</th>
            <th className="py-1.5 text-right font-medium">Reply rate</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.clientId + c.campaign} className="border-b border-border/60 last:border-0">
              <td className="py-1.5 text-ink">{clientName(c.clientId)}</td>
              <td className="py-1.5 text-ink">{c.campaign}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.contacts)}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.sent)}</td>
              <td className="tabular py-1.5 text-right text-ink">{num(c.replies)}</td>
              <td className="tabular py-1.5 text-right text-ink">{ratePct(c.replies, c.sent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {missing.length > 0 && (
        <p className="mt-3 text-[12px] text-ink-3">
          No email history yet for: {missing.map((id) => clientName(id)).join(", ")}.
        </p>
      )}
    </Card>
  );
}

export function AggLinkedInSection({ selected }: { selected: string[] }) {
  const flaxSelected = selected.includes("flax");
  const missing = selected.filter((id) => id !== "flax");

  if (!flaxSelected) {
    return (
      <Card className="p-5">
        <SectionTitle icon={<Contact size={16} />} title="LinkedIn — all selected clients" />
        <EmptyState
          title="No LinkedIn history for the selected clients"
          body="Share a LinkedIn/LGM export to backfill, or connect LGM / HeyReach webhooks (Settings → Connectors) to track it live."
        />
      </Card>
    );
  }

  const t = FLAX_LINKEDIN_TOTALS;
  return (
    <Card className="p-5">
      <SectionTitle
        icon={<Contact size={16} />}
        title="LinkedIn — all selected clients"
        right={<span className="text-[12px] text-ink-3">Flax AI · LGM report · {t.campaignsLaunched} launched campaigns</span>}
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
      {missing.length > 0 && (
        <p className="mt-3 text-[12px] text-ink-3">
          No LinkedIn history yet for: {missing.map((id) => clientName(id)).join(", ")}.
        </p>
      )}
    </Card>
  );
}
