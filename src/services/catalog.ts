import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { apiGet } from "@/lib/postgres-api";

type CatalogRow = Record<string, unknown>;

/**
 * Servicio de catálogos (provincias, municipios, sectores, especialidades).
 */

export async function getProvinces() {
  if (!isSupabaseConfigured()) return apiGet<CatalogRow[]>("/api/catalog?resource=provinces");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("provinces")
    .select("*")
    .order("name", { ascending: true });
  return { data, error };
}

export async function getMunicipalities(provinceId?: string) {
  if (!isSupabaseConfigured()) {
    const query = provinceId ? `&provinceId=${encodeURIComponent(provinceId)}` : "";
    return apiGet<CatalogRow[]>(`/api/catalog?resource=municipalities${query}`);
  }

  const supabase = createClient();
  let query = supabase.from("municipalities").select("*").order("name", { ascending: true });
  if (provinceId) {
    query = query.eq("province_id", provinceId);
  }
  const { data, error } = await query;
  return { data, error };
}

export async function getSectors(municipalityId?: string) {
  if (!isSupabaseConfigured()) {
    const query = municipalityId ? `&municipalityId=${encodeURIComponent(municipalityId)}` : "";
    return apiGet<CatalogRow[]>(`/api/catalog?resource=sectors${query}`);
  }

  const supabase = createClient();
  let query = supabase.from("sectors").select("*").order("name", { ascending: true });
  if (municipalityId) {
    query = query.eq("municipality_id", municipalityId);
  }
  const { data, error } = await query;
  return { data, error };
}

export async function getSpecialties() {
  if (!isSupabaseConfigured()) return apiGet<CatalogRow[]>("/api/catalog?resource=specialties");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return { data, error };
}

export async function getAllSpecialties() {
  if (!isSupabaseConfigured()) return apiGet<CatalogRow[]>("/api/catalog?resource=specialties");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .order("sort_order", { ascending: true });
  return { data, error };
}

export async function createSpecialty(specialty: { name: string; slug: string; description?: string }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("specialties")
    .insert(specialty)
    .select()
    .single();
  return { data, error };
}

export async function updateSpecialty(specialtyId: string, updates: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("specialties")
    .update(updates)
    .eq("id", specialtyId)
    .select()
    .single();
  return { data, error };
}

export async function getWorkerDocumentTypes() {
  if (!isSupabaseConfigured()) return apiGet<CatalogRow[]>("/api/catalog?resource=documentTypes");

  const supabase = createClient();
  const { data, error } = await supabase
    .from("worker_document_types")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return { data, error };
}
