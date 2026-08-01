import { createClient } from "@/lib/supabase/client";

/**
 * Servicio de perfil de colaborador (técnico/ayudante).
 */

export async function getWorkerProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
}

export async function getWorkerProfileById(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("id", workerId)
    .single();
  return { data, error };
}

export async function getApplicationStatus(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("status, rejection_reason")
    .eq("email", email)
    .maybeSingle();
  return { data, error };
}


export async function createWorkerProfile(profile: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .insert(profile)
    .select()
    .single();
  return { data, error };
}

export async function updateWorkerProfile(workerId: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .update(updates)
    .eq("id", workerId)
    .select()
    .single();
  return { data, error };
}

export async function getWorkerSpecialties(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_specialties")
    .select("specialty_id, specialties(*)")
    .eq("worker_id", workerId);
  return { data, error };
}

export async function setWorkerSpecialties(workerId: string, specialtyIds: string[]) {
  const supabase = createClient();
  // Eliminar las actuales y agregar las nuevas
  await supabase.from("worker_specialties").delete().eq("worker_id", workerId);
  if (specialtyIds.length === 0) return { data: [], error: null };
  const rows = specialtyIds.map((specialty_id) => ({ worker_id: workerId, specialty_id }));
  const { data, error } = await supabase.from("worker_specialties").insert(rows).select();
  return { data, error };
}

export async function getWorkerServiceAreas(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_service_areas")
    .select("*")
    .eq("worker_id", workerId);
  return { data, error };
}

export async function setWorkerServiceAreas(workerId: string, municipalityIds: string[]) {
  const supabase = createClient();
  await supabase.from("worker_service_areas").delete().eq("worker_id", workerId);
  if (municipalityIds.length === 0) return { data: [], error: null };
  const rows = municipalityIds.map((municipality_id) => ({ worker_id: workerId, municipality_id }));
  const { data, error } = await supabase.from("worker_service_areas").insert(rows).select();
  return { data, error };
}

export async function getWorkerDocuments(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_documents")
    .select("*")
    .eq("worker_id", workerId);
  return { data, error };
}

export async function uploadWorkerDocument(
  workerId: string,
  file: File,
  documentTypeId: string | null
) {
  const supabase = createClient();
  const filePath = `worker-documents/${workerId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("worker-documents")
    .upload(filePath, file);

  if (uploadError) return { data: null, error: uploadError };

  const { data, error } = await supabase
    .from("worker_documents")
    .insert({
      worker_id: workerId,
      document_type_id: documentTypeId,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
    })
    .select()
    .single();

  return { data, error };
}

export async function getSignedDocumentUrl(filePath: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("worker-documents")
    .createSignedUrl(filePath, 60 * 5); // 5 minutos
  return { data, error };
}

export async function setAvailability(workerId: string, isAvailable: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_profiles")
    .update({ is_available: isAvailable })
    .eq("id", workerId)
    .select()
    .single();
  return { data, error };
}

export async function getWorkerRatings(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_ratings")
    .select("*")
    .eq("worker_id", workerId);
  return { data, error };
}

export async function getWorkerPayments(workerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false });
  return { data, error };
}
