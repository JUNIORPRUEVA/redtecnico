"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServiceDetail, useServiceStatusHistory, useServiceChecklist, useServiceCompletionReport } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton, Label, Textarea, Separator } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { transitionServiceStatus, submitCompletionReport } from "@/services/services";

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

// Transiciones permitidas para el colaborador
const WORKER_TRANSITIONS: Record<string, string[]> = {
  assigned: ["accepted"],
  accepted: ["on_the_way"],
  on_the_way: ["arrived"],
  arrived: ["in_progress"],
  in_progress: ["paused", "pending_evidence"],
  paused: ["in_progress"],
  pending_evidence: ["submitted_for_review"],
  correction_requested: ["submitted_for_review"],
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: serviceData, isLoading } = useServiceDetail(params.id);
  const { data: historyData } = useServiceStatusHistory(params.id);
  const { data: checklistData } = useServiceChecklist(params.id);
  const { data: reportData } = useServiceCompletionReport(params.id);

  const [showReport, setShowReport] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reporte
  const [summary, setSummary] = useState("");
  const [result, setResult] = useState("resuelto");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [solution, setSolution] = useState("");
  const [observations, setObservations] = useState("");
  const [receivedBy, setReceivedBy] = useState("");

  const service = serviceData?.data;
  const history = historyData?.data ?? [];
  const checklist = checklistData?.data ?? [];
  const report = reportData?.data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-xl font-bold text-gray-900">Trabajo no encontrado</h1>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/app/jobs")}>
          Volver a mis trabajos
        </Button>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[service.status] ?? STATUS_LABELS.assigned;
  const allowedTransitions = WORKER_TRANSITIONS[service.status] ?? [];

  async function handleTransition(toStatus: string) {
    setError(null);
    setSuccess(null);
    setIsTransitioning(true);
    const { data: transData, error } = await transitionServiceStatus(service.id, toStatus);
    setIsTransitioning(false);
    if (error) {
      setError(error.message ?? "No se pudo cambiar el estado.");
      return;
    }
    if (transData && transData.success === false) {
      setError(transData.error ?? "No se pudo cambiar el estado.");
      return;
    }

    setSuccess("Estado actualizado correctamente.");
    router.refresh();
  }

  async function handleSubmitReport() {
    setError(null);
    setSuccess(null);

    // Validar campos obligatorios
    if (!summary.trim()) {
      setError("El resumen del trabajo realizado es obligatorio.");
      return;
    }
    if (!startTime || !endTime) {
      setError("Debes indicar la hora de inicio y finalización.");
      return;
    }

    setIsTransitioning(true);
    const { error } = await submitCompletionReport({


      service_id: service.id,
      summary,
      result,
      start_time: startTime,
      end_time: endTime,
      diagnosis,
      solution,
      observations,
      received_by: receivedBy,
    });
    setIsTransitioning(false);

    if (error) {
      setError(error.message ?? "No se pudo enviar el reporte.");
      return;
    }

    // Cambiar estado a submitted_for_review
    const { data: transData, error: transError } = await transitionServiceStatus(service.id, "submitted_for_review");
    if (transError || (transData && transData.success === false)) {
      setError("El reporte se guardó, pero no se pudo actualizar el estado.");
      return;
    }

    setSuccess("Reporte enviado. FULLTECH revisará la información.");
    setShowReport(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-500">{service.code}</p>
        <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
        <div className="mt-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Datos del cliente (visibles tras asignación) */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Datos del trabajo</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📍 {service.municipality_name ?? "Zona"} · {service.sector_name ?? "Sector"}</p>
            <p>📅 {service.scheduled_date ? new Date(service.scheduled_date).toLocaleDateString("es-DO") : "Por definir"}</p>
            <p className="font-medium text-gray-900">
              💰 {service.payment_offered ? `RD$ ${service.payment_offered.toLocaleString("es-DO")}` : "Pago por definir"}
            </p>
          </div>
          {service.visible_instructions && (
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">Instrucciones</p>
              <p className="mt-1 text-sm text-blue-800">{service.visible_instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transiciones de estado */}
      {allowedTransitions.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Actualizar estado</h2>
            <div className="flex flex-wrap gap-2">
              {allowedTransitions.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  onClick={() => handleTransition(t)}
                  disabled={isTransitioning}
                >
                  {STATUS_LABELS[t]?.label ?? t}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reporte de finalización */}
      {service.status === "in_progress" && !showReport && (
        <Button className="w-full" size="lg" onClick={() => setShowReport(true)}>
          Enviar reporte de finalización
        </Button>
      )}

      {showReport && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Reporte de finalización</h2>

            <div className="space-y-2">
              <Label htmlFor="summary">Resumen del trabajo realizado *</Label>
              <Textarea
                id="summary"
                placeholder="Describe brevemente el trabajo realizado..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result">Resultado</Label>
              <select
                id="result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
              >
                <option value="resuelto">Resuelto</option>
                <option value="parcialmente_resuelto">Parcialmente resuelto</option>
                <option value="no_resuelto">No resuelto</option>
                <option value="requiere_visita_adicional">Requiere visita adicional</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de inicio *</Label>
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de finalización *</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea id="diagnosis" placeholder="Diagnóstico del problema..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution">Solución aplicada</Label>
              <Textarea id="solution" placeholder="Solución aplicada..." value={solution} onChange={(e) => setSolution(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea id="observations" placeholder="Observaciones adicionales..." value={observations} onChange={(e) => setObservations(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedBy">Nombre de quien recibió</Label>
              <Input id="receivedBy" placeholder="Nombre de la persona que recibió el trabajo" value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowReport(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSubmitReport} disabled={isTransitioning}>
                {isTransitioning ? "Enviando..." : "Enviar reporte"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reporte existente */}
      {report && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Reporte enviado</h2>
            <p className="text-sm text-gray-600">{report.summary}</p>
            <p className="text-sm text-gray-500">Resultado: {report.result}</p>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {checklist.length > 0 && (
        <Card>
          <CardContent className="space-y-2 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Checklist del servicio</h2>
            {checklist.map((item: Record<string, unknown>) => (
              <div key={item.id as string} className="flex items-center gap-2 text-sm text-gray-700">
                <span>•</span>
                <span>{item.label as string}</span>
              </div>
            ))}

          </CardContent>
        </Card>
      )}

      {/* Línea de tiempo */}
      {history.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
            <Separator />
            <div className="space-y-3">
              {history.map((h: Record<string, unknown>) => (
                <div key={h.id as string} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {STATUS_LABELS[h.to_status as string]?.label ?? (h.to_status as string)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {h.created_at ? new Date(h.created_at as string).toLocaleString("es-DO") : ""}
                    </p>
                    {h.reason ? <p className="text-xs text-gray-600">Motivo: {String(h.reason)}</p> : null}


                  </div>
                </div>
              ))}

            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
