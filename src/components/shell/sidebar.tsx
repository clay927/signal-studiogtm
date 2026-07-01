"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from "clsx";
import {
  LayoutDashboard,
  Trophy,
  Activity,
  ListChecks,
  Brain,
  Building2,
  Settings,
  Sun,
  Moon,
  Monitor,
  UserCog,
  Upload,
} from "lucide-react";
import { useSession, ROLE_LABELS } from "@/lib/session";
import { Menu, MenuItem, MenuLabel } from "@/components/menu";
import { initials } from "@/lib/format";
import type { Role } from "@/lib/types";

const NAV = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/results", label: "Results", icon: Trophy },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/projects", label: "Projects", icon: ListChecks },
  { href: "/brain", label: "Client brain", icon: Brain },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, role, setRole } = useSession();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="flex h-dvh w-[232px] shrink-0 flex-col bg-sidebar px-3 py-4 text-sidebar-ink">
      <Link href="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gold text-[15px] font-medium text-navy-deep">
          S
        </span>
        <span className="text-[16px] font-medium text-sidebar-ink-active">Signal</span>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] transition-colors",
              isActive(href)
                ? "bg-navy-deep text-sidebar-ink-active"
                : "text-sidebar-ink hover:bg-navy-deep/60 hover:text-sidebar-ink-active"
            )}
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </nav>

      {user.clientAccess === "all" && (
        <>
          <div className="my-3 h-px bg-white/10" />
          <p className="px-3 pb-1 text-[11px] uppercase tracking-wide text-sidebar-ink/70">
            Owner
          </p>
          <Link
            href="/portfolio"
            className={clsx(
              "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] transition-colors",
              isActive("/portfolio")
                ? "bg-navy-deep text-sidebar-ink-active"
                : "text-sidebar-ink hover:bg-navy-deep/60 hover:text-sidebar-ink-active"
            )}
          >
            <Building2 size={18} strokeWidth={1.75} />
            All clients
          </Link>
          <Link
            href="/import"
            className={clsx(
              "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] transition-colors",
              isActive("/import")
                ? "bg-navy-deep text-sidebar-ink-active"
                : "text-sidebar-ink hover:bg-navy-deep/60 hover:text-sidebar-ink-active"
            )}
          >
            <Upload size={18} strokeWidth={1.75} />
            Import data
          </Link>
          <Link
            href="/settings"
            className={clsx(
              "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[14px] transition-colors",
              isActive("/settings")
                ? "bg-navy-deep text-sidebar-ink-active"
                : "text-sidebar-ink hover:bg-navy-deep/60 hover:text-sidebar-ink-active"
            )}
          >
            <Settings size={18} strokeWidth={1.75} />
            Settings
          </Link>
        </>
      )}

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

              <MenuLabel>Preview as (demo)</MenuLabel>
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                <MenuItem key={r} icon={<UserCog size={15} />} active={role === r} onClick={() => { setRole(r); close(); }}>
                  {ROLE_LABELS[r]}
                </MenuItem>
              ))}

              <div className="my-1 h-px bg-border" />
              <Link href="/settings" onClick={close}>
                <span className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[13.5px] text-ink hover:bg-surface-2">
                  <Settings size={15} className="text-ink-3" /> Account &amp; settings
                </span>
              </Link>
            </>
          )}
        </Menu>
      </div>
    </aside>
  );
}
