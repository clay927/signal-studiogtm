"use client";

import { ChevronDown, Calendar } from "lucide-react";
import { useSession, RANGE_LABELS, type DateRange } from "@/lib/session";
import { CLIENTS } from "@/lib/data";
import { Menu, MenuItem, MenuLabel } from "@/components/menu";
import { HealthDot } from "@/components/ui";
import type { ClientStatus } from "@/lib/types";

const STATUS_DOT: Record<ClientStatus, "good" | "warn" | "bad" | "neutral"> = {
  onboarding: "neutral",
  active: "good",
  paused: "warn",
  inactive: "neutral",
};

const RANGES: DateRange[] = ["today", "this_week", "last_week", "this_month", "custom"];

export function Topbar() {
  const { clientId, setClientId, clients, range, setRange } = useSession();
  const current = CLIENTS[clientId]?.client;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-page/90 px-6 py-3 backdrop-blur">
      <Menu
        width={240}
        trigger={() => (
          <div className="flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-[14px] text-ink hover:border-border-strong">
            {current && <HealthDot status={STATUS_DOT[current.status]} />}
            <span className="font-medium">{current?.name ?? "Select client"}</span>
            <ChevronDown size={15} className="text-ink-3" />
          </div>
        )}
      >
        {(close) => (
          <>
            <MenuLabel>Client</MenuLabel>
            {clients.map((id) => {
              const c = CLIENTS[id].client;
              return (
                <MenuItem
                  key={id}
                  active={id === clientId}
                  onClick={() => {
                    setClientId(id);
                    close();
                  }}
                  icon={<HealthDot status={STATUS_DOT[c.status]} />}
                >
                  {c.name}
                </MenuItem>
              );
            })}
          </>
        )}
      </Menu>

      <div className="flex items-center gap-2">
        <Menu
          align="right"
          width={180}
          trigger={() => (
            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-[13.5px] text-ink-2 hover:border-border-strong">
              <Calendar size={15} className="text-ink-3" />
              <span>{RANGE_LABELS[range]}</span>
              <ChevronDown size={14} className="text-ink-3" />
            </div>
          )}
        >
          {(close) => (
            <>
              {RANGES.map((r) => (
                <MenuItem
                  key={r}
                  active={r === range}
                  onClick={() => {
                    setRange(r);
                    close();
                  }}
                >
                  {RANGE_LABELS[r]}
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
      </div>
    </header>
  );
}

export { STATUS_DOT };
