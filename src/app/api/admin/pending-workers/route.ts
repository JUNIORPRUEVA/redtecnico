import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  const result = await getPool().query(`
    select wp.*, p.full_name, p.email, p.phone
    from public.worker_profiles wp
    left join public.profiles p on p.id = wp.user_id
    where wp.status = 'pending_review'
    order by wp.created_at desc
  `);
  return NextResponse.json({ data: result.rows });
}
