import clsx from "clsx";
import { initials } from "@/lib/format";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={clsx(
        "rounded-[12px] border border-border bg-surface",
        className
      )}
    >
      {children}
    </Tag>
  );
}

type HealthStatus = "good" | "warn" | "bad" | "neutral";

const HEALTH_STYLES: Record<HealthStatus, string> = {
  good: "bg-good",
  warn: "bg-warn",
  bad: "bg-bad",
  neutral: "bg-ink-3",
};

export function HealthDot({ status }: { status: HealthStatus }) {
  return (
    <span
      className={clsx("inline-block h-2 w-2 shrink-0 rounded-full", HEALTH_STYLES[status])}
      aria-hidden
    />
  );
}

export function StatTile({
  label,
  value,
  sub,
  status = "neutral",
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  status?: HealthStatus;
  accent?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[13px] text-ink-2">
        <HealthDot status={status} />
        <span>{label}</span>
      </div>
      <div
        className={clsx(
          "serif tabular mt-1.5 text-[32px] leading-none",
          accent ? "text-gold" : "text-ink"
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-[12.5px] text-ink-2">{sub}</div>}
    </Card>
  );
}

const SENTIMENT: Record<string, string> = {
  good: "bg-good-soft text-good-ink",
  warn: "bg-warn-soft text-warn-ink",
  bad: "bg-bad-soft text-bad-ink",
  gold: "bg-gold-soft text-gold",
  neutral: "bg-surface-2 text-ink-2",
};

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof SENTIMENT;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px]",
        SENTIMENT[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, tone = "gold" }: { name: string; tone?: "gold" | "navy" }) {
  return (
    <div
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-medium",
        tone === "gold" ? "bg-gold-soft text-gold" : "bg-navy text-sidebar-ink-active"
      )}
    >
      {initials(name)}
    </div>
  );
}

export function SampleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gold-line bg-gold-soft px-2 py-0.5 text-[11px] text-gold">
      Sample data
    </span>
  );
}

export function SectionTitle({
  icon,
  title,
  right,
}: {
  icon?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-[15px] font-medium text-ink">
        {icon && <span className="text-gold">{icon}</span>}
        {title}
      </h2>
      {right}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-[22px] font-medium text-ink">{title}</h1>
      {subtitle && <p className="mt-0.5 text-[14px] text-ink-2">{subtitle}</p>}
    </div>
  );
}

export function UpdatedStamp({ when }: { when: string }) {
  return (
    <p className="mt-4 text-[11px] text-ink-3">
      Last updated {when} · source: admin-vetted workbooks
    </p>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <Card className="p-8 text-center">
      <p className="text-[15px] font-medium text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[14px] text-ink-2">{body}</p>
    </Card>
  );
}
