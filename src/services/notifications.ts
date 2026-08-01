import { createClient } from "@/lib/supabase/client";

/**
 * Servicio de notificaciones internas.
 */

export async function getMyNotifications() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return { data, error };
}

export async function getUnreadCount() {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return { count, error };
}

export async function markAsRead(notificationId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();
  return { data, error };
}

export async function markAllAsRead() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("is_read", false);
  return { data, error };
}
