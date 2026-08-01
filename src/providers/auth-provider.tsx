"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getLocalSession } from "@/services/auth";
import type { Session, User } from "@supabase/supabase-js";


type UserRole = "super_admin" | "admin" | "technician" | "helper";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  role: null,
  isLoading: true,
  isAdmin: false,
  isSuperAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRole = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured()) {
      const session = getLocalSession();
      const localRole = session?.user?.app_metadata?.role as UserRole | undefined;
      setRole(localRole ?? null);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .limit(1)
        .single();
      setRole((data?.role as UserRole) ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const syncLocalSession = () => {
        const session = getLocalSession();
        setSession(session);
        setUser(session?.user ?? null);
        setRole((session?.user?.app_metadata?.role as UserRole | undefined) ?? null);
        setIsLoading(false);
      };

      syncLocalSession();
      window.addEventListener("storage", syncLocalSession);
      window.addEventListener("redtecnico-auth-change", syncLocalSession);

      return () => {
        window.removeEventListener("storage", syncLocalSession);
        window.removeEventListener("redtecnico-auth-change", syncLocalSession);
      };
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    }).catch(() => setIsLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRole(session.user.id);
      } else {
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [loadRole]);


  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isLoading,
        isAdmin: role === "admin" || role === "super_admin",
        isSuperAdmin: role === "super_admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
