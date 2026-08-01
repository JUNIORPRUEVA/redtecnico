"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useWorkerProfile, useAvailableServices, useMyAssignedServices, useSetAvailability } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton, Switch } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  pending_review: { label: "En revisión", variant: "warning" },
  approved: { label: "Aprobado", variant: "success" },
  rejected: { label: "Rechazado", variant: "destructive" },
  suspended: { label: "Suspendido", variant: "destructive" },
  inactive: { label: "Inactivo", variant: "secondary" },
};

export default function AppHomePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useWorkerProfile(user?.id);
  const { data: availableData } = useAvailableServices(profileData?.data?.id);
  const { data: assignedData } = useMyAssignedServices(profileData?.data?.id);
  const setAvailability = useSetAvailability();

  const profile = profileData?.data;
  const availableCount = availableData?.data?.length ?? 0;
  const activeJobs = assignedData?.data?.filter((s: { status: string }) =>
    ["assigned", "accepted", "on_the_way", "arrived", "in_progress", "paused"].includes(s.status)
  ).length ?? 0;

  const statusInfo = profile ? STATUS_LABELS[profile.status] : null;

  if (profileLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900">Completa tu perfil</h1>
        <p className="mt-2 text-sm text-gray-600">
          Necesitas completar tu registro para acceder a los servicios.
        </p>
        <Link href="/register" className="mt-4 inline-block">
          <Button>Completar registro</Button>
        </Link>
      </div>
    );
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "colaborador";

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hola, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Bienvenido a tu espacio de trabajo</p>
        </div>
        {statusInfo && <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>}
      </div>

      {/* Estado del perfil */}
      {profile.status !== "approved" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <p className="text-sm font-medium text-amber-900">
              {profile.status === "pending_review" && "Tu perfil está en revisión. FULLTECH te notificará cuando sea aprobado."}
              {profile.status === "rejected" && "Tu solicitud fue rechazada. Consulta el motivo en tu perfil."}
              {profile.status === "suspended" && "Tu perfil está suspendido. Contacta a FULLTECH."}
              {profile.status === "inactive" && "Tu perfil está inactivo. Contacta a FULLTECH."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disponibilidad */}
      {profile.status === "approved" && (
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium text-gray-900">Disponibilidad</p>
              <p className="text-sm text-gray-500">
                {profile.is_available ? "Estás disponible para recibir servicios" : "No estás disponible para recibir servicios"}
              </p>
            </div>
            <Switch
              checked={profile.is_available}
              onCheckedChange={(checked) => setAvailability.mutate({ workerId: profile.id, isAvailable: checked })}
              aria-label="Cambiar disponibilidad"
            />
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      {profile.status === "approved" && (
        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/services">
            <Card className="h-full transition-colors hover:border-blue-300">
              <CardContent className="p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-3 font-medium text-gray-900">Ver servicios</p>
                <p className="text-sm text-gray-500">{availableCount} disponibles</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/app/jobs">
            <Card className="h-full transition-colors hover:border-blue-300">
              <CardContent className="p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-3 font-medium text-gray-900">Mis trabajos</p>
                <p className="text-sm text-gray-500">{activeJobs} activos</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Próximo servicio */}
      {profile.status === "approved" && activeJobs > 0 && (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-gray-500">Próximo servicio asignado</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              Tienes {activeJobs} trabajo{activeJobs > 1 ? "s" : ""} activo{activeJobs > 1 ? "s" : ""}
            </p>
            <Link href="/app/jobs" className="mt-3 inline-block">
              <Button variant="outline" size="sm">Ver mis trabajos</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {profile.status === "approved" && activeJobs === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No tienes trabajos activos</h2>
            <p className="mt-2 text-sm text-gray-500">
              Revisa los servicios disponibles en tu zona y solicita tu asignación.
            </p>
            <Link href="/app/services" className="mt-4 inline-block">
              <Button>Ver servicios disponibles</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
