import type { ServiceStatus, UserRole } from "../types/database";


/**
 * Máquina de estados del servicio.
 * Define las transiciones permitidas por rol.
 */

export interface Transition {
  from: ServiceStatus;
  to: ServiceStatus;
  allowedRoles: UserRole[];
  requiresReason?: boolean;
  description: string;
}

export const SERVICE_TRANSITIONS: Transition[] = [
  // Administración
  { from: "draft", to: "published", allowedRoles: ["admin", "super_admin"], description: "Publicar servicio" },
  { from: "draft", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar borrador" },
  { from: "published", to: "receiving_applications", allowedRoles: ["admin", "super_admin"], description: "Abrir solicitudes" },
  { from: "published", to: "assigned", allowedRoles: ["admin", "super_admin"], description: "Asignar directamente" },
  { from: "published", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "receiving_applications", to: "assigned", allowedRoles: ["admin", "super_admin"], description: "Asignar tras solicitudes" },
  { from: "receiving_applications", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "published", to: "expired", allowedRoles: ["admin", "super_admin"], description: "Marcar expirado" },
  { from: "receiving_applications", to: "expired", allowedRoles: ["admin", "super_admin"], description: "Marcar expirado" },

  // Aceptación atómica (direct_acceptance) — el sistema asigna
  { from: "published", to: "assigned", allowedRoles: ["technician", "helper"], description: "Aceptación directa" },

  // Colaborador asignado
  { from: "assigned", to: "accepted", allowedRoles: ["technician", "helper"], description: "Aceptar trabajo" },
  { from: "assigned", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar asignación" },

  // Ejecución
  { from: "accepted", to: "on_the_way", allowedRoles: ["technician", "helper"], description: "En camino" },
  { from: "on_the_way", to: "arrived", allowedRoles: ["technician", "helper"], description: "Llegó al lugar" },
  { from: "arrived", to: "in_progress", allowedRoles: ["technician", "helper"], description: "Iniciar trabajo" },
  { from: "in_progress", to: "paused", allowedRoles: ["technician", "helper"], description: "Pausar trabajo" },
  { from: "paused", to: "in_progress", allowedRoles: ["technician", "helper"], description: "Reanudar trabajo" },
  { from: "in_progress", to: "pending_evidence", allowedRoles: ["technician", "helper"], description: "Subir evidencias" },
  { from: "pending_evidence", to: "submitted_for_review", allowedRoles: ["technician", "helper"], description: "Enviar para revisión" },

  // Revisión administrativa
  { from: "submitted_for_review", to: "completed", allowedRoles: ["admin", "super_admin"], description: "Aprobar finalización" },
  { from: "submitted_for_review", to: "correction_requested", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Solicitar corrección" },
  { from: "correction_requested", to: "submitted_for_review", allowedRoles: ["technician", "helper"], description: "Reenviar corregido" },
  { from: "correction_requested", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },

  // Cancelaciones generales
  { from: "accepted", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "on_the_way", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "arrived", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "in_progress", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "paused", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
  { from: "pending_evidence", to: "cancelled", allowedRoles: ["admin", "super_admin"], requiresReason: true, description: "Cancelar servicio" },
];

/**
 * Verifica si una transición de estado es permitida para un rol.
 */
export function canTransition(
  from: ServiceStatus,
  to: ServiceStatus,
  role: UserRole
): boolean {
  return SERVICE_TRANSITIONS.some(
    (t) => t.from === from && t.to === to && t.allowedRoles.includes(role)
  );
}

/**
 * Obtiene las transiciones permitidas desde un estado para un rol.
 */
export function getAllowedTransitions(
  from: ServiceStatus,
  role: UserRole
): Transition[] {
  return SERVICE_TRANSITIONS.filter(
    (t) => t.from === from && t.allowedRoles.includes(role)
  );
}

/**
 * Obtiene la descripción de una transición.
 */
export function getTransitionDescription(
  from: ServiceStatus,
  to: ServiceStatus,
  role: UserRole
): string | null {
  const transition = SERVICE_TRANSITIONS.find(
    (t) => t.from === from && t.to === to && t.allowedRoles.includes(role)
  );
  return transition?.description ?? null;
}

/**
 * Estados en los que el servicio está "activo" (en ejecución).
 */
export const ACTIVE_SERVICE_STATUSES: ServiceStatus[] = [
  "assigned",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "paused",
  "pending_evidence",
  "submitted_for_review",
  "correction_requested",
];

/**
 * Estados visibles para el colaborador como "trabajos activos".
 */
export const WORKER_ACTIVE_STATUSES: ServiceStatus[] = [
  "assigned",
  "accepted",
  "on_the_way",
  "arrived",
  "in_progress",
  "paused",
  "pending_evidence",
  "submitted_for_review",
  "correction_requested",
];

/**
 * Estados visibles para el colaborador como "disponibles".
 */
export const AVAILABLE_SERVICE_STATUSES: ServiceStatus[] = [
  "published",
  "receiving_applications",
];
