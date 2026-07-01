import type { Benchmark } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui";
import { Gauge } from "lucide-react";
import clsx from "clsx";

const BAR: Record<Benchmark["status"], string> = {
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
};

const TEXT: Record<Benchmark["status"], string> = {
  good: "text-good-ink",
  warn: "text-warn-ink",
  bad: "text-bad-ink",
};

function fill(b: Benchmark): number {
  const ratio = b.higherIsBetter ? b.value / b.benchmark : b.benchmark / b.value;
  return Math.max(8, Math.min(100, ratio * 70));
}

export function BenchmarkBars({ benchmarks }: { benchmarks: Benchmark[] }) {
  return (
    <Card className="p-5">
      <SectionTitle icon={<Gauge size={16} />} title="Are the pipes healthy?" />
      <div className="flex flex-col gap-4">
        {benchmarks.map((b) => (
          <div key={b.label}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-ink-2">{b.label}</span>
              <span className={clsx("tabular font-medium", TEXT[b.status])}>
                {b.value}
                {b.unit} <span className="text-ink-3">· bmk {b.benchmark}{b.unit}</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div className={clsx("h-full rounded-full", BAR[b.status])} style={{ width: `${fill(b)}%` }} />
            </div>
            <p className="mt-1 text-[12px] text-ink-3">{b.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
