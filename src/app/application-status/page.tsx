"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, Badge, Card, CardContent } from "@/components/ui/primitives";
import { getApplicationStatus } from "@/services/worker";

const STATUS_LABELS: Record<string, { label: string; variant: "warning" | "success" | "destructive" | "secondary" }> = {
  pending_review: { label: "En revisión", variant: "warning" },
  approved: { label: "Aprobado", variant: "success" },
  rejected: { label: "Rechazado", variant: "destructive" },
  suspended: { label: "Suspendido", variant: "destructive" },
  inactive: { label: "Inactivo", variant: "secondary" },
};

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data, error } = await getApplicationStatus(email);

    if (error || !data) {
      setError("No encontramos una solicitud con ese correo. Verifica e intenta de nuevo.");
      setIsLoading(false);
      return;
    }

    setStatus(data.status);
    setRejectionReason(data.rejection_reason);
    setIsLoading(false);
  }

  const statusInfo = status ? STATUS_LABELS[status] : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Estado de mi solicitud</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta el estado de tu registro en la Red Técnico Fulltech.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Consultando..." : "Consultar estado"}
          </Button>
        </form>

        {statusInfo && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Estado de tu solicitud</span>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              {status === "pending_review" && (
                <p className="mt-4 text-sm text-gray-600">
                  Tu solicitud está siendo revisada por el equipo de FULLTECH. Te
                  notificaremos cuando haya una actualización.
                </p>
              )}
              {status === "approved" && (
                <p className="mt-4 text-sm text-gray-600">
                  ¡Tu perfil fue aprobado! Ya puedes iniciar sesión y ver los
                  servicios disponibles.
                </p>
              )}
              {status === "rejected" && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Tu solicitud no fue aprobada en esta ocasión.</p>
                  {rejectionReason && (
                    <p className="mt-2 rounded-lg bg-red-50 p-3 text-red-700">
                      <strong>Motivo:</strong> {rejectionReason}
                    </p>
                  )}
                </div>
              )}
              {status === "suspended" && (
                <p className="mt-4 text-sm text-gray-600">
                  Tu perfil está suspendido. Contacta al equipo de FULLTECH para más información.
                </p>
              )}
              {status === "inactive" && (
                <p className="mt-4 text-sm text-gray-600">
                  Tu perfil está inactivo. Contacta al equipo de FULLTECH para reactivarlo.
                </p>
              )}
              <Link href="/login" className="mt-6 inline-block w-full">
                <Button className="w-full" variant="outline">Ir a iniciar sesión</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
