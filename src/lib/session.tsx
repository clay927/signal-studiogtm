"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { USERS, accessibleClientIds } from "./data";
import type { Role, User } from "./types";

export type DateRange = "today" | "this_week" | "last_week" | "this_month" | "custom";

interface SessionState {
  user: User;
  role: Role;
  setRole: (r: Role) => void;
  clientId: string;
  setClientId: (id: string) => void;
  clients: string[];
  range: DateRange;
  setRange: (r: DateRange) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("owner");
  const [clientId, setClientId] = useState<string>("yeticonnect");
  const [range, setRange] = useState<DateRange>("this_month");

  useEffect(() => {
    const savedRole = localStorage.getItem("signal.role") as Role | null;
    if (savedRole && USERS[savedRole]) setRoleState(savedRole);
    const savedRange = localStorage.getItem("signal.range") as DateRange | null;
    if (savedRange) setRange(savedRange);
  }, []);

  const user = USERS[role];
  const clients = useMemo(() => accessibleClientIds(user), [user]);

  useEffect(() => {
    if (!clients.includes(clientId)) setClientId(clients[0]);
  }, [clients, clientId]);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("signal.role", r);
  };

  const setRangePersist = (r: DateRange) => {
    setRange(r);
    localStorage.setItem("signal.range", r);
  };

  const value: SessionState = {
    user,
    role,
    setRole,
    clientId,
    setClientId,
    clients,
    range,
    setRange: setRangePersist,
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
