"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { CLIENT_ORDER } from "./clients";
import type { Role, User } from "./types";

export type DateRange = "today" | "this_week" | "last_week" | "this_month" | "custom";

interface SessionState {
  user: User;
  role: Role;
  clientId: string;
  setClientId: (id: string) => void;
  clients: string[];
  range: DateRange;
  setRange: (r: DateRange) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionState | null>(null);
const PUBLIC_PATHS = ["/login", "/set-password"];

function accessible(user: User): string[] {
  if (user.clientAccess === "all") return CLIENT_ORDER;
  return CLIENT_ORDER.filter((id) => (user.clientAccess as string[]).includes(id));
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string>("");
  const [range, setRange] = useState<DateRange>("this_month");

  useEffect(() => {
    const savedRange = localStorage.getItem("signal.range") as DateRange | null;
    if (savedRange) setRange(savedRange);
  }, []);

  useEffect(() => {
    if (isPublic) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.user) {
          const u = d.user;
          const isOwner = u.role === "owner";
          setUser({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            clientAccess: isOwner ? "all" : u.clientAccess ?? [],
            seesBilling: u.role === "owner" || u.role === "client",
            avatar: u.avatar || "",
          });
        } else {
          window.location.assign("/login");
        }
      })
      .catch(() => window.location.assign("/login"))
      .finally(() => setLoading(false));
  }, [isPublic]);

  const clients = useMemo(() => (user ? accessible(user) : []), [user]);

  useEffect(() => {
    if (clients.length && !clients.includes(clientId)) setClientId(clients[0]);
  }, [clients, clientId]);

  const setRangePersist = (r: DateRange) => {
    setRange(r);
    localStorage.setItem("signal.range", r);
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => window.location.assign("/login"));
  };

  // Public auth pages render without a session.
  if (isPublic) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-page text-[14px] text-ink-2">Loading Pando…</div>
    );
  }

  // Always expose a VALID client id (never "" before the effect runs), so pages
  // never read data for a missing client and crash right after login.
  const activeClientId = clientId && clients.includes(clientId) ? clientId : clients[0] ?? "";

  const value: SessionState = {
    user,
    role: user.role,
    clientId: activeClientId,
    setClientId,
    clients,
    range,
    setRange: setRangePersist,
    logout,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "StudioGTM owner",
  sdr: "SDR",
  client: "Client founder",
  client_team: "Client team",
};

export const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  this_week: "This week",
  last_week: "Last week",
  this_month: "This month",
  custom: "Custom",
};
