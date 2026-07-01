"use client";

import { useState } from "react";
import { useSession } from "@/lib/session";
import { useData } from "@/lib/store";
import { StatTile, SampleBadge, Card, SectionTitle, UpdatedStamp, Pill, EmptyState } from "@/components/ui";
import { MeetingDetail, STAGE_LABEL } from "@/components/meeting-detail";
import { money, num, pct, shortDate } from "@/lib/format";
import { holdStatus } from "@/lib/metrics";
import type { Meeting } from "@/lib/types";
import { Trophy } from "lucide-react";
import clsx from "clsx";

export default function ResultsPage() {
  const { clientId } = useSession();
  const { getClientData } = useData();
  const data = getClientData(clientId);
  const r = data.results;
  const [campaign, setCampaign] = useState<string>("all");
  const [selected, setSelected] = useState<Meeting | null>(null);

  const filtered =
    campaign === "all" ? data.meetings : data.meetings.filter((m) => m.campaign === campaign);

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Results</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            The scoreboard — and every account behind the numbers.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="Closed won" value={money(r.closedWon)} sub={`${r.closedWonDelta >= 0 ? "+" : ""}${money(r.closedWonDelta)}`} status="good" accent />
        <StatTile label="New pipeline" value={money(r.newPipeline)} sub={`${r.pipelineOpps} opps`} status="good" />
        <StatTile label="Meetings held" value={num(r.meetingsHeld)} sub={`${r.meetingsHeldDelta >= 0 ? "+" : ""}${r.meetingsHeldDelta} vs last mo`} status="good" />
        <StatTile label="Scheduled" value={num(r.meetingsScheduled)} sub="upcoming" status="neutral" />
        <StatTile label="Hold rate" value={pct(r.holdRate)} sub="bmk 82%" status={holdStatus(r.holdRate)} />
      </div>

      <Card className="p-5">
        <SectionTitle
          icon={<Trophy size={16} />}
          title="Pipeline"
          right={
            <div className="flex items-center gap-1">
              <FilterChip active={campaign === "all"} onClick={() => setCampaign("all")}>
                All campaigns
              </FilterChip>
              {data.campaigns.map((c) => (
                <FilterChip key={c.id} active={campaign === c.name} onClick={() => setCampaign(c.name)}>
                  {c.name}
                </FilterChip>
              ))}
            </div>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState title="No pipeline yet" body="Meetings booked will appear here the moment they're logged in the Results workbook." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-left text-[12px] text-ink-3">
                  <th className="py-2 pr-3 font-normal">Account</th>
                  <th className="py-2 pr-3 font-normal">Contact</th>
                  <th className="py-2 pr-3 font-normal">Stage</th>
                  <th className="py-2 pr-3 font-normal">Meeting</th>
                  <th className="py-2 pr-3 font-normal">Rep</th>
                  <th className="py-2 pl-3 text-right font-normal">Value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const stage = STAGE_LABEL[m.stage];
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelected(m)}
                      className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-surface-2"
                    >
                      <td className="py-2.5 pr-3 text-ink">{m.company}</td>
                      <td className="py-2.5 pr-3 text-ink-2">{m.name}</td>
                      <td className="py-2.5 pr-3"><Pill tone={stage.tone}>{stage.label}</Pill></td>
                      <td className="py-2.5 pr-3 text-ink-2">{shortDate(m.dateScheduled)}</td>
                      <td className="py-2.5 pr-3 text-ink-2">{m.rep}</td>
                      <td className="tabular py-2.5 pl-3 text-right text-ink">{money(m.value)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <UpdatedStamp when={data.lastUpdated} />
      </Card>

      {selected && <MeetingDetail meeting={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-full px-3 py-1 text-[12px] transition-colors",
        active ? "bg-navy text-sidebar-ink-active" : "border border-border text-ink-2 hover:border-border-strong"
      )}
    >
      {children}
    </button>
  );
}
