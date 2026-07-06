"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import {
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Upload,
  UserRound,
} from "lucide-react";
import { useSession, ROLE_LABELS } from "@/lib/session";
import { Menu, MenuItem, MenuLabel } from "@/components/menu";
import { initials } from "@/lib/format";

export function Sidebar() {
  const pathname = usePathname();
  const { user, role, logout } = useSession();
  const { theme, setTheme } = useTheme();
  const isOwner = user.clientAccess === "all";

  return (
    <aside className="flex h-dvh w-[232px] shrink-0 flex-col bg-sidebar px-3 py-4 text-sidebar-ink">
      <Link href="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gold text-[15px] font-medium text-navy-deep">
          P
        </span>
        <span className="text-[16px] font-medium text-sidebar-ink-active">Pando</span>
      </Link>

      <nav className="flex flex-col gap-1">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] transition-colors",
            pathname === "/"
              ? "bg-navy-deep text-sidebar-ink-active"
              : "text-sidebar-ink hover:bg-navy-deep/60 hover:text-sidebar-ink-active"
          )}
        >
          <LayoutDashboard size={18} strokeWidth={1.75} />
          Main Dashboard
        </Link>
      </nav>

      <div className="mt-auto">
        <Menu
          up
          width={212}
          trigger={() => (
            <div className="flex items-center gap-2.5 rounded-[10px] px-2 py-2 hover:bg-navy-deep/60">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-deep text-[12px] font-medium text-sidebar-ink-active">
                {initials(user.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-sidebar-ink-active">
                  {user.name}
                </span>
                <span className="block truncate text-[11px] text-sidebar-ink">
                  {ROLE_LABELS[role]}
                </span>
              </span>
              <Settings size={15} className="text-sidebar-ink" />
            </div>
          )}
        >
          {(close) => (
            <>
              <Link href="/profile" onClick={close}>
                <span className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-surface-2">
                  <UserRound size={15} className="text-ink-3" /> Profile
                </span>
              </Link>
              <Link href="/settings" onClick={close}>
                <span className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-surface-2">
                  <Settings size={15} className="text-ink-3" /> Settings
                </span>
              </Link>
              {isOwner && (
                <Link href="/import" onClick={close}>
                  <span className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-surface-2">
                    <Upload size={15} className="text-ink-3" /> Import data
                  </span>
                </Link>
              )}

              <div className="my-1 h-px bg-border" />
              <MenuLabel>Appearance</MenuLabel>
              <MenuItem icon={<Sun size={15} />} active={theme === "light"} onClick={() => setTheme("light")}>
                Light
              </MenuItem>
              <MenuItem icon={<Moon size={15} />} active={theme === "dark"} onClick={() => setTheme("dark")}>
                Dark
              </MenuItem>
              <MenuItem icon={<Monitor size={15} />} active={theme === "system"} onClick={() => setTheme("system")}>
                System
              </MenuItem>

              <div className="my-1 h-px bg-border" />
              <MenuItem icon={<LogOut size={15} />} onClick={() => { close(); logout(); }}>
                Log out
              </MenuItem>
            </>
          )}
        </Menu>
      </div>
    </aside>
  );
}
