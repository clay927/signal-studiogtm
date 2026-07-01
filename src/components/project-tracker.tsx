import { Check } from "lucide-react";
import clsx from "clsx";
import type { Project } from "@/lib/types";
import { Card, Avatar } from "@/components/ui";
import { shortDate } from "@/lib/format";

export function ProjectTracker({ project }: { project: Project }) {
  const activeIdx = project.stages.findIndex((s) => s.state === "active");
  const currentLabel =
    activeIdx >= 0 ? project.stages[activeIdx].label : "Complete";

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-ink">{project.name}</p>
          <p className="text-[12px] text-ink-2">
            Now: <span className="text-gold">{currentLabel}</span> · due {shortDate(project.due)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar name={project.owner} tone="navy" />
        </div>
      </div>

      <div className="flex items-center">
        {project.stages.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[11px]",
                  s.state === "done" && "border-good bg-good text-white",
                  s.state === "active" && "border-gold bg-gold-soft text-gold",
                  s.state === "todo" && "border-border bg-surface-2 text-ink-3"
                )}
              >
                {s.state === "done" ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={clsx(
                  "whitespace-nowrap text-[11px]",
                  s.state === "todo" ? "text-ink-3" : "text-ink-2"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < project.stages.length - 1 && (
              <div
                className={clsx(
                  "mx-1 h-0.5 flex-1 -translate-y-2.5 rounded-full",
                  project.stages[i].state === "done" ? "bg-good" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
