import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  const today = new Date().toISOString().slice(0, 10);

  const [
    servicesToday,
    unassigned,
    active,
    pendingReview,
    pendingWorkers,
    overdue,
    pendingPayments,
    incidents,
  ] = await Promise.all([
    pool.query("select count(*)::int as count from public.services where scheduled_date = $1", [today]),
    pool.query("select count(*)::int as count from public.services where status in ('published', 'receiving_applications')"),
    pool.query("select count(*)::int as count from public.services where status in ('assigned', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'paused', 'pending_evidence', 'submitted_for_review', 'correction_requested')"),
    pool.query("select count(*)::int as count from public.services where status = 'submitted_for_review'"),
    pool.query("select count(*)::int as count from public.worker_profiles where status = 'pending_review'"),
    pool.query("select count(*)::int as count from public.services where scheduled_date < $1 and status in ('published', 'receiving_applications', 'assigned', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'paused')", [today]),
    pool.query("select count(*)::int as count from public.payments where status = 'pendiente'"),
    pool.query("select count(*)::int as count from public.service_incidents where status = 'open'"),
  ]);

  return NextResponse.json({
    data: {
      servicesToday: servicesToday.rows[0].count,
      unassigned: unassigned.rows[0].count,
      active: active.rows[0].count,
      pendingReview: pendingReview.rows[0].count,
      pendingWorkers: pendingWorkers.rows[0].count,
      overdue: overdue.rows[0].count,
      pendingPayments: pendingPayments.rows[0].count,
      incidents: incidents.rows[0].count,
    },
  });
}
