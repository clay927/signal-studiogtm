"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import { CLIENTS } from "@/lib/data";
import { StatTile, SampleBadge, Card, SectionTitle, UpdatedStamp, Pill } from "@/components/ui";
import { num, ratePct, shortDate } from "@/lib/format";
import { capacity as leadCapacity } from "@/lib/metrics";
import { LiveFeed } from "@/components/live-feed";
import type { Call, CallMetrics } from "@/lib/calls";
import { Phone, Mail, Contact, Users, ExternalLink, PlayCircle } from "lucide-react";
import clsx from "clsx";

type Channel = "phone" | "email" | "linkedin";

export default function ActivityPage() {
  const { clientId, range } = useSession();
  const data = CLIENTS[clientId];
  const [channel, setChannel] = useState<Channel>("phone");
  const [callData, setCallData] = useState<{ metrics: CallMetrics | null; calls: Call[] }>({ metrics: null, calls: [] });

  const loadCalls = useCallback(async () => {
    try {
      const res = await fetch(`/api/calls?client=${clientId}&range=${range}`);
      const d = await res.json();
      setCallData({ metrics: d.metrics ?? null, calls: d.calls ?? [] });
    } catch {
      setCallData({ metrics: null, calls: [] });
    }
  }, [clientId, range]);

  useEffect(() => {
    loadCalls();
    const t = setInterval(loadCalls, 15000);
    return () => clearInterval(t);
  }, [loadCalls]);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Activity</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            Every touch across phone, email, and LinkedIn — in one place.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="mb-5">
        <LiveFeed clientId={clientId} />
      </div>

      <div className="mb-4 inline-flex rounded-[10px] border border-border bg-surface p-1">
        <Seg active={channel === "phone"} onClick={() => setChannel("phone")} icon={<Phone size={15} />}>Phone</Seg>
        <Seg active={channel === "email"} onClick={() => setChannel("email")} icon={<Mail size={15} />}>Email</Seg>
        <Seg active={channel === "linkedin"} onClick={() => setChannel("linkedin")} icon={<Contact size={15} />}>LinkedIn</Seg>
      </div>

      {channel === "phone" && <PhonePanel metrics={callData.metrics} calls={callData.calls} />}
      {channel === "email" && <EmailPanel data={data} />}
      {channel === "linkedin" && <LinkedInPanel data={data} />}

      <div className="mt-6">
        <ActiveLeads data={data} />
      </div>

      <UpdatedStamp when={data.lastUpdated} />
    </div>
  );
}

