"use client";

import { monthLabel, type MonthPoint } from "@/lib/history";
import { num } from "@/lib/format";

/** Clear, static grouped bars: meetings scheduled (muted) vs held (navy).
 *  Labeled axes + hover tooltip with exact counts per month. */
export function MonthBars({ points }: { points: MonthPoint[] }) {
  const max = Math.max(1, ...points.map((p) => Math.max(p.held, p.scheduled)));
  const h = (v: number) => `${Math.max(v > 0 ? 4 : 0, Math.round((v / max) * 100))}%`;
  const years = [...new Set(points.map((p) => p.month.slice(0, 4)))].join("–");

  return (
    <div className="flex gap-3">
      {/* Y axis */}
      <div className="flex flex-col items-end">
        <div className="flex h-[150px] flex-col justify-between text-right text-[10.5px] tabular text-ink-3">
          <span>{num(max)}</span>
          <span>{num(Math.round(max / 2))}</span>
          <span>0</span>
        </div>
        <span className="mt-1 text-[10.5px] text-ink-3">meetings</span>
      </div>

      <div className="min-w-0 flex-1">
        {/* Plot area with gridlines */}
        <div className="relative h-[150px] border-b border-border">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-border/70" />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-border/70" />
          <div className="flex h-full items-end gap-4 px-1">
            {points.map((p) => (
              <div key={p.month} className="group relative flex h-full flex-1 items-end justify-center gap-1">
                {/* Hover tooltip */}
                <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-navy px-2.5 py-1.5 text-[11.5px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-white dark:text-navy">
                  <span className="font-medium">{monthLabel(p.month)}</span> · {num(p.scheduled)} scheduled ·{" "}
                  {num(p.held)} held
                </div>
                <div
                  className="w-full max-w-[26px] rounded-t-[3px] bg-navy/35 transition-opacity group-hover:opacity-80 dark:bg-white/15"
                  style={{ height: h(p.scheduled) }}
                />
                <div
                  className="w-full max-w-[26px] rounded-t-[3px] bg-navy transition-opacity group-hover:opacity-80 dark:bg-gold"
                  style={{ height: h(p.held) }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* X axis */}
        <div className="flex gap-4 px-1 pt-1.5">
          {points.map((p) => (
            <span key={p.month} className="flex-1 text-center text-[11px] text-ink-3">
              {monthLabel(p.month)}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4 text-[11.5px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-[2px] bg-navy/35 dark:bg-white/15" /> Scheduled
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-[2px] bg-navy dark:bg-gold" /> Held
            </span>
          </div>
          <span className="text-[10.5px] text-ink-3">month · {years}</span>
        </div>
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
          className="flex-1 rounded-[1px] bg-navy/40 dark:bg-white/25 [&:last-child]:bg-gold"
          style={{ height: `${Math.max(v > 0 ? 12 : 6, Math.round((v / max) * 100))}%` }}
        />
      ))}
    </span>
  );
}
