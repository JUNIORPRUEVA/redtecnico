"use client";

import Link from "next/link";

import { useAuth } from "@/providers/auth-provider";
import { useWorkerProfile, useAvailableServices } from "@/hooks/use-queries";
import { Badge, Card, CardContent, Skeleton } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

const TYPE_LABELS: Record<string, string> = {
  instalacion: "Instalación",
  reparacion: "Reparación",
  mantenimiento: "Mantenimiento",
  levantamiento: "Levantamiento",
  soporte: "Soporte",
  otro: "Otro",
};

const PRIORITY_LABELS: Record<string, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  alta: { label: "Alta", variant: "destructive" },
  media: { label: "Media", variant: "warning" },
  baja: { label: "Baja", variant: "secondary" },
};

export default function ServicesPage() {
  const { user } = useAuth();
  const { data: profileData } = useWorkerProfile(user?.id);
  const { data: servicesData, isLoading } = useAvailableServices(profileData?.data?.id);

  const services = servicesData?.data ?? [];

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
        <h1 className="text-2xl font-bold text-gray-900">Servicios disponibles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Trabajos compatibles con tu perfil y zona
        </p>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No hay servicios disponibles</h2>
            <p className="mt-2 text-sm text-gray-500">
              Actualmente no hay trabajos compatibles con tu perfil. Vuelve a revisar más tarde.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {services.map((service: Record<string, unknown>) => {
            const priority = PRIORITY_LABELS[service.priority as string] ?? PRIORITY_LABELS.media;
            const specialties = service.specialties as Array<{ name: string }> | null;
            return (
              <Card key={service.id as string} className="transition-colors hover:border-blue-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">{service.code as string}</p>
                      <h2 className="mt-1 text-lg font-semibold text-gray-900">{service.title as string}</h2>
                    </div>
                    <Badge variant={priority.variant}>{priority.label}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{TYPE_LABELS[service.service_type as string] ?? (service.service_type as string)}</Badge>
                    {specialties?.map((s: { name: string }) => (
                      <Badge key={s.name} variant="outline">{s.name}</Badge>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-gray-600">
                    <p>📍 {service.municipality_name as string ?? "Zona por confirmar"} · {service.sector_name as string ?? "Sector"}</p>
                    <p>📅 {service.scheduled_date ? new Date(service.scheduled_date as string).toLocaleDateString("es-DO") : "Por definir"}</p>
                    <p>⏱️ Duración aprox: {service.estimated_duration ? `${service.estimated_duration as string} min` : "Por definir"}</p>
                    <p className="font-medium text-gray-900">
                      💰 {service.payment_offered ? `RD$ ${Number(service.payment_offered).toLocaleString("es-DO")}` : "Pago por definir"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link href={`/app/services/${service.id as string}`}>
                      <Button className="w-full">Ver detalle</Button>
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
