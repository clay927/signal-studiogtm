"use client";

import { useCallback, useEffect, useState } from "react";
import { CLIENTS, CLIENT_ORDER } from "@/lib/data";
import { ROLE_LABELS } from "@/lib/session";
import { Card, SectionTitle, Pill } from "@/components/ui";
import { ShieldCheck, Plus, Trash2, Link2, Copy, Check } from "lucide-react";
import type { Role } from "@/lib/types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  client_access: string[];
  status: string;
}

const ROLES: Role[] = ["owner", "sdr", "client", "client_team"];

export function UserManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [dbDown, setDbDown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [link, setLink] = useState<{ id: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<{ name: string; email: string; role: Role; access: string[] }>({
    name: "",
    email: "",
    role: "client_team",
    access: [],
  });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setDbDown(!!data.dbUnavailable);
      setUsers(data.users ?? []);
    } catch {
      setDbDown(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(payload: Partial<UserRow> & { clientAccess?: string[] }) {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await load();
  }

  async function inviteLink(email: string, id: string) {
    setCopied(false);
    const res = await fetch("/api/auth/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.ok) {
      setLink({ id, url: data.link });
      try {
        await navigator.clipboard.writeText(data.link);
        setCopied(true);
      } catch {
        // clipboard blocked — link still shown to copy manually
      }
    }
  }

  async function addUser() {
    if (!form.email) return;
    await save({ name: form.name, email: form.email, role: form.role, clientAccess: form.access });
    setForm({ name: "", email: "", role: "client_team", access: [] });
    setShowAdd(false);
  }

  return (
    <Card className="p-5">
      <SectionTitle
        icon={<ShieldCheck size={16} />}
        title="Users"
        right={
          <button
            onClick={() => setShowAdd((s) => !s)}
            className="flex items-center gap-1.5 rounded-[8px] bg-navy px-2.5 py-1.5 text-[12.5px] text-sidebar-ink-active hover:opacity-90"
          >
            <Plus size={14} /> Add user
          </button>
        }
      />

      {dbDown && (
        <p className="mb-3 rounded-[10px] bg-warn-soft px-3 py-2 text-[12.5px] text-warn-ink">
          User management saves in production (database not reachable here).
        </p>
      )}

      {showAdd && (
        <div className="mb-4 rounded-[12px] border border-gold-line bg-surface-2 p-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
            <input
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-[8px] border border-border bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-gold-line"
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="rounded-[8px] border border-border bg-surface px-2 py-1.5 text-[13px] text-ink"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <span className="text-[12px] text-ink-3">Access:</span>
            {CLIENT_ORDER.map((id) => (
              <label key={id} className="flex items-center gap-1 text-[12.5px] text-ink-2">
                <input
                  type="checkbox"
                  checked={form.access.includes(id)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      access: e.target.checked ? [...form.access, id] : form.access.filter((a) => a !== id),
                    })
                  }
                />
                {CLIENTS[id].client.name}
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addUser} className="rounded-[8px] bg-navy px-3 py-1.5 text-[13px] text-sidebar-ink-active hover:opacity-90">
              Create user
            </button>
            <button onClick={() => setShowAdd(false)} className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong">
              Cancel
            </button>
          </div>
        </div>
      )}

      {link && (
        <div className="mb-4 rounded-[12px] border border-gold-line bg-gold-soft p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[12.5px] font-medium text-gold">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Invite link copied — send it to the user" : "Invite link (copy and send to the user)"}
          </div>
          <code className="block break-all rounded-[8px] border border-border bg-surface px-3 py-2 text-[12px] text-ink">{link.url}</code>
          <p className="mt-1 text-[11px] text-ink-3">They open this to set a password and sign in. (Automated email invites come with an email provider.)</p>
        </div>
      )}

      {!loaded ? (
        <p className="text-[13px] text-ink-3">Loading…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-border text-left text-[12px] text-ink-3">
                <th className="py-2 pr-3 font-normal">Name</th>
                <th className="py-2 pr-3 font-normal">Role</th>
                <th className="py-2 pr-3 font-normal">Access</th>
                <th className="py-2 pr-3 font-normal">Status</th>
                <th className="py-2 pl-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-3">
                    <div className="text-ink">{u.name || "—"}</div>
                    <div className="text-[12px] text-ink-3">{u.email}</div>
                  </td>
                  <td className="py-2.5 pr-3">
                    <select
                      value={u.role}
                      onChange={(e) => save({ id: u.id, name: u.name, email: u.email, role: e.target.value, clientAccess: u.client_access, status: u.status })}
                      className="rounded-[8px] border border-border bg-surface px-2 py-1 text-[12.5px] text-ink"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 pr-3 text-[12px] text-ink-2">
                    {u.role === "owner" ? "All clients" : u.client_access.length ? u.client_access.map((a) => CLIENTS[a]?.client.name ?? a).join(", ") : "—"}
                  </td>
                  <td className="py-2.5 pr-3">
                    <button
                      onClick={() => save({ id: u.id, name: u.name, email: u.email, role: u.role, clientAccess: u.client_access, status: u.status === "active" ? "deactivated" : "active" })}
                    >
                      <Pill tone={u.status === "active" ? "good" : "neutral"}>{u.status === "active" ? "Active" : "Deactivated"}</Pill>
                    </button>
                  </td>
                  <td className="py-2.5 pl-3">
                    <div className="flex items-center justify-end gap-2">
                      <button title="Copy invite / reset link" onClick={() => inviteLink(u.email, u.id)} className="text-gold hover:opacity-80"><Link2 size={15} /></button>
                      <button title="Remove" onClick={() => remove(u.id)} className="text-ink-3 hover:text-bad-ink"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
