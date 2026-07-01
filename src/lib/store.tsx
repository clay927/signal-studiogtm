"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CLIENTS, CLIENT_ORDER } from "./data";
import { deriveResults } from "./metrics";
import type { ClientData, Meeting } from "./types";

// Client-side data store. Sample data is the default; an import overrides a
// client's meetings and recomputes its Results scoreboard from those rows.
// Persisted to localStorage for now (no database) — sheets-only, per Clay.

export interface ClientImport {
  meetings: Meeting[];
  importedAt: string;
  fileName: string;
  stats: {
    totalRows: number;
    imported: number;
    withValue: number;
    withStage: number;
    withAttendance: number;
  };
}

type ImportMap = Record<string, ClientImport>;

interface DataState {
  imports: ImportMap;
  getClientData: (clientId: string) => ClientData;
  setImport: (clientId: string, imp: ClientImport) => void;
  clearImport: (clientId: string) => void;
}

const DataContext = createContext<DataState | null>(null);
const STORAGE_KEY = "signal.imports.v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [imports, setImports] = useState<ImportMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setImports(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
  }, []);

  const persist = useCallback((next: ImportMap) => {
    setImports(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full / unavailable — keep in memory
    }
  }, []);

  const setImport = useCallback(
    (clientId: string, imp: ClientImport) => {
      persist({ ...imports, [clientId]: imp });
    },
    [imports, persist]
  );

  const clearImport = useCallback(
    (clientId: string) => {
      const next = { ...imports };
      delete next[clientId];
      persist(next);
    },
    [imports, persist]
  );

  const getClientData = useCallback(
    (clientId: string): ClientData => {
      const base = CLIENTS[clientId] ?? CLIENTS[CLIENT_ORDER[0]];
      const imp = imports[clientId];
      if (!imp) return base;
      return {
        ...base,
        meetings: imp.meetings,
        results: {
          ...deriveResults(imp.meetings),
          // deltas can't be derived from a single snapshot
          closedWonDelta: 0,
          meetingsHeldDelta: 0,
        },
        lastUpdated: imp.importedAt,
      };
    },
    [imports]
  );

  return (
    <DataContext.Provider value={{ imports, getClientData, setImport, clearImport }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
