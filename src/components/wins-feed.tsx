"use client";

import { useState } from "react";
import { Star, ArrowRight, PartyPopper } from "lucide-react";
import type { Meeting } from "@/lib/types";
import { Card, SectionTitle, Avatar, Pill } from "@/components/ui";
import { shortDate } from "@/lib/format";
import { MeetingDetail, STAGE_LABEL } from "@/components/meeting-detail";

export function WinsFeed({ meetings }: { meetings: Meeting[] }) {
  const [selected, setSelected] = useState<Meeting | null>(null);

  const wins = [...meetings]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 5);

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<PartyPopper size={16} />}
        title="Recent wins"
        right={<span className="text-[12px] text-ink-3">{wins.length} conversations worth reading</span>}
      />
      <div className="flex flex-col gap-2.5">
        {wins.map((m) => {
          const stage = STAGE_LABEL[m.stage];
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="group flex items-start gap-3 rounded-[12px] border border-border bg-surface-2 p-3 text-left transition-colors hover:border-gold-line"
            >
              <Avatar name={m.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-ink">
                    {m.name} · {m.company}
                  </p>
                  {m.featured && <Star size={13} className="shrink-0 text-gold" fill="currentColor" />}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-2">
                  <Pill tone={stage.tone}>{stage.label}</Pill>
                  <span>{shortDate(m.dateScheduled)} · by {m.rep}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{m.note}</p>
              </div>
              <ArrowRight size={16} className="mt-1 shrink-0 text-ink-3 transition-colors group-hover:text-gold" />
            </button>
          );
        })}
      </div>

      {selected && <MeetingDetail meeting={selected} onClose={() => setSelected(null)} />}
    </Card>
  );
}
