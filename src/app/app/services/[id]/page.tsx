"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useWorkerProfile, useServiceDetail, useAcceptService, useApplyToService } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton, Label, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TYPE_LABELS: Record<string, string> = {
  instalacion: "Instalación",
  reparacion: "Reparación",
  mantenimiento: "Mantenimiento",
  levantamiento: "Levantamiento",
  soporte: "Soporte",
  otro: "Otro",
};

const MODALITY_LABELS: Record<string, string> = {
  direct_acceptance: "Aceptación directa",
  application: "Por solicitud",
  private_assignment: "Asignación privada",
};

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: profileData } = useWorkerProfile(user?.id);
  const { data: serviceData, isLoading } = useServiceDetail(params.id);
  const acceptService = useAcceptService();
  const applyToService = useApplyToService();

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [message, setMessage] = useState("");
  const [eta, setEta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const service = serviceData?.data;

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
        <h1 className="text-xl font-bold text-gray-900">Servicio no disponible</h1>
        <p className="mt-2 text-sm text-gray-600">Este servicio ya no está disponible o no es compatible con tu perfil.</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/app/services")}>
          Volver a servicios
        </Button>
      </div>
    );
  }

  async function handleAccept() {
    setError(null);
    const { error } = await acceptService.mutateAsync({
      serviceId: service.id,
      workerId: profileData?.data?.id,
    });
    if (error) {
      setError(error.message ?? "No se pudo aceptar el servicio.");
      return;
    }
    router.push("/app/jobs");
  }

  async function handleApply() {
    setError(null);
    const { error } = await applyToService.mutateAsync({
      serviceId: service.id,
      workerId: profileData?.data?.id,
      application: {
        message,
        estimated_arrival: eta,
        has_tools: true,
        is_available: true,
        proposed_helper: false,
      },
    });
    if (error) {
      setError(error.message ?? "No se pudo enviar la solicitud.");
      return;
    }
    router.push("/app/jobs");
  }


  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-gray-500">{service.code}</p>
        <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{TYPE_LABELS[service.service_type] ?? service.service_type}</Badge>
            <Badge variant="outline">{MODALITY_LABELS[service.assignment_mode] ?? service.assignment_mode}</Badge>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>📍 {service.municipality_name ?? "Zona por confirmar"} · {service.sector_name ?? "Sector"}</p>
            <p>📅 {service.scheduled_date ? new Date(service.scheduled_date).toLocaleDateString("es-DO") : "Por definir"}</p>
            <p>⏱️ Duración aprox: {service.estimated_duration ? `${service.estimated_duration} min` : "Por definir"}</p>
            <p className="font-medium text-gray-900">
              💰 {service.payment_offered ? `RD$ ${service.payment_offered.toLocaleString("es-DO")}` : "Pago por definir"}
            </p>
          </div>

          {service.description && (
            <div>
              <p className="text-sm font-medium text-gray-900">Descripción</p>
              <p className="mt-1 text-sm text-gray-600">{service.description}</p>
            </div>
          )}

          {service.visible_instructions && (
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">Instrucciones</p>
              <p className="mt-1 text-sm text-blue-800">{service.visible_instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      {service.assignment_mode === "direct_acceptance" && (
        <Button className="w-full" size="lg" onClick={handleAccept} disabled={acceptService.isPending}>
          {acceptService.isPending ? "Aceptando..." : "Aceptar servicio"}
        </Button>
      )}

      {service.assignment_mode === "application" && !showApplyForm && (
        <Button className="w-full" size="lg" onClick={() => setShowApplyForm(true)}>
          Solicitar asignación
        </Button>
      )}

      {service.assignment_mode === "application" && showApplyForm && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Solicitar asignación</h2>
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje breve (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Cuéntanos por qué eres la persona indicada..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eta">Hora estimada de llegada</Label>
              <Input
                id="eta"
                type="time"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowApplyForm(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleApply} disabled={applyToService.isPending}>
                {applyToService.isPending ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {service.assignment_mode === "private_assignment" && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
          Este servicio se asigna directamente por el administrador.
        </div>
      )}
    </div>
  );
}
