import { createClient } from "@/lib/supabase/client";

/**
 * Servicio de servicios técnicos.
 */

export async function getAvailableServices(workerId: string) {
  const supabase = createClient();

  // Obtener las zonas de trabajo del colaborador
  const { data: areas } = await supabase
    .from("worker_service_areas")
    .select("municipality_id")
    .eq("worker_id", workerId);

  const municipalityIds = (areas ?? []).map((a) => a.municipality_id);

  let query = supabase
    .from("services")
    .select(
      `*,
      service_specialties(specialty_id, specialties(name)),
      municipalities(name),
      provinces(name),
      sectors(name)`
    )
    .in("status", ["published", "receiving_applications"]);

  // Filtrar por zonas de trabajo si el colaborador tiene zonas definidas
  if (municipalityIds.length > 0) {
    query = query.in("municipality_id", municipalityIds);
  }

  const { data, error } = await query.order("scheduled_date", { ascending: true });
  return { data, error };
}


export async function getServiceById(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      `*,
      service_specialties(specialty_id, specialties(name)),
      service_requirements(*),
      service_assignments(worker_id, role, status, worker_profiles(user_id, full_name)),
      service_status_history(*),
      service_comments(*),
      service_attachments(*),
      service_checklist_items(*),
      municipalities(name),
      provinces(name),
      sectors(name)`
    )
    .eq("id", serviceId)
    .single();
  return { data, error };
}

export async function acceptService(serviceId: string, workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("accept_service_direct", {
    p_service_id: serviceId,
    p_worker_id: workerId,
  });
  return { data, error };
}

export async function transitionServiceStatus(
  serviceId: string,
  toStatus: string,
  reason?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("transition_service_status", {
    p_service_id: serviceId,
    p_to_status: toStatus,
    p_reason: reason ?? null,
  });
  return { data, error };
}



export async function getMyAssignedServices(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      `*,
      service_assignments!inner(worker_id, role, status),
      municipalities(name),
      provinces(name),
      sectors(name)`
    )
    .eq("service_assignments.worker_id", workerId)
    .order("scheduled_date", { ascending: true });
  return { data, error };
}

export async function createService(service: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();
  return { data, error };
}

export async function updateService(serviceId: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", serviceId)
    .select()
    .single();
  return { data, error };
}

export async function getAllServices() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select(
      `*,
      municipalities(name),
      provinces(name),
      sectors(name)`
    )
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getServiceStatusHistory(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_status_history")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: true });
  return { data, error };
}

export async function getServiceComments(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_comments")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: true });
  return { data, error };
}

export async function addServiceComment(serviceId: string, content: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_comments")
    .insert({ service_id: serviceId, content })
    .select()
    .single();
  return { data, error };
}

export async function applyToService(
  serviceId: string,
  workerId: string,
  application: {
    message?: string;
    estimated_arrival?: string;
    has_tools: boolean;
    is_available: boolean;
    proposed_helper: boolean;
  }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_applications")
    .insert({ service_id: serviceId, worker_id: workerId, ...application })
    .select()
    .single();
  return { data, error };
}

export async function getServiceApplications(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_applications")
    .select("*")
    .eq("service_id", serviceId);
  return { data, error };
}

export async function getServiceAssignments(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_assignments")
    .select("*")
    .eq("service_id", serviceId);
  return { data, error };
}

export async function assignWorkerToService(
  serviceId: string,
  workerId: string,
  role: "technician" | "helper"
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_assignments")
    .insert({ service_id: serviceId, worker_id: workerId, role })
    .select()
    .single();
  return { data, error };
}

export async function getServiceCompletionReport(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_completion_reports")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

export async function submitCompletionReport(report: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_completion_reports")
    .insert(report)
    .select()
    .single();
  return { data, error };
}

export async function getServiceChecklist(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_checklist_items")
    .select("*")
    .eq("service_id", serviceId)
    .order("sort_order", { ascending: true });
  return { data, error };
}

export async function getServiceAttachments(serviceId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_attachments")
    .select("*")
    .eq("service_id", serviceId);
  return { data, error };
}

export async function uploadServiceAttachment(serviceId: string, file: File, category: string) {
  const supabase = createClient();
  const filePath = `service-attachments/${serviceId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("service-attachments")
    .upload(filePath, file);

  if (uploadError) return { data: null, error: uploadError };

  const { data, error } = await supabase
    .from("service_attachments")
    .insert({
      service_id: serviceId,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      category,
    })
    .select()
    .single();

  return { data, error };
}

export async function getSignedAttachmentUrl(filePath: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("service-attachments")
    .createSignedUrl(filePath, 60 * 5);
  return { data, error };
}
