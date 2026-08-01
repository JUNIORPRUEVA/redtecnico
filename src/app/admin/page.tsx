"use client";

import Link from "next/link";
import { useAdminStats, usePendingWorkers, useRecentServices } from "@/hooks/use-queries";
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

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useAdminStats();
  const { data: pendingWorkersData } = usePendingWorkers();
  const { data: recentServicesData } = useRecentServices();

  const stats = statsData;
  const pendingWorkers = pendingWorkersData?.data ?? [];
  const recentServices = recentServicesData?.data ?? [];


  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Servicios de hoy", value: stats?.servicesToday ?? 0, href: "/admin/services" },
    { label: "Servicios sin asignar", value: stats?.unassigned ?? 0, href: "/admin/services" },
    { label: "Servicios activos", value: stats?.active ?? 0, href: "/admin/services" },
    { label: "Pendientes de revisión", value: stats?.pendingReview ?? 0, href: "/admin/services" },
    { label: "Técnicos pendientes", value: pendingWorkers.length, href: "/admin/requests" },
    { label: "Servicios atrasados", value: stats?.overdue ?? 0, href: "/admin/services" },
    { label: "Pagos pendientes", value: stats?.pendingPayments ?? 0, href: "/admin/payments" },
    { label: "Incidencias", value: stats?.incidents ?? 0, href: "/admin/services" },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Resumen de la operación de Fulltech</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:border-blue-300">
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Técnicos pendientes de aprobación */}
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Solicitudes pendientes</h2>
              <Link href="/admin/requests">
                <Button variant="ghost" size="sm">Ver todas</Button>
              </Link>
            </div>
            {pendingWorkers.length === 0 ? (
              <p className="text-sm text-gray-500">No hay solicitudes pendientes.</p>
            ) : (
              <div className="space-y-3">
                {pendingWorkers.map((w: Record<string, unknown>) => (
                  <div key={w.id as string} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{w.full_name as string}</p>
                      <p className="text-xs text-gray-500">{w.worker_type as string}</p>
                    </div>
                    <Badge variant="warning">Pendiente</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Servicios recientes */}
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Servicios recientes</h2>
              <Link href="/admin/services">
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            </div>
            {recentServices.length === 0 ? (
              <p className="text-sm text-gray-500">No hay servicios recientes.</p>
            ) : (
              <div className="space-y-3">
                {recentServices.map((s: Record<string, unknown>) => {
                  const status = STATUS_LABELS[s.status as string] ?? STATUS_LABELS.draft;
                  return (
                    <div key={s.id as string} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{s.title as string}</p>
                        <p className="text-xs text-gray-500">{s.code as string}</p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
