"use client";

import { useSession } from "@/lib/session";
import { useData } from "@/lib/store";
import { StatTile, SampleBadge, SectionTitle, UpdatedStamp, Card } from "@/components/ui";
import { WinsFeed } from "@/components/wins-feed";
import { BenchmarkBars } from "@/components/benchmark-bars";
import { ProjectTracker } from "@/components/project-tracker";
import { money, num, pct } from "@/lib/format";
import { holdStatus } from "@/lib/metrics";
import { ListChecks, Rocket } from "lucide-react";

export default function HomePage() {
  const { clientId } = useSession();
  const { getClientData } = useData();
  const data = getClientData(clientId);
  const c = data.client;
  const r = data.results;
  const isLaunching = c.status === "onboarding" && r.meetingsHeld === 0;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Good morning, {c.name}</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            Your team is live in the market. Here&apos;s what&apos;s moving.
          </p>
        </div>
        <SampleBadge />
      </div>

      {isLaunching ? (
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-gold">
              <Rocket size={20} />
            </span>
            <div>
              <p className="text-[16px] font-medium text-ink">Launching next week</p>
              <p className="mt-1 max-w-xl text-[14px] text-ink-2">{data.insight}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <SectionTitle icon={<ListChecks size={16} />} title="Onboarding progress" />
            {data.projects.map((p) => (
              <ProjectTracker key={p.id} project={p} />
            ))}
          </div>
          <UpdatedStamp when={data.lastUpdated} />
        </Card>
      ) : (
        <>
          <Card className="mb-5 p-5">
            <p className="text-[12px] uppercase tracking-wide text-gold">The story this month</p>
            <p className="serif mt-1.5 text-[22px] leading-snug text-ink">{data.insight}</p>
          </Card>

          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile
              label="Meetings held"
              value={num(r.meetingsHeld)}
              sub={`${r.meetingsHeldDelta >= 0 ? "+" : ""}${r.meetingsHeldDelta} vs last month`}
              status="good"
            />
            <StatTile
              label="New pipeline"
              value={money(r.newPipeline)}
              sub={`${r.pipelineOpps} opportunities`}
              status="good"
              accent
            />
            <StatTile
              label="Meetings scheduled"
              value={num(r.meetingsScheduled)}
              sub="upcoming"
              status="neutral"
            />
            <StatTile
              label="Hold rate"
              value={pct(r.holdRate)}
              sub="benchmark 82%"
              status={holdStatus(r.holdRate)}
            />
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
            <WinsFeed meetings={data.meetings} />
            <BenchmarkBars benchmarks={data.benchmarks} />
          </div>

          <div>
            <SectionTitle
              icon={<ListChecks size={16} />}
              title="Open projects"
              right={
                <span className="text-[12px] text-ink-3">
                  {data.projects.length} in flight
                </span>
              }
            />
            <div className="space-y-3">
              {data.projects.length ? (
                data.projects.map((p) => <ProjectTracker key={p.id} project={p} />)
              ) : (
                <Card className="p-4">
                  <p className="text-[13px] text-ink-2">No open projects this period.</p>
                </Card>
              )}
            </div>
          </div>

          <UpdatedStamp when={data.lastUpdated} />
        </>
      )}
    </div>
  );
}
