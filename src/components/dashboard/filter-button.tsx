"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { CLIENT_ROSTER } from "@/lib/historical";
import { HealthDot } from "@/components/ui";

export function FilterButton({
  available,
  selected,
  onChange,
}: {
  available: string[]; // client ids this user can see
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const roster = CLIENT_ROSTER.filter((c) => available.includes(c.id));
  const activeIds = roster.filter((c) => c.status === "active").map((c) => c.id);
  const allIds = roster.map((c) => c.id);
  const isAll = selected.length === allIds.length;
  const isActiveOnly = !isAll && selected.length === activeIds.length && activeIds.every((id) => selected.includes(id));

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    if (next.length) onChange(next); // never allow an empty scope
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-[13.5px] text-ink hover:border-border-strong"
      >
        <SlidersHorizontal size={15} className="text-ink-3" />
        Filters
        <span className="rounded-full bg-gold px-1.5 text-[11px] font-medium text-navy-deep">{selected.length}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[250px] rounded-[12px] border border-border bg-surface p-3 shadow-lg">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-3">Clients</p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => onChange(allIds)}
              className={clsx(
                "rounded-full border px-2.5 py-0.5 text-[12px]",
                isAll ? "border-navy bg-navy text-sidebar-ink-active" : "border-border text-ink-2 hover:border-border-strong"
              )}
            >
              All ({allIds.length})
            </button>
            <button
              onClick={() => onChange(activeIds)}
              className={clsx(
                "rounded-full border px-2.5 py-0.5 text-[12px]",
                isActiveOnly ? "border-navy bg-navy text-sidebar-ink-active" : "border-border text-ink-2 hover:border-border-strong"
              )}
            >
              Active only ({activeIds.length})
            </button>
          </div>
          <div className="space-y-0.5">
            {roster.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-[8px] px-1.5 py-1 text-[13px] text-ink hover:bg-surface-2">
                <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />
                <HealthDot status={c.status === "active" ? "good" : "neutral"} />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
