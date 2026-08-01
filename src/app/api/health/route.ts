import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "redtecnico-fulltech",
    timestamp: new Date().toISOString(),
  });
}
