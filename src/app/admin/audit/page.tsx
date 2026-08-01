"use client";

import { useAuditLogs } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton } from "@/components/ui/primitives";

export default function AdminAuditPage() {
  const { data: logsData, isLoading } = useAuditLogs();
  const logs = logsData?.data ?? [];

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
        <h1 className="text-2xl font-bold text-gray-900">Auditoría</h1>
        <p className="mt-1 text-sm text-gray-500">Registro de acciones sensibles del sistema</p>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay registros de auditoría</h2>
            <p className="mt-2 text-sm text-gray-500">Las acciones sensibles se registrarán aquí.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log: Record<string, unknown>) => (
            <Card key={log.id as string}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {log.action as string} · {log.entity as string}
                  </p>
                  <p className="text-xs text-gray-400">
                    {log.created_at ? new Date(log.created_at as string).toLocaleString("es-DO") : ""}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  Actor: {log.actor_id as string ?? "Sistema"}
                </p>
                {log.reason ? (
                  <p className="text-sm text-gray-500">Motivo: {log.reason as string}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
