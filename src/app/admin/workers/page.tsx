"use client";

import Link from "next/link";
import { useAllWorkers } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

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

export default function AdminWorkersPage() {
  const { data: workersData, isLoading } = useAllWorkers();
  const workers = workersData?.data ?? [];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Técnicos y ayudantes</h1>
        <p className="mt-1 text-sm text-gray-500">Gestiona los colaboradores de la red</p>
      </div>

      {workers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay colaboradores</h2>
            <p className="mt-2 text-sm text-gray-500">Los técnicos y ayudantes registrados aparecerán aquí.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {workers.map((w: Record<string, unknown>) => {
            const status = STATUS_LABELS[w.status as string] ?? STATUS_LABELS.pending_review;
            const profile = w.profiles as Record<string, unknown> | null;
            return (
              <Card key={w.id as string} className="transition-colors hover:border-blue-300">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-gray-900">
                      {profile?.full_name as string ?? "Sin nombre"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {TYPE_LABELS[w.worker_type as string] ?? (w.worker_type as string)}
                    </p>
                    <p className="text-xs text-gray-400">{profile?.email as string}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <Link href={`/admin/workers/${w.id as string}`}>
                      <Button variant="outline" size="sm">Ver</Button>
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
