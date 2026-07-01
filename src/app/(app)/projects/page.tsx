"use client";

import { useState } from "react";
import { useSession } from "@/lib/session";
import { CLIENTS } from "@/lib/data";
import { SampleBadge, SectionTitle, UpdatedStamp, EmptyState } from "@/components/ui";
import { ProjectTracker } from "@/components/project-tracker";
import { ListChecks } from "lucide-react";
import clsx from "clsx";

export default function ProjectsPage() {
  const { clientId, clients, user } = useSession();
  const isOwner = user.clientAccess === "all";
  const [scope, setScope] = useState<"client" | "all">("client");

  const showAll = isOwner && scope === "all";
  const ids = showAll ? clients : [clientId];

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Projects</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            Where every project is in its lifecycle, and who owns it.
          </p>
        </div>
        <SampleBadge />
      </div>

      {isOwner && (
        <div className="mb-4 inline-flex rounded-[10px] border border-border bg-surface p-1">
          <button
            onClick={() => setScope("client")}
            className={clsx("rounded-[7px] px-3 py-1.5 text-[13.5px]", scope === "client" ? "bg-navy text-sidebar-ink-active" : "text-ink-2 hover:text-ink")}
          >
            This client
          </button>
          <button
            onClick={() => setScope("all")}
            className={clsx("rounded-[7px] px-3 py-1.5 text-[13.5px]", scope === "all" ? "bg-navy text-sidebar-ink-active" : "text-ink-2 hover:text-ink")}
          >
            All clients
          </button>
        </div>
      )}

      <div className="space-y-6">
        {ids.map((id) => {
          const data = CLIENTS[id];
          return (
            <div key={id}>
              {showAll && (
                <SectionTitle
                  icon={<ListChecks size={16} />}
                  title={data.client.name}
                  right={<span className="text-[12px] text-ink-3">Owner: {data.client.accountOwner}</span>}
                />
              )}
              <div className="space-y-3">
                {data.projects.length ? (
                  data.projects.map((p) => <ProjectTracker key={p.id} project={p} />)
                ) : (
                  <EmptyState title="No open projects" body="Projects will appear here as StudioGTM builds out this engagement." />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <UpdatedStamp when={CLIENTS[clientId].lastUpdated} />
    </div>
  );
}
