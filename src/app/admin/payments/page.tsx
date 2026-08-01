"use client";

import { useAllPayments } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui/primitives";

const STATUS_LABELS: Record<string, { label: string; variant: "warning" | "success" | "info" | "destructive" | "secondary" }> = {
  pendiente: { label: "Pendiente", variant: "warning" },
  aprobado: { label: "Aprobado", variant: "info" },
  programado: { label: "Programado", variant: "secondary" },
  pagado: { label: "Pagado", variant: "success" },
  rechazado: { label: "Rechazado", variant: "destructive" },
};

export default function AdminPaymentsPage() {
  const { data: paymentsData, isLoading } = useAllPayments();
  const payments = paymentsData?.data ?? [];

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
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <p className="mt-1 text-sm text-gray-500">Registra y gestiona los pagos a colaboradores</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay pagos registrados</h2>
            <p className="mt-2 text-sm text-gray-500">Los pagos a colaboradores aparecerán aquí.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p: Record<string, unknown>) => {
            const status = STATUS_LABELS[p.status as string] ?? STATUS_LABELS.pendiente;
            return (
              <Card key={p.id as string} className="transition-colors hover:border-blue-300">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900">
                      RD$ {p.total_amount ? Number(p.total_amount).toLocaleString("es-DO") : "0"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {p.created_at ? new Date(p.created_at as string).toLocaleDateString("es-DO") : ""}
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
