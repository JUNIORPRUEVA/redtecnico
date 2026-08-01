"use client";

import { useAuth } from "@/providers/auth-provider";
import { useWorkerProfile, useWorkerSpecialties, useWorkerRatings, useWorkerPayments } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton, Separator } from "@/components/ui/primitives";

const STATUS_LABELS: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  pending_review: { label: "En revisión", variant: "warning" },
  approved: { label: "Aprobado", variant: "success" },
  rejected: { label: "Rechazado", variant: "destructive" },
  suspended: { label: "Suspendido", variant: "destructive" },
  inactive: { label: "Inactivo", variant: "secondary" },
};

const TYPE_LABELS: Record<string, string> = {
  technician: "Técnico",
  helper: "Ayudante",
  both: "Técnico y Ayudante",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useWorkerProfile(user?.id);
  const { data: specialtiesData } = useWorkerSpecialties(profileData?.data?.id);
  const { data: ratingsData } = useWorkerRatings(profileData?.data?.id);
  const { data: paymentsData } = useWorkerPayments(profileData?.data?.id);

  const profile = profileData?.data;
  const specialties = specialtiesData?.data ?? [];
  const ratings = ratingsData?.data ?? [];
  const payments = paymentsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900">Perfil no encontrado</h1>
        <p className="mt-2 text-sm text-gray-600">Completa tu registro para ver tu perfil.</p>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[profile.status] ?? STATUS_LABELS.pending_review;
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum: number, r: Record<string, unknown>) => sum + Number(r.overall_rating ?? 0), 0) / ratings.length).toFixed(1)
    : "—";


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      {/* Información básica */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
              {(profile.full_name ?? "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{profile.full_name}</h2>
              <p className="text-sm text-gray-500">{TYPE_LABELS[profile.worker_type] ?? profile.worker_type}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm text-gray-600">
            <p>📞 {profile.phone ?? "No registrado"}</p>
            <p>🪪 Cédula: {profile.cedula ?? "No registrada"}</p>
            <p>📍 {profile.province_name ?? "Provincia"} · {profile.municipality_name ?? "Municipio"} · {profile.sector_name ?? "Sector"}</p>
            <p>⭐ Calificación promedio: {avgRating}</p>
          </div>

          {profile.rejection_reason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">Motivo de rechazo</p>
              <p className="mt-1 text-sm text-red-800">{profile.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Especialidades */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
          {specialties.length === 0 ? (
            <p className="text-sm text-gray-500">No has registrado especialidades.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specialties.map((s: Record<string, unknown>) => {
                const spec = s.specialties as Record<string, unknown> | null;
                return (
                  <Badge key={s.id as string} variant="outline">
                    {(spec?.name as string) ?? (s.name as string)}
                  </Badge>
                );
              })}

            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagos */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Mis pagos</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no tienes pagos registrados.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p: Record<string, unknown>) => (
                <div key={p.id as string} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      RD$ {p.total_amount ? Number(p.total_amount).toLocaleString("es-DO") : "0"}
                    </p>
                    <p className="text-xs text-gray-500">{p.status as string}</p>
                  </div>
                  <Badge variant="secondary">{p.status as string}</Badge>
                </div>
              ))}

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
