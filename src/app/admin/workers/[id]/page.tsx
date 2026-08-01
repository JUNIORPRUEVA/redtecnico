"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkerDetail, useReviewWorker } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge, Label, Textarea } from "@/components/ui/primitives";
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

export default function AdminWorkerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: workerData, isLoading } = useWorkerDetail(params.id);
  const reviewWorker = useReviewWorker();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const worker = workerData?.data;
  const profile = worker?.profiles as Record<string, unknown> | null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900">Colaborador no encontrado</h1>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/admin/workers")}>
          Volver
        </Button>
      </div>
    );
  }

  const status = STATUS_LABELS[worker.status as string] ?? STATUS_LABELS.pending_review;

  async function handleAction(newStatus: "approved" | "rejected" | "suspended" | "inactive") {
    setError(null);
    if ((newStatus === "rejected" || newStatus === "suspended") && !reason.trim()) {
      setError("Debes indicar el motivo.");
      return;
    }
    reviewWorker.mutate(
      { workerId: worker.id as string, newStatus, reason: reason.trim() || undefined },
      { onSuccess: () => setReason("") }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">Detalle del colaborador</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.full_name as string ?? "Sin nombre"}
          </h1>
          <div className="mt-2">
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/workers")}>
          Volver
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Información del perfil */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Información</h2>
          <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
            <p>📧 Correo: {profile?.email as string ?? "No registrado"}</p>
            <p>📞 Teléfono: {profile?.phone as string ?? "No registrado"}</p>
            <p>🪪 Cédula: {worker.cedula as string ?? "No registrada"}</p>
            <p>👤 Tipo: {TYPE_LABELS[worker.worker_type as string] ?? (worker.worker_type as string)}</p>
            <p>⭐ Nivel: {worker.level as string ?? "No definido"}</p>
            <p>📅 Experiencia: {worker.years_experience ? `${worker.years_experience as string} años` : "No indicada"}</p>
          </div>
          {worker.experience_description ? (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Descripción:</span> {worker.experience_description as string}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Especialidades */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Especialidades</h2>
          {worker.worker_specialties && (worker.worker_specialties as unknown[]).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(worker.worker_specialties as Record<string, unknown>[]).map((ws) => {
                const spec = ws.specialties as Record<string, unknown> | null;
                return (
                  <Badge key={ws.specialty_id as string} variant="secondary">
                    {spec?.name as string ?? "Especialidad"}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin especialidades registradas.</p>
          )}
        </CardContent>
      </Card>

      {/* Zonas de trabajo */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Zonas de trabajo</h2>
          {worker.worker_service_areas && (worker.worker_service_areas as unknown[]).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(worker.worker_service_areas as Record<string, unknown>[]).map((area) => {
                const mun = area.municipalities as Record<string, unknown> | null;
                const prov = area.provinces as Record<string, unknown> | null;
                return (
                  <Badge key={area.id as string} variant="secondary">
                    {mun?.name as string ?? ""} · {prov?.name as string ?? ""}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin zonas registradas.</p>
          )}
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
          {worker.worker_documents && (worker.worker_documents as unknown[]).length > 0 ? (
            <div className="space-y-2">
              {(worker.worker_documents as Record<string, unknown>[]).map((doc) => (
                <div key={doc.id as string} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <p className="text-sm text-gray-700">{doc.document_type as string}</p>
                  <Badge variant={doc.status === "verified" ? "success" : "warning"}>
                    {doc.status === "verified" ? "Verificado" : "Pendiente"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin documentos registrados.</p>
          )}
        </CardContent>
      </Card>

      {/* Acciones administrativas */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Acciones administrativas</h2>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (obligatorio para rechazar o suspender)</Label>
            <Textarea
              id="reason"
              placeholder="Indica el motivo de la acción..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleAction("approved")} disabled={reviewWorker.isPending}>
              Aprobar
            </Button>
            <Button variant="destructive" onClick={() => handleAction("rejected")} disabled={reviewWorker.isPending}>
              Rechazar
            </Button>
            <Button variant="destructive" onClick={() => handleAction("suspended")} disabled={reviewWorker.isPending}>
              Suspender
            </Button>
            <Button variant="outline" onClick={() => handleAction("inactive")} disabled={reviewWorker.isPending}>
              Marcar inactivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
