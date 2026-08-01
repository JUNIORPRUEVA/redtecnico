"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export default function DashboardPage() {
  const router = useRouter();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role === "admin" || role === "super_admin") {
      router.replace("/admin");
    } else {
      router.replace("/app");
    }
  }, [user, role, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
        <p className="mt-4 text-sm text-gray-500">Cargando tu espacio de trabajo...</p>
      </div>
    </div>
  );
}
