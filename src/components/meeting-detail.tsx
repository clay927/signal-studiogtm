"use client";

import { Star, X, Phone, Mail, Contact, ExternalLink } from "lucide-react";
import clsx from "clsx";
import type { Meeting } from "@/lib/types";
import { Avatar, Pill } from "@/components/ui";
import { shortDate } from "@/lib/format";

export const STAGE_LABEL: Record<
  Meeting["stage"],
  { label: string; tone: "good" | "warn" | "neutral" | "gold" }
> = {
  won: { label: "Closed won", tone: "good" },
  held: { label: "Meeting held", tone: "good" },
  demo_set: { label: "Demo set", tone: "gold" },
  follow_up: { label: "Follow-up set", tone: "warn" },
  nurture: { label: "Nurture", tone: "neutral" },
  no_show: { label: "No-show", tone: "neutral" },
};

export function MeetingDetail({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  const stage = STAGE_LABEL[meeting.stage];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-[16px] border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <Avatar name={meeting.name} />
            <div>
              <p className="text-[16px] font-medium text-ink">{meeting.name}</p>
              <p className="text-[13px] text-ink-2">
                {meeting.title ? `${meeting.title} · ` : ""}
                {meeting.company}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-[8px] p-1 text-ink-3 hover:bg-surface-2" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-ink-2">
            <Pill tone={stage.tone}>{stage.label}</Pill>
            <span>{meeting.campaign}</span>
            <span>·</span>
            <span>{shortDate(meeting.dateScheduled)}</span>
            <span>·</span>
            <span>by {meeting.rep}</span>
          </div>

          <div className="rounded-[12px] bg-surface-2 p-3">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-ink-3">Call summary</p>
            <p className="text-[14px] leading-relaxed text-ink">{meeting.note}</p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2">
            {meeting.phone && (
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-ink-3" /> {meeting.phone}</span>
            )}
            {meeting.email && (
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-ink-3" /> {meeting.email}</span>
            )}
            {meeting.linkedin && (
              <a href={meeting.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-gold hover:underline">
                <Contact size={14} /> LinkedIn
              </a>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              className={clsx(
                "flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[13px]",
                meeting.featured ? "text-gold" : "text-ink-2 hover:border-border-strong"
              )}
            >
              <Star size={14} fill={meeting.featured ? "currentColor" : "none"} />
              {meeting.featured ? "Featured" : "Feature this win"}
            </button>
            {meeting.transcript && (
              <a
                href={meeting.transcript}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-[8px] bg-navy px-3 py-1.5 text-[13px] text-sidebar-ink-active hover:opacity-90"
              >
                <ExternalLink size={14} /> Open transcript
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
