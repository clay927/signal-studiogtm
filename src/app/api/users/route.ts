import { NextRequest, NextResponse } from "next/server";
import { listUsers, upsertUser, deleteUser } from "@/lib/db";
import { USERS } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  try {
    let users = await listUsers();
    if (users.length === 0) {
      // Seed with the demo users on first load.
      for (const u of Object.values(USERS)) {
        await upsertUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          clientAccess: u.clientAccess === "all" ? [] : (u.clientAccess as string[]),
          status: "active",
        });
      }
      users = await listUsers();
    }
    return NextResponse.json({ ok: true, users });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true, users: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: { id?: string; name?: string; email?: string; role?: string; clientAccess?: string[]; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }
  if (!body.email && !body.id) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  const id = body.id || body.email!;
  try {
    await upsertUser({
      id,
      name: body.name ?? "",
      email: body.email ?? id,
      role: body.role ?? "client_team",
      clientAccess: body.clientAccess ?? [],
      status: body.status ?? "active",
    });
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  try {
    await deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, dbUnavailable: true }, { status: 503 });
  }
}
