import type { Session, User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Servicio de autenticación.
 * Todas las operaciones de auth se centralizan aquí.
 */

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();
    if (!response.ok) {
      return { data: { session: null, user: null }, error: payload.error };
    }
    localStorage.setItem("redtecnico.session", JSON.stringify(payload.session));
    window.dispatchEvent(new Event("redtecnico-auth-change"));
    return { data: payload, error: null };
  }

  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    localStorage.removeItem("redtecnico.session");
    window.dispatchEvent(new Event("redtecnico-auth-change"));
    return { error: null };
  }

  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  const supabase = createClient();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
}

export async function getSession() {
  if (!isSupabaseConfigured()) {
    const session = getLocalSession();
    return { data: { session }, error: null };
  }

  const supabase = createClient();
  return supabase.auth.getSession();
}

export async function getUser() {
  if (!isSupabaseConfigured()) {
    const session = getLocalSession();
    return { data: { user: session?.user ?? null }, error: null };
  }

  const supabase = createClient();
  return supabase.auth.getUser();
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  return supabase.auth.updateUser({ password: newPassword });
}

export function getLocalSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("redtecnico.session");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem("redtecnico.session");
    return null;
  }
}

export function getLocalUser(): User | null {
  return getLocalSession()?.user ?? null;
}
