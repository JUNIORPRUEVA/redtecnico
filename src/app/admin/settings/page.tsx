"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/primitives";

export default function AdminSettingsPage() {
  const { role } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Ajustes generales del sistema</p>
      </div>

      {role !== "super_admin" ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600">
              Solo el super administrador puede gestionar la configuración crítica del sistema.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Zona horaria</h2>
              <p className="text-sm text-gray-600">America/Santo_Domingo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Moneda</h2>
              <p className="text-sm text-gray-600">Peso dominicano (RD$)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Idioma</h2>
              <p className="text-sm text-gray-600">Español</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
              <p className="text-sm text-gray-600">
                Row Level Security activo en todas las tablas sensibles.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
