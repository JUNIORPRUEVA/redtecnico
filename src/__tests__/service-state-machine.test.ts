import { describe, it, expect } from "vitest";
import {
  canTransition,
  getAllowedTransitions,
  getTransitionDescription,
  ACTIVE_SERVICE_STATUSES,
  AVAILABLE_SERVICE_STATUSES,
} from "../domain/service-state-machine";


describe("Máquina de estados del servicio", () => {
  describe("canTransition", () => {
    it("permite a un admin publicar un borrador", () => {
      expect(canTransition("draft", "published", "admin")).toBe(true);
      expect(canTransition("draft", "published", "super_admin")).toBe(true);
    });

    it("no permite a un técnico publicar un borrador", () => {
      expect(canTransition("draft", "published", "technician")).toBe(false);
      expect(canTransition("draft", "published", "helper")).toBe(false);
    });

    it("permite a un técnico aceptar un trabajo asignado", () => {
      expect(canTransition("assigned", "accepted", "technician")).toBe(true);
      expect(canTransition("assigned", "accepted", "helper")).toBe(true);
    });

    it("no permite a un técnico aprobar la finalización", () => {
      expect(canTransition("submitted_for_review", "completed", "technician")).toBe(false);
    });

    it("permite a un admin aprobar la finalización", () => {
      expect(canTransition("submitted_for_review", "completed", "admin")).toBe(true);
      expect(canTransition("submitted_for_review", "completed", "super_admin")).toBe(true);
    });

    it("permite a un admin solicitar corrección", () => {
      expect(canTransition("submitted_for_review", "correction_requested", "admin")).toBe(true);
    });

    it("permite a un técnico reenviar un servicio corregido", () => {
      expect(canTransition("correction_requested", "submitted_for_review", "technician")).toBe(true);
    });

    it("no permite transiciones arbitrarias", () => {
      expect(canTransition("draft", "completed", "admin")).toBe(false);
      expect(canTransition("published", "in_progress", "technician")).toBe(false);
      expect(canTransition("accepted", "completed", "technician")).toBe(false);
    });

    it("permite la secuencia completa de ejecución del técnico", () => {
      expect(canTransition("accepted", "on_the_way", "technician")).toBe(true);
      expect(canTransition("on_the_way", "arrived", "technician")).toBe(true);
      expect(canTransition("arrived", "in_progress", "technician")).toBe(true);
      expect(canTransition("in_progress", "pending_evidence", "technician")).toBe(true);
      expect(canTransition("pending_evidence", "submitted_for_review", "technician")).toBe(true);
    });

    it("requiere razón para cancelaciones", () => {
      const cancel = getAllowedTransitions("published", "admin").find(
        (t) => t.to === "cancelled"
      );
      expect(cancel?.requiresReason).toBe(true);
    });
  });

  describe("getAllowedTransitions", () => {
    it("devuelve las transiciones permitidas para un rol", () => {
      const transitions = getAllowedTransitions("assigned", "technician");
      expect(transitions.some((t) => t.to === "accepted")).toBe(true);
    });

    it("no devuelve transiciones de admin para un técnico", () => {
      const transitions = getAllowedTransitions("draft", "technician");
      expect(transitions.length).toBe(0);
    });
  });

  describe("getTransitionDescription", () => {
    it("devuelve la descripción de una transición válida", () => {
      expect(getTransitionDescription("draft", "published", "admin")).toBe("Publicar servicio");
    });

    it("devuelve null para una transición no permitida", () => {
      expect(getTransitionDescription("draft", "published", "technician")).toBeNull();
    });
  });

  describe("Estados constantes", () => {
    it("incluye los estados activos esperados", () => {
      expect(ACTIVE_SERVICE_STATUSES).toContain("in_progress");
      expect(ACTIVE_SERVICE_STATUSES).toContain("submitted_for_review");
      expect(ACTIVE_SERVICE_STATUSES).not.toContain("completed");
    });

    it("incluye los estados disponibles esperados", () => {
      expect(AVAILABLE_SERVICE_STATUSES).toContain("published");
      expect(AVAILABLE_SERVICE_STATUSES).toContain("receiving_applications");
    });
  });
});
