"use client";

import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useMyNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = notificationsData?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="mt-1 text-sm text-gray-500">Mantente al día con tus novedades</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllAsRead.mutate()}>
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No tienes notificaciones</h2>
            <p className="mt-2 text-sm text-gray-500">
              Aquí verás novedades sobre tu perfil, servicios y pagos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n: Record<string, unknown>) => (
            <Card
              key={n.id as string}
              className={`transition-colors ${n.is_read ? "opacity-70" : "border-blue-200"}`}
            >
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{n.title as string}</p>
                    {!n.is_read && <Badge variant="info">Nuevo</Badge>}
                  </div>
                  {n.body ? <p className="mt-1 text-sm text-gray-600">{n.body as string}</p> : null}
                  <p className="mt-1 text-xs text-gray-400">
                    {n.created_at ? new Date(n.created_at as string).toLocaleString("es-DO") : ""}
                  </p>
                </div>
                {!n.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead.mutate(n.id as string)}
                  >
                    Marcar leída
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}
