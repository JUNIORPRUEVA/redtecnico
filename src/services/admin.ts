import { createClient as createSupabaseClient } from "@/lib/supabase/client";

/**
 * Servicio de administración.
 * Solo accesible para admin y super_admin (validado por RLS).
 */

export async function getAllWorkers() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select(
      `*,
      profiles(full_name, email, phone),
      worker_specialties(specialty_id, specialties(name)),
      worker_ratings(overall)`
    )
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getPendingWorkers() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select(`*, profiles(full_name, email, phone)`)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getWorkerDetail(workerId: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select(
      `*,
      profiles(full_name, email, phone, avatar_url),
      worker_specialties(specialty_id, specialties(name)),
      worker_service_areas(municipality_id, municipalities(name), province_id, provinces(name)),
      worker_documents(*),
      worker_ratings(*),
      payments(*),
      admin_notes(*)`
    )
    .eq("id", workerId)
    .single();
  return { data, error };
}

export async function reviewWorker(
  workerId: string,
  newStatus: "approved" | "rejected" | "suspended" | "inactive",
  reason?: string
) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.rpc("review_worker", {
    p_worker_id: workerId,
    p_new_status: newStatus,
    p_reason: reason ?? null,
  });
  return { data, error };
}

export async function getAdminDashboardStats() {
  const supabase = createSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  const [servicesToday, unassigned, active, pendingReview, pendingWorkers, overdue, pendingPayments, incidents] =
    await Promise.all([
      supabase.from("services").select("id", { count: "exact" }).eq("scheduled_date", today),
      supabase.from("services").select("id", { count: "exact" }).in("status", ["published", "receiving_applications"]),
      supabase.from("services").select("id", { count: "exact" }).in("status", ["assigned", "accepted", "on_the_way", "arrived", "in_progress", "paused", "pending_evidence", "submitted_for_review", "correction_requested"]),
      supabase.from("services").select("id", { count: "exact" }).eq("status", "submitted_for_review"),
      supabase.from("worker_profiles").select("id", { count: "exact" }).eq("status", "pending_review"),
      supabase.from("services").select("id", { count: "exact" }).lt("scheduled_date", today).in("status", ["published", "receiving_applications", "assigned", "accepted", "on_the_way", "arrived", "in_progress", "paused"]),
      supabase.from("payments").select("id", { count: "exact" }).eq("status", "pendiente"),
      supabase.from("service_incidents").select("id", { count: "exact" }).eq("status", "open"),
    ]);

  return {
    servicesToday: servicesToday.count ?? 0,
    unassigned: unassigned.count ?? 0,
    active: active.count ?? 0,
    pendingReview: pendingReview.count ?? 0,
    pendingWorkers: pendingWorkers.count ?? 0,
    overdue: overdue.count ?? 0,
    pendingPayments: pendingPayments.count ?? 0,
    incidents: incidents.count ?? 0,
  };
}

export async function getRecentServices() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  return { data, error };
}

export async function getRecentActivity() {

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);
  return { data, error };
}

export async function getAuditLogs() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return { data, error };
}

export async function createPayment(payment: Record<string, unknown>) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();
  return { data, error };
}

export async function updatePayment(paymentId: string, updates: Record<string, unknown>) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", paymentId)
    .select()
    .single();
  return { data, error };
}

export async function getAllPayments() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createRating(rating: Record<string, unknown>) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("worker_ratings")
    .insert(rating)
    .select()
    .single();
  return { data, error };
}

export async function addAdminNote(note: { worker_id?: string; service_id?: string; content: string }) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("admin_notes")
    .insert(note)
    .select()
    .single();
  return { data, error };
}

export async function getClients() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name", { ascending: true });
  return { data, error };
}

export async function createClient(client: Record<string, unknown>) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();
  return { data, error };
}

export async function getAppSettings() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("app_settings").select("*");
  return { data, error };
}

export async function updateAppSetting(key: string, value: unknown) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("app_settings")
    .update({ value })
    .eq("key", key)
    .select()
    .single();
  return { data, error };
}
