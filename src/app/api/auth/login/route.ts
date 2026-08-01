import { NextResponse } from "next/server";
import type { Session, User } from "@supabase/supabase-js";
import { getPool } from "@/lib/db";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña son requeridos." }, { status: 400 });
  }

  const pool = getPool();
  const result = await pool.query(
    `
      select u.id, u.email, p.full_name, r.role
      from auth.users u
      left join public.profiles p on p.id = u.id
      left join public.user_roles r on r.user_id = u.id
      where lower(u.email) = lower($1)
        and u.encrypted_password = crypt($2, u.encrypted_password)
      limit 1
    `,
    [email, password]
  );

  const row = result.rows[0];
  if (!row) {
    return NextResponse.json({ error: "Correo o contraseña incorrectos." }, { status: 401 });
  }

  const user = {
    id: row.id,
    email: row.email,
    app_metadata: { role: row.role },
    user_metadata: { full_name: row.full_name },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as User;

  const session = {
    access_token: `local-${row.id}`,
    refresh_token: `local-refresh-${row.id}`,
    token_type: "bearer",
    expires_in: 60 * 60 * 24 * 30,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    user,
  } as Session;

  return NextResponse.json({ session, user });
}
