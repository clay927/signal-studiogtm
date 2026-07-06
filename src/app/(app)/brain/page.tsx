"use client";

import { useSession } from "@/lib/session";
import { CLIENTS } from "@/lib/data";
import { Card, SampleBadge, Pill, UpdatedStamp } from "@/components/ui";
import { BenchmarkBars } from "@/components/benchmark-bars";
import { UnitEconomicsCalc } from "@/components/unit-economics";
import { ratePct } from "@/lib/format";
import {
  Database,
  Activity,
  MessageSquare,
  Calculator,
  Video,
  FolderOpen,
  FileText,
  ExternalLink,
} from "lucide-react";

function DriveLink({ href, label }: { href: string; label: string }) {
  const disabled = !href || href === "#";
  if (disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1 text-[12.5px] text-ink-3">
        <FolderOpen size={14} /> {label} (linked at launch)
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1 text-[12.5px] text-gold hover:border-gold-line"
    >
      <FolderOpen size={14} /> {label} <ExternalLink size={12} />
    </a>
  );
}

function BrainSection({
  icon,
  title,
  subtitle,
  children,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-soft text-gold">
            {icon}
          </span>
          <div>
            <h2 className="text-[15px] font-medium text-ink">{title}</h2>
            <p className="text-[13px] text-ink-2">{subtitle}</p>
          </div>
        </div>
        {right}
      </div>
      {children}
    </Card>
  );
}

export default function BrainPage() {
  const { clientId } = useSession();
  const data = CLIENTS[clientId];
  const d = data.client.drive;
  const e = data.email;
  const p = data.phone;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Client brain</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            The living record of the engagement. Files stay in your Drive — Pando keeps the story.
          </p>
        </div>
        <SampleBadge />
      </div>

      <p className="mb-3 text-[12px] uppercase tracking-wide text-ink-3">Diagnostic</p>
      <div className="space-y-4">
        <BrainSection
          icon={<Database size={18} />}
          title="Data"
          subtitle="Contact & account data, plus TAM / SAM / SOM at a high level."
          right={<DriveLink href={d.data} label="01 — Data packet" />}
        >
          <p className="text-[13.5px] text-ink-2">
            High-level storage only — the heavy lifting stays in your data tools. Pando keeps the map and the supporting files a click away.
          </p>
        </BrainSection>

        <BrainSection
          icon={<Activity size={18} />}
          title="Channel fit"
          subtitle="Are the pipes working? Deliverability and dial-to-connect vs. industry."
          right={<DriveLink href={d.channel} label="02 — Channel outreach" />}
        >
          {data.benchmarks.length ? (
            <BenchmarkBars benchmarks={data.benchmarks} />
          ) : (
            <p className="text-[13.5px] text-ink-2">Health metrics populate once outreach begins.</p>
          )}
        </BrainSection>

        <BrainSection
          icon={<MessageSquare size={18} />}
          title="Message-market fit"
          subtitle="Scripts and messaging, and how well they're landing vs. benchmark."
          right={<DriveLink href={d.messaging} label="03 — Scripting & messaging" />}
        >
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            <MMFStat label="Email reply rate" value={ratePct(e.replies, e.sent)} bmk="1.8%" />
            <MMFStat label="Positive reply rate" value={ratePct(e.positiveReplies, e.replies)} bmk="20%" />
            <MMFStat label="Convo-to-meeting" value={ratePct(p.meetings, p.conversations)} bmk="15%" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1 text-[12.5px] text-ink-2">
              <FileText size={14} className="text-ink-3" /> Cold call script v2
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1 text-[12.5px] text-ink-2">
              <FileText size={14} className="text-ink-3" /> Email sequence — med spa
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[8px] border border-border px-2.5 py-1 text-[12.5px] text-ink-2">
              <FileText size={14} className="text-ink-3" /> LinkedIn opener
            </span>
          </div>
        </BrainSection>

        <BrainSection
          icon={<Calculator size={18} />}
          title="Sales unit economics"
          subtitle="Is the program profitable? Model the SDR motion with your real numbers."
        >
          <UnitEconomicsCalc base={data.unitEconomics} />
        </BrainSection>
      </div>

      <p className="mb-3 mt-6 text-[12px] uppercase tracking-wide text-ink-3">Strategy meetings</p>
      <BrainSection
        icon={<Video size={18} />}
        title="Recordings & recaps"
        subtitle="Fireflies recordings and recap emails from every strategy session."
        right={<DriveLink href={d.working} label="05 — Working docs" />}
      >
        <div className="space-y-2.5">
          {[
            { t: "Kickoff & ICP alignment", date: "May 14, 2026" },
            { t: "Week 3 strategy review", date: "Jun 4, 2026" },
            { t: "Messaging iteration & benchmarks", date: "Jun 24, 2026" },
          ].map((m) => (
            <div key={m.t} className="flex items-center gap-3 rounded-[10px] border border-border bg-surface-2 p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-gold">
                <Video size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink">{m.t}</p>
                <p className="text-[12px] text-ink-3">{m.date} · Fireflies recap</p>
              </div>
              <Pill tone="gold">Recap</Pill>
            </div>
          ))}
        </div>
      </BrainSection>

      <UpdatedStamp when={data.lastUpdated} />
    </div>
  );
}

function MMFStat({ label, value, bmk }: { label: string; value: string; bmk: string }) {
  return (
    <div className="rounded-[10px] bg-surface-2 p-3">
      <div className="text-[12px] text-ink-2">{label}</div>
      <div className="tabular mt-0.5 text-[18px] text-ink">{value}</div>
      <div className="text-[11px] text-ink-3">benchmark {bmk}</div>
    </div>
  );
}
