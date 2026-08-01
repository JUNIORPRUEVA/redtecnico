import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

const TABLES = {
  provinces: "provinces",
  municipalities: "municipalities",
  sectors: "sectors",
  specialties: "specialties",
  documentTypes: "worker_document_types",
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") as keyof typeof TABLES | null;

  if (!resource || !(resource in TABLES)) {
    return NextResponse.json({ error: "Catalogo no valido." }, { status: 400 });
  }

  const pool = getPool();
  const values: string[] = [];
  const where: string[] = [];

  if (resource === "municipalities" && searchParams.get("provinceId")) {
    values.push(searchParams.get("provinceId")!);
    where.push(`province_id = $${values.length}`);
  }

  if (resource === "sectors" && searchParams.get("municipalityId")) {
    values.push(searchParams.get("municipalityId")!);
    where.push(`municipality_id = $${values.length}`);
  }

  if (resource === "specialties" || resource === "documentTypes") {
    where.push("is_active = true");
  }

  const orderBy =
    resource === "specialties" || resource === "documentTypes"
      ? "sort_order asc, name asc"
      : "name asc";

  const sql = `
    select *
    from public.${TABLES[resource]}
    ${where.length ? `where ${where.join(" and ")}` : ""}
    order by ${orderBy}
  `;

  const result = await pool.query(sql, values);
  return NextResponse.json({ data: result.rows });
}
