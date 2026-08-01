"use client";

import Link from "next/link";
import { useAllServices } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, { label: string; variant: "secondary" | "warning" | "success" | "info" | "destructive" }> = {
  draft: { label: "Borrador", variant: "secondary" },
  published: { label: "Publicado", variant: "info" },
  receiving_applications: { label: "Recibiendo solicitudes", variant: "info" },
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
  expired: { label: "Expirado", variant: "secondary" },
};

export default function AdminServicesPage() {
  const { data: servicesData, isLoading } = useAllServices();
  const services = servicesData?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicios</h1>
          <p className="mt-1 text-sm text-gray-500">Gestiona los servicios técnicos</p>
        </div>
        <Link href="/admin/services/new">
          <Button>Nuevo servicio</Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay servicios</h2>
            <p className="mt-2 text-sm text-gray-500">Crea tu primer servicio para comenzar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((s: Record<string, unknown>) => {
            const status = STATUS_LABELS[s.status as string] ?? STATUS_LABELS.draft;
            return (
              <Card key={s.id as string} className="transition-colors hover:border-blue-300">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">{s.code as string}</p>
                    <h2 className="truncate text-base font-semibold text-gray-900">{s.title as string}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {s.scheduled_date ? new Date(s.scheduled_date as string).toLocaleDateString("es-DO") : "Sin fecha"}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
