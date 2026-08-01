import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  const result = await getPool().query(
    "select * from public.services order by created_at desc limit 10"
  );
  return NextResponse.json({ data: result.rows });
}
