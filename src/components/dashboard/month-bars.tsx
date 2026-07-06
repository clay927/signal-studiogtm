"use client";

import { monthLabel, type MonthPoint } from "@/lib/history";

/** Clear, static grouped bars: meetings scheduled (muted) vs held (navy). */
export function MonthBars({ points }: { points: MonthPoint[] }) {
  const max = Math.max(1, ...points.map((p) => Math.max(p.held, p.scheduled)));
  const h = (v: number) => `${Math.max(v > 0 ? 4 : 0, Math.round((v / max) * 100))}%`;

  return (
    <div>
      <div className="flex h-[130px] items-end gap-4 border-b border-border px-1">
        {points.map((p) => (
          <div key={p.month} className="flex h-full flex-1 items-end justify-center gap-1">
            <div
              className="w-full max-w-[26px] rounded-t-[3px] bg-navy/15 dark:bg-white/15"
              style={{ height: h(p.scheduled) }}
              title={`${monthLabel(p.month)}: ${p.scheduled} scheduled`}
            />
            <div
              className="w-full max-w-[26px] rounded-t-[3px] bg-navy dark:bg-gold"
              style={{ height: h(p.held) }}
              title={`${monthLabel(p.month)}: ${p.held} held`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 px-1 pt-1.5">
        {points.map((p) => (
          <span key={p.month} className="flex-1 text-center text-[11px] text-ink-3">
            {monthLabel(p.month)}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11.5px] text-ink-2">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-[2px] bg-navy/15 dark:bg-white/15" /> Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-[2px] bg-navy dark:bg-gold" /> Held
        </span>
      </div>
    </div>
  );
}

/** Tiny per-client trend sparkline (meetings held by month). */
export function Spark({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <span className="inline-flex h-[18px] w-[64px] items-end gap-[2px]" aria-hidden>
      {values.map((v, i) => (
        <i
          key={i}
          className="flex-1 rounded-[1px] bg-navy/25 dark:bg-white/25 [&:last-child]:bg-gold"
          style={{ height: `${Math.max(v > 0 ? 12 : 6, Math.round((v / max) * 100))}%` }}
        />
      ))}
    </span>
  );
}
