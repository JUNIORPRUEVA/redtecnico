"use client";

import { useAllSpecialties } from "@/hooks/use-queries";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui/primitives";

export default function AdminSpecialtiesPage() {
  const { data: specialtiesData, isLoading } = useAllSpecialties();
  const specialties = specialtiesData?.data ?? [];

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
        <h1 className="text-2xl font-bold text-gray-900">Especialidades</h1>
        <p className="mt-1 text-sm text-gray-500">Catálogo de especialidades disponibles</p>
      </div>

      {specialties.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No hay especialidades</h2>
            <p className="mt-2 text-sm text-gray-500">Las especialidades se cargan desde la base de datos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((s: Record<string, unknown>) => (
            <Card key={s.id as string} className="transition-colors hover:border-blue-300">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h2 className="font-semibold text-gray-900">{s.name as string}</h2>
                  {s.description ? (
                    <p className="mt-1 text-sm text-gray-500">{s.description as string}</p>
                  ) : null}
                </div>
                <Badge variant={s.is_active ? "success" : "secondary"}>
                  {s.is_active ? "Activa" : "Inactiva"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
