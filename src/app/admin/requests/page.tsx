"use client";

import { useState } from "react";
import { usePendingWorkers, useReviewWorker } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge, Label, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const TYPE_LABELS: Record<string, string> = {
  technician: "Técnico",
  helper: "Ayudante",
  both: "Técnico y Ayudante",
};

export default function AdminRequestsPage() {
  const { data: workersData, isLoading } = usePendingWorkers();
  const reviewWorker = useReviewWorker();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

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

  async function handleApprove(workerId: string) {
    setError(null);
    reviewWorker.mutate({ workerId, newStatus: "approved" });
  }

  async function handleReject(workerId: string) {
    setError(null);
    const reason = rejectReason[workerId]?.trim();
    if (!reason) {
      setError("Debes indicar el motivo del rechazo.");
      return;
    }
    reviewWorker.mutate({ workerId, newStatus: "rejected", reason });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de registro</h1>
        <p className="mt-1 text-sm text-gray-500">Revisa y aprueba las solicitudes de colaboradores</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {workers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay solicitudes pendientes</h2>
            <p className="mt-2 text-sm text-gray-500">
              Cuando un técnico o ayudante se registre, su solicitud aparecerá aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workers.map((w: Record<string, unknown>) => {
            const profile = w.profiles as Record<string, unknown> | null;
            return (
              <Card key={w.id as string}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {profile?.full_name as string ?? "Sin nombre"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {TYPE_LABELS[w.worker_type as string] ?? (w.worker_type as string)}
                      </p>
                      <p className="text-xs text-gray-400">{profile?.email as string}</p>
                    </div>
                    <Badge variant="warning">Pendiente</Badge>
                  </div>

                  <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    <p>🪪 Cédula: {w.cedula as string ?? "No registrada"}</p>
                    <p>📞 Teléfono: {profile?.phone as string ?? "No registrado"}</p>
                    <p>⭐ Nivel: {w.level as string ?? "No definido"}</p>
                    <p>📅 Experiencia: {w.years_experience ? `${w.years_experience as string} años` : "No indicada"}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reason-${w.id as string}`}>Motivo de rechazo (si aplica)</Label>
                    <Textarea
                      id={`reason-${w.id as string}`}
                      placeholder="Indica el motivo si vas a rechazar la solicitud..."
                      value={rejectReason[w.id as string] ?? ""}
                      onChange={(e) => setRejectReason((prev) => ({ ...prev, [w.id as string]: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(w.id as string)}
                      disabled={reviewWorker.isPending}
                    >
                      Aprobar
                    </Button>
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={() => handleReject(w.id as string)}
                      disabled={reviewWorker.isPending}
                    >
                      Rechazar
                    </Button>
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