function Seg({ children, active, onClick, icon }: { children: React.ReactNode; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-[13.5px] transition-colors",
        active ? "bg-navy text-sidebar-ink-active" : "text-ink-2 hover:text-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ChannelEmpty({ tool, channel }: { tool: string; channel: string }) {
  return (
    <Card className="p-6 text-center">
      <p className="text-[15px] font-medium text-ink">No {channel} data yet</p>
      <p className="mx-auto mt-1 max-w-md text-[13.5px] text-ink-2">
        Connect {tool} in Settings → Connectors (paste Pando&apos;s webhook URL into {tool}) and {channel} activity streams in here.
      </p>
    </Card>
  );
}

function PhonePanel({ metrics, calls }: { metrics: CallMetrics | null; calls: Call[] }) {
  if (!metrics || metrics.dials === 0) {
    return <ChannelEmpty tool="Orum or Nooks" channel="phone" />;
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Dials" value={num(metrics.dials)} status="neutral" />
        <StatTile label="Connects" value={num(metrics.connects)} sub={`${metrics.dialToConnect}% dial-to-connect`} status="good" />
        <StatTile label="Conversations" value={num(metrics.conversations)} status="good" />
        <StatTile label="Meetings booked" value={num(metrics.meetings)} sub={`${metrics.connectToMeeting}% connect-to-meeting`} status="good" accent />
      </div>
      <Card className="mt-4 p-5">
        <SectionTitle icon={<Phone size={16} />} title="Recent calls" right={<span className="text-[12px] text-ink-3">{calls.length} shown</span>} />
        <div className="flex flex-col gap-2">
          {calls.slice(0, 15).map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-2 p-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13.5px] font-medium text-ink">{c.prospect}</span>
                  {c.company && <span className="truncate text-[12px] text-ink-3">· {c.company}</span>}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
                  <Pill tone={c.tone}>{c.disposition}</Pill>
                  <span>{c.rep}</span>
                  {c.objection && <span className="text-warn-ink">objection: {c.objection}</span>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {c.recording && (
                  <a href={c.recording} target="_blank" rel="noreferrer" className="text-gold hover:opacity-80" title="Recording"><PlayCircle size={16} /></a>
                )}
                {c.transcript && (
                  <a href={c.transcript} target="_blank" rel="noreferrer" className="text-gold hover:opacity-80" title="Transcript"><ExternalLink size={15} /></a>
                )}
                <span className="text-[11px] text-ink-3">{formatTime(c.at)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function EmailPanel({ data }: { data: (typeof CLIENTS)[string] }) {
  const e = data.email;
  if (e.sent === 0) return <ChannelEmpty tool="Smartlead or Instantly" channel="email" />;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Sent" value={num(e.sent)} status="neutral" />
        <StatTile label="Opens" value={num(e.opens)} sub={`${ratePct(e.opens, e.sent)} open rate`} status="good" />
        <StatTile label="Replies" value={num(e.replies)} sub={`${ratePct(e.replies, e.sent)} reply rate`} status="good" />
        <StatTile label="Positive replies" value={num(e.positiveReplies)} sub={`${ratePct(e.positiveReplies, e.replies)} of replies`} status="good" accent />
      </div>
      <RepliesList data={data} channel="email" />
    </>
  );
}

function LinkedInPanel({ data }: { data: (typeof CLIENTS)[string] }) {
  const l = data.linkedin;
  if (l.contacts === 0) return <ChannelEmpty tool="HeyReach or La Growth Machine" channel="LinkedIn" />;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Contacts" value={num(l.contacts)} status="neutral" />
        <StatTile label="Connects" value={num(l.connects)} sub={`${ratePct(l.connects, l.contacts)} accept rate`} status="good" />
        <StatTile label="Replies" value={num(l.replies)} sub={`${ratePct(l.replies, l.connects)} of connects`} status="good" />
        <StatTile label="Positive replies" value={num(l.positiveReplies)} sub={`${ratePct(l.positiveReplies, l.replies)} of replies`} status="good" accent />
      </div>
      <RepliesList data={data} channel="linkedin" />
    </>
  );
}

function RepliesList({ data, channel }: { data: (typeof CLIENTS)[string]; channel: "email" | "linkedin" }) {
  const replies = data.replies.filter((r) => r.channel === channel);
  if (!replies.length) return null;
  return (
    <Card className="mt-4 p-5">
      <SectionTitle title="What people said" />
      <div className="space-y-3">
        {replies.map((r) => (
          <div key={r.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="font-medium text-ink">{r.name}</span>
              <span className="text-ink-3">· {r.company}</span>
              <Pill tone={r.sentiment === "positive" ? "good" : r.sentiment === "negative" ? "bad" : "neutral"}>{r.sentiment}</Pill>
              <span className="ml-auto text-[12px] text-ink-3">{shortDate(r.date)}</span>
            </div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">&ldquo;{r.message}&rdquo;</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ActiveLeads({ data }: { data: (typeof CLIENTS)[string] }) {
  const a = data.activeLeads;
  const { pct: cap, status: capStatus } = leadCapacity(a.attempting, a.target);
  const total = a.statuses.reduce((s, x) => s + x.count, 0) || 1;

  if (a.attempting === 0 && a.unworked === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-[15px] font-medium text-ink">No active leads loaded</p>
        <p className="mx-auto mt-1 max-w-md text-[13.5px] text-ink-2">
          Once the lead list is loaded (Apollo → Active Contacts), the daily capacity view appears here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <SectionTitle icon={<Users size={16} />} title="Active leads & capacity" />
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile label="Attempting to contact" value={num(a.attempting)} sub="worked every day" status="good" accent />
        <StatTile label="Capacity vs target" value={`${cap}%`} sub={`target ${num(a.target)} active`} status={capStatus} />
        <StatTile label="Yet to be worked" value={num(a.unworked)} sub="in the tank" status="neutral" />
      </div>
      <p className="mb-2 text-[12px] text-ink-3">Lead status breakdown</p>
      <div className="space-y-2">
        {a.statuses.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-[13px] text-ink-2">{s.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-navy" style={{ width: `${Math.round((s.count / total) * 100)}%` }} />
            </div>
            <span className="tabular w-10 shrink-0 text-right text-[13px] text-ink">{num(s.count)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
