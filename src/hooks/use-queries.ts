"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as workerService from "@/services/worker";
import * as servicesService from "@/services/services";
import * as catalogService from "@/services/catalog";
import * as adminService from "@/services/admin";
import * as notificationsService from "@/services/notifications";

/* ============================================
   Catálogos
   ============================================ */
export function useProvinces() {
  return useQuery({ queryKey: ["provinces"], queryFn: catalogService.getProvinces });
}

export function useMunicipalities(provinceId?: string) {
  return useQuery({
    queryKey: ["municipalities", provinceId],
    queryFn: () => catalogService.getMunicipalities(provinceId),
    enabled: true,
  });
}

export function useSectors(municipalityId?: string) {
  return useQuery({
    queryKey: ["sectors", municipalityId],
    queryFn: () => catalogService.getSectors(municipalityId),
    enabled: true,
  });
}

export function useSpecialties() {
  return useQuery({ queryKey: ["specialties"], queryFn: catalogService.getSpecialties });
}

export function useAllSpecialties() {
  return useQuery({ queryKey: ["all-specialties"], queryFn: catalogService.getAllSpecialties });
}

export function useWorkerDocumentTypes() {
  return useQuery({ queryKey: ["document-types"], queryFn: catalogService.getWorkerDocumentTypes });
}

/* ============================================
   Perfil de colaborador
   ============================================ */
export function useWorkerProfile(userId?: string) {
  return useQuery({
    queryKey: ["worker-profile", userId],
    queryFn: () => workerService.getWorkerProfile(userId!),
    enabled: !!userId,
  });
}

export function useWorkerSpecialties(workerId?: string) {
  return useQuery({
    queryKey: ["worker-specialties", workerId],
    queryFn: () => workerService.getWorkerSpecialties(workerId!),
    enabled: !!workerId,
  });
}

export function useWorkerServiceAreas(workerId?: string) {
  return useQuery({
    queryKey: ["worker-areas", workerId],
    queryFn: () => workerService.getWorkerServiceAreas(workerId!),
    enabled: !!workerId,
  });
}

export function useWorkerDocuments(workerId?: string) {
  return useQuery({
    queryKey: ["worker-documents", workerId],
    queryFn: () => workerService.getWorkerDocuments(workerId!),
    enabled: !!workerId,
  });
}

export function useWorkerRatings(workerId?: string) {
  return useQuery({
    queryKey: ["worker-ratings", workerId],
    queryFn: () => workerService.getWorkerRatings(workerId!),
    enabled: !!workerId,
  });
}

export function useWorkerPayments(workerId?: string) {
  return useQuery({
    queryKey: ["worker-payments", workerId],
    queryFn: () => workerService.getWorkerPayments(workerId!),
    enabled: !!workerId,
  });
}

export function useUpdateWorkerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workerId, updates }: { workerId: string; updates: Record<string, unknown> }) =>
      workerService.updateWorkerProfile(workerId, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["worker-profile"] }),
  });
}

export function useSetAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workerId, isAvailable }: { workerId: string; isAvailable: boolean }) =>
      workerService.setAvailability(workerId, isAvailable),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["worker-profile"] }),
  });
}

/* ============================================
   Servicios
   ============================================ */
export function useAvailableServices(workerId?: string) {
  return useQuery({
    queryKey: ["available-services", workerId],
    queryFn: () => servicesService.getAvailableServices(workerId!),
    enabled: !!workerId,
  });
}

export function useMyAssignedServices(workerId?: string) {
  return useQuery({
    queryKey: ["my-assigned-services", workerId],
    queryFn: () => servicesService.getMyAssignedServices(workerId!),
    enabled: !!workerId,
  });
}

export function useService(serviceId?: string) {
  return useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => servicesService.getServiceById(serviceId!),
    enabled: !!serviceId,
  });
}

export function useServiceDetail(serviceId?: string) {
  return useQuery({
    queryKey: ["service-detail", serviceId],
    queryFn: () => servicesService.getServiceById(serviceId!),
    enabled: !!serviceId,
  });
}

export function useAcceptService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, workerId }: { serviceId: string; workerId: string }) =>
      servicesService.acceptService(serviceId, workerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["available-services"] });
      qc.invalidateQueries({ queryKey: ["my-assigned-services"] });
    },
  });
}


export function useAllServices() {
  return useQuery({ queryKey: ["all-services"], queryFn: servicesService.getAllServices });
}

