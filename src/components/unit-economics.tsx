"use client";

import { useState } from "react";
import type { UnitEconomics } from "@/lib/types";
import { Card } from "@/components/ui";
import { money } from "@/lib/format";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[13px]">
        <span className="text-ink-2">{label}</span>
        <span className="tabular font-medium text-ink">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--gold)]"
      />
    </div>
  );
}

function Output({ label, value, big, accent }: { label: string; value: string; big?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-[10px] bg-surface-2 p-3">
      <div className="text-[12px] text-ink-2">{label}</div>
      <div className={`tabular mt-0.5 ${big ? "serif text-[26px]" : "text-[18px]"} ${accent ? "text-gold" : "text-ink"}`}>
        {value}
      </div>
    </div>
  );
}

export function UnitEconomicsCalc({ base }: { base: UnitEconomics }) {
  const [meetings, setMeetings] = useState(base.meetingsPerMonth);
  const [showRate, setShowRate] = useState(base.showRate);
  const [oppToWin, setOppToWin] = useState(base.oppToWin);
  const [deal, setDeal] = useState(base.avgDealValue);
  const [cost, setCost] = useState(base.programCost);

  const held = meetings * (showRate / 100);
  const wins = held * (oppToWin / 100);
  const monthlyRevenue = wins * deal;
  const roi = cost > 0 ? monthlyRevenue / cost : 0;
  const costPerMeeting = held > 0 ? cost / held : 0;
  const annual = monthlyRevenue * 12;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <p className="mb-4 text-[13px] text-ink-2">
          Adjust the inputs to model what a dedicated SDR motion produces. Defaults reflect this account&apos;s actual data.
        </p>
        <div className="space-y-4">
          <Slider label="Meetings booked / month" value={meetings} min={0} max={60} step={1} onChange={setMeetings} format={(v) => `${v}`} />
          <Slider label="Show (hold) rate" value={showRate} min={30} max={100} step={1} onChange={setShowRate} format={(v) => `${v}%`} />
          <Slider label="Opportunity-to-win rate" value={oppToWin} min={5} max={60} step={1} onChange={setOppToWin} format={(v) => `${v}%`} />
          <Slider label="Average deal value" value={deal} min={2000} max={100000} step={1000} onChange={setDeal} format={(v) => money(v)} />
          <Slider label="Program cost / month" value={cost} min={2000} max={20000} step={250} onChange={setCost} format={(v) => money(v)} />
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 rounded-[12px] bg-navy p-4 text-sidebar-ink-active">
          <div className="text-[12px] text-sidebar-ink">Return on program spend</div>
          <div className="serif tabular mt-1 text-[38px] leading-none text-[var(--sidebar-ink-active)]">
            {roi.toFixed(1)}×
          </div>
          <div className="mt-1 text-[12.5px] text-sidebar-ink">
            {money(monthlyRevenue)} won for {money(cost)} spend / month
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Output label="Meetings held / mo" value={held.toFixed(1)} />
          <Output label="New customers / mo" value={wins.toFixed(1)} />
          <Output label="Cost per meeting held" value={money(costPerMeeting)} />
          <Output label="Monthly revenue" value={money(monthlyRevenue)} accent />
          <div className="col-span-2">
            <Output label="Projected annual revenue" value={money(annual)} big accent />
          </div>
        </div>
      </Card>
    </div>
  );
}
