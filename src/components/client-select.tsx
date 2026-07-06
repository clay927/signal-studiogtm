"use client";

import { useSession } from "@/lib/session";
import { clientName } from "@/lib/clients";

/** Small client picker for admin surfaces (Settings connectors, Import) now
 *  that client scoping lives in the dashboard filters, not a global topbar. */
export function ClientSelect() {
  const { clientId, setClientId, clients } = useSession();
  return (
    <select
      value={clientId}
      onChange={(e) => setClientId(e.target.value)}
      className="rounded-[8px] border border-border bg-surface px-2 py-1 text-[12.5px] text-ink"
    >
      {clients.map((id) => (
        <option key={id} value={id}>
          {clientName(id)}
        </option>
      ))}
    </select>
  );
}
