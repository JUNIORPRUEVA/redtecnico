import type { WorkerStatus, WorkerLevel, ServiceStatus } from "../types/database";


/**
 * Lógica de compatibilidad de servicios.
 * Determina si un colaborador puede ver/aceptar un servicio.
 */

export interface WorkerCompatibilityContext {
  status: WorkerStatus;
  isAvailable: boolean;
  workerType: "technician" | "helper" | "both";
  level: WorkerLevel | null;
  specialties: string[]; // IDs de especialidades autorizadas
  serviceAreas: string[]; // IDs de municipios donde trabaja
  canTravelOutside: boolean;
  maxDistanceKm: number | null;
}

export interface ServiceCompatibilityContext {
  status: ServiceStatus;
  requiredRole: "technician" | "helper" | "both";
  minLevel: WorkerLevel | null;
  requiredSpecialties: string[]; // IDs de especialidades requeridas
  municipalityId: string | null;
  provinceId: string | null;
  acceptDeadline: string | null;
  blockedWorkerIds: string[]; // IDs de colaboradores bloqueados
}

export interface CompatibilityResult {
  compatible: boolean;
  reasons: string[];
}

/**
 * Verifica si un colaborador es compatible con un servicio.
 */
export function isServiceCompatible(
  worker: WorkerCompatibilityContext,
  service: ServiceCompatibilityContext
): CompatibilityResult {
  const reasons: string[] = [];

  // 1. El perfil debe estar aprobado
  if (worker.status !== "approved") {
    reasons.push("Tu perfil debe estar aprobado para ver servicios.");
  }

  // 2. Debe estar activo/disponible
  if (!worker.isAvailable) {
    reasons.push("Debes estar disponible para ver servicios.");
  }

  // 3. Debe cumplir el rol requerido
  if (service.requiredRole === "technician" && worker.workerType === "helper") {
    reasons.push("Este servicio requiere un técnico.");
  }
  if (service.requiredRole === "helper" && worker.workerType === "technician") {
    reasons.push("Este servicio requiere un ayudante.");
  }

  // 4. Debe poseer al menos una especialidad requerida
  if (service.requiredSpecialties.length > 0) {
    const hasSpecialty = service.requiredSpecialties.some((s) =>
      worker.specialties.includes(s)
    );
    if (!hasSpecialty) {
      reasons.push("No posees las especialidades requeridas para este servicio.");
    }
  }

  // 5. Debe cumplir el nivel mínimo
  if (service.minLevel && worker.level) {
    if (levelRank(worker.level) < levelRank(service.minLevel)) {
      reasons.push("Tu nivel no cumple el mínimo requerido para este servicio.");
    }
  }

  // 6. Zona de trabajo
  if (service.municipalityId && !worker.canTravelOutside) {
    if (!worker.serviceAreas.includes(service.municipalityId)) {
      reasons.push("Este servicio está fuera de tus zonas de trabajo.");
    }
  }

  // 7. No debe estar bloqueado
  if (service.blockedWorkerIds.length > 0) {
    // El bloqueo se evalúa por worker_id en la capa de datos
  }

  // 8. No debe haber expirado
  if (service.acceptDeadline) {
    const deadline = new Date(service.acceptDeadline);
    if (deadline < new Date()) {
      reasons.push("La fecha límite para aceptar este servicio ya venció.");
    }
  }

  return {
    compatible: reasons.length === 0,
    reasons,
  };
}

/**
 * Ordena los niveles de menor a mayor.
 */
function levelRank(level: WorkerLevel): number {
  const ranks: Record<WorkerLevel, number> = {
    aprendiz: 1,
    basico: 2,
    intermedio: 3,
    avanzado: 4,
    especialista: 5,
  };
  return ranks[level] ?? 0;
}

/**
 * Calcula la distancia aproximada entre dos coordenadas (fórmula de Haversine).
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
