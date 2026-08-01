import { describe, it, expect } from "vitest";
import {
  isServiceCompatible,
  haversineDistance,
  type WorkerCompatibilityContext,
  type ServiceCompatibilityContext,
} from "../domain/service-compatibility";


const approvedWorker: WorkerCompatibilityContext = {
  status: "approved",
  isAvailable: true,
  workerType: "technician",
  level: "intermedio",
  specialties: ["spec-camaras", "spec-redes"],
  serviceAreas: ["mun-higuey"],
  canTravelOutside: false,
  maxDistanceKm: null,
};

const compatibleService: ServiceCompatibilityContext = {
  status: "published",
  requiredRole: "technician",
  minLevel: "basico",
  requiredSpecialties: ["spec-camaras"],
  municipalityId: "mun-higuey",
  provinceId: "prov-altagracia",
  acceptDeadline: null,
  blockedWorkerIds: [],
};

describe("Compatibilidad de servicios", () => {
  it("un técnico aprobado y compatible puede ver el servicio", () => {
    const result = isServiceCompatible(approvedWorker, compatibleService);
    expect(result.compatible).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("un perfil pendiente no puede ver servicios", () => {
    const worker = { ...approvedWorker, status: "pending_review" as const };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("aprobado"))).toBe(true);
  });

  it("un perfil suspendido no puede ver servicios", () => {
    const worker = { ...approvedWorker, status: "suspended" as const };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
  });

  it("un técnico no disponible no puede ver servicios", () => {
    const worker = { ...approvedWorker, isAvailable: false };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("disponible"))).toBe(true);
  });

  it("un ayudante no puede ver un servicio que requiere técnico", () => {
    const worker = { ...approvedWorker, workerType: "helper" as const };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("técnico"))).toBe(true);
  });

  it("un técnico no puede ver un servicio que requiere ayudante", () => {
    const service = { ...compatibleService, requiredRole: "helper" as const };
    const result = isServiceCompatible(approvedWorker, service);
    expect(result.compatible).toBe(false);
  });

  it("un técnico sin la especialidad requerida no puede ver el servicio", () => {
    const worker = { ...approvedWorker, specialties: ["spec-alarmas"] };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("especialidades"))).toBe(true);
  });

  it("un técnico con nivel inferior al mínimo no puede ver el servicio", () => {
    const worker = { ...approvedWorker, level: "aprendiz" as const };
    const service = { ...compatibleService, minLevel: "intermedio" as const };
    const result = isServiceCompatible(worker, service);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("nivel"))).toBe(true);
  });

  it("un técnico sin desplazamiento fuera de su zona no puede ver el servicio", () => {
    const worker = { ...approvedWorker, serviceAreas: ["mun-otro"] };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("zonas"))).toBe(true);
  });

  it("un técnico que puede viajar fuera puede ver servicios de otras zonas", () => {
    const worker = { ...approvedWorker, canTravelOutside: true, serviceAreas: [] };
    const result = isServiceCompatible(worker, compatibleService);
    expect(result.compatible).toBe(true);
  });

  it("un servicio con fecha límite vencida no es compatible", () => {
    const service = {
      ...compatibleService,
      acceptDeadline: new Date(Date.now() - 1000).toISOString(),
    };
    const result = isServiceCompatible(approvedWorker, service);
    expect(result.compatible).toBe(false);
    expect(result.reasons.some((r) => r.includes("venció"))).toBe(true);
  });

  it("un servicio con fecha límite futura es compatible", () => {
    const service = {
      ...compatibleService,
      acceptDeadline: new Date(Date.now() + 86400000).toISOString(),
    };
    const result = isServiceCompatible(approvedWorker, service);
    expect(result.compatible).toBe(true);
  });
});

describe("haversineDistance", () => {
  it("devuelve 0 para el mismo punto", () => {
    expect(haversineDistance(18.5, -68.7, 18.5, -68.7)).toBeCloseTo(0, 1);
  });

  it("calcula una distancia razonable entre dos puntos", () => {
    // Higüey a Punta Cana (~50 km)
    const dist = haversineDistance(18.6157, -68.7079, 18.5818, -68.4043);
    expect(dist).toBeGreaterThan(20);
    expect(dist).toBeLessThan(80);
  });
});