export function useServiceStatusHistory(serviceId?: string) {
  return useQuery({
    queryKey: ["service-history", serviceId],
    queryFn: () => servicesService.getServiceStatusHistory(serviceId!),
    enabled: !!serviceId,
  });
}

export function useServiceComments(serviceId?: string) {
  return useQuery({
    queryKey: ["service-comments", serviceId],
    queryFn: () => servicesService.getServiceComments(serviceId!),
    enabled: !!serviceId,
  });
}

export function useServiceChecklist(serviceId?: string) {
  return useQuery({
    queryKey: ["service-checklist", serviceId],
    queryFn: () => servicesService.getServiceChecklist(serviceId!),
    enabled: !!serviceId,
  });
}

export function useServiceAttachments(serviceId?: string) {
  return useQuery({
    queryKey: ["service-attachments", serviceId],
    queryFn: () => servicesService.getServiceAttachments(serviceId!),
    enabled: !!serviceId,
  });
}

export function useServiceCompletionReport(serviceId?: string) {
  return useQuery({
    queryKey: ["service-report", serviceId],
    queryFn: () => servicesService.getServiceCompletionReport(serviceId!),
    enabled: !!serviceId,
  });
}

export function useAddServiceComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, content }: { serviceId: string; content: string }) =>
      servicesService.addServiceComment(serviceId, content),
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: ["service-comments", variables.serviceId] }),
  });
}

export function useApplyToService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      workerId,
      application,
    }: {
      serviceId: string;
      workerId: string;
      application: Parameters<typeof servicesService.applyToService>[2];
    }) => servicesService.applyToService(serviceId, workerId, application),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["available-services"] }),
  });
}

/* ============================================
   Administración
   ============================================ */
export function useAllWorkers() {
  return useQuery({ queryKey: ["all-workers"], queryFn: adminService.getAllWorkers });
}

export function usePendingWorkers() {
  return useQuery({ queryKey: ["pending-workers"], queryFn: adminService.getPendingWorkers });
}

export function useWorkerDetail(workerId?: string) {
  return useQuery({
    queryKey: ["worker-detail", workerId],
    queryFn: () => adminService.getWorkerDetail(workerId!),
    enabled: !!workerId,
  });
}

export function useAdminDashboardStats() {
  return useQuery({ queryKey: ["admin-stats"], queryFn: adminService.getAdminDashboardStats });
}

export function useAdminStats() {
  return useQuery({ queryKey: ["admin-stats"], queryFn: adminService.getAdminDashboardStats });
}

export function useRecentServices() {
  return useQuery({ queryKey: ["recent-services"], queryFn: adminService.getRecentServices });
}


export function useRecentActivity() {
  return useQuery({ queryKey: ["recent-activity"], queryFn: adminService.getRecentActivity });
}

export function useAuditLogs() {
  return useQuery({ queryKey: ["audit-logs"], queryFn: adminService.getAuditLogs });
}

export function useAllPayments() {
  return useQuery({ queryKey: ["all-payments"], queryFn: adminService.getAllPayments });
}

export function useClients() {
  return useQuery({ queryKey: ["clients"], queryFn: adminService.getClients });
}

export function useReviewWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      workerId,
      newStatus,
      reason,
    }: {
      workerId: string;
      newStatus: "approved" | "rejected" | "suspended" | "inactive";
      reason?: string;
    }) => adminService.reviewWorker(workerId, newStatus, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-workers"] });
      qc.invalidateQueries({ queryKey: ["pending-workers"] });
      qc.invalidateQueries({ queryKey: ["worker-detail"] });
    },
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payment: Record<string, unknown>) => adminService.createPayment(payment),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-payments"] }),
  });
}

export function useUpdatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, updates }: { paymentId: string; updates: Record<string, unknown> }) =>
      adminService.updatePayment(paymentId, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-payments"] }),
  });
}

export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rating: Record<string, unknown>) => adminService.createRating(rating),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["worker-detail"] }),
  });
}

/* ============================================
   Notificaciones
   ============================================ */
export function useMyNotifications() {
  return useQuery({ queryKey: ["my-notifications"], queryFn: notificationsService.getMyNotifications });
}

export function useUnreadCount() {
  return useQuery({ queryKey: ["unread-count"], queryFn: notificationsService.getUnreadCount });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}
