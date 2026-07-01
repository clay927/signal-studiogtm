"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function Menu({
  trigger,
  children,
  align = "left",
  width = 220,
  up = false,
}: {
  trigger: (open: boolean) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  width?: number;
  up?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="block w-full text-left"
      >
        {trigger(open)}
      </button>
      {open && (
        <div
          style={{ width }}
          className={clsx(
            "absolute z-50 overflow-hidden rounded-[12px] border border-border bg-surface p-1 shadow-lg",
            align === "right" ? "right-0" : "left-0",
            up ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  active,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13.5px] transition-colors",
        active ? "bg-gold-soft text-gold" : "text-ink hover:bg-surface-2"
      )}
    >
      {icon && <span className="text-ink-3">{icon}</span>}
      <span className="flex-1">{children}</span>
      {active && <span className="text-gold">✓</span>}
    </button>
  );
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-1 pt-2 text-[11px] uppercase tracking-wide text-ink-3">
      {children}
    </div>
  );
}
