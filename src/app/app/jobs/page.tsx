"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useWorkerProfile, useMyAssignedServices } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; variant: "secondary" | "warning" | "success" | "info" | "destructive" }> = {
  assigned: { label: "Asignado", variant: "info" },
  accepted: { label: "Aceptado", variant: "info" },
  on_the_way: { label: "En camino", variant: "warning" },
  arrived: { label: "Llegado", variant: "warning" },
  in_progress: { label: "En proceso", variant: "warning" },
  paused: { label: "En pausa", variant: "secondary" },
  pending_evidence: { label: "Pendiente de evidencias", variant: "warning" },
  submitted_for_review: { label: "En revisión", variant: "info" },
  correction_requested: { label: "Corrección solicitada", variant: "destructive" },
  completed: { label: "Completado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

export default function JobsPage() {
  const { user } = useAuth();
  const { data: profileData } = useWorkerProfile(user?.id);
  const { data: jobsData, isLoading } = useMyAssignedServices(profileData?.data?.id);

  const jobs = jobsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis trabajos</h1>
        <p className="mt-1 text-sm text-gray-500">Servicios asignados a ti</p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No tienes trabajos asignados</h2>
            <p className="mt-2 text-sm text-gray-500">
              Cuando te asignen un servicio aparecerá aquí.
            </p>
            <Link href="/app/services" className="mt-4 inline-block">
              <Button>Ver servicios disponibles</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job: Record<string, unknown>) => {
            const status = STATUS_LABELS[job.status as string] ?? STATUS_LABELS.assigned;
            return (
              <Card key={job.id as string} className="transition-colors hover:border-blue-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">{job.code as string}</p>
                      <h2 className="mt-1 text-lg font-semibold text-gray-900">{job.title as string}</h2>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <p>📍 {job.municipality_name as string ?? "Zona por confirmar"} · {job.sector_name as string ?? "Sector"}</p>
                    <p>📅 {job.scheduled_date ? new Date(job.scheduled_date as string).toLocaleDateString("es-DO") : "Por definir"}</p>
                    <p className="font-medium text-gray-900">
                      💰 {job.payment_offered ? `RD$ ${Number(job.payment_offered).toLocaleString("es-DO")}` : "Pago por definir"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link href={`/app/jobs/${job.id as string}`}>
                      <Button className="w-full" variant="outline">Ver detalle del trabajo</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        </div>
      )}
    </div>
  );
}
