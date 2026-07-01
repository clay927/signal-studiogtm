"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/lib/session";
import { DataProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionProvider>
        <DataProvider>{children}</DataProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
