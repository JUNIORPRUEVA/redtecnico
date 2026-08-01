// Tipos de base de datos para Supabase
// Estos tipos se generan con `supabase gen types typescript`

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "super_admin" | "admin" | "technician" | "helper";

export type WorkerStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "suspended"
  | "inactive";

export type ServiceStatus =
  | "draft"
  | "published"
  | "receiving_applications"
  | "assigned"
  | "accepted"
  | "on_the_way"
  | "arrived"
  | "in_progress"
  | "paused"
  | "pending_evidence"
  | "submitted_for_review"
  | "correction_requested"
  | "completed"
  | "cancelled"
  | "expired";

export type AssignmentMode = "direct_acceptance" | "application" | "private_assignment";

export type ServiceType =
  | "instalacion"
  | "reparacion"
  | "mantenimiento"
  | "levantamiento"
  | "soporte"
  | "otro";

export type Priority = "baja" | "media" | "alta" | "urgente";

export type WorkerLevel = "aprendiz" | "basico" | "intermedio" | "avanzado" | "especialista";

export type PaymentStatus = "pendiente" | "aprobado" | "programado" | "pagado" | "rechazado";

export type CompletionResult =
  | "resuelto"
  | "parcialmente_resuelto"
  | "no_resuelto"
  | "requiere_visita_adicional";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
      };
      worker_profiles: {
        Row: {
          id: string;
          user_id: string;
          status: WorkerStatus;
          worker_type: "technician" | "helper" | "both";
          cedula: string | null;
          birth_date: string | null;
          address: string | null;
          province_id: string | null;
          municipality_id: string | null;
          sector_id: string | null;
          latitude: number | null;
          longitude: number | null;
          years_experience: number | null;
          experience_description: string | null;
          level: WorkerLevel | null;
          availability: string | null;
          available_days: string[] | null;
          available_hours: string | null;
          max_distance_km: number | null;
          has_vehicle: boolean;
          vehicle_type: string | null;
          has_tools: boolean;
          tools_list: string[] | null;
          can_work_as_helper: boolean;
          can_lead_installation: boolean;
          can_travel_outside: boolean;
          is_available: boolean;
          rating_avg: number | null;
          services_completed: number;
          services_cancelled: number;
          services_abandoned: number;
          reliability_level: string | null;
          rejection_reason: string | null;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["worker_profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["worker_profiles"]["Row"]>;
      };
      specialties: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["specialties"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["specialties"]["Row"]>;
      };
      provinces: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["provinces"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["provinces"]["Row"]>;
      };
      municipalities: {
        Row: {
          id: string;
          province_id: string;
          name: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["municipalities"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["municipalities"]["Row"]>;
      };
      sectors: {
        Row: {
          id: string;
          municipality_id: string;
          name: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sectors"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["sectors"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string | null;
          category: string | null;
          service_type: ServiceType;
          client_id: string | null;
          client_name: string | null;
          client_phone: string | null;
          address: string | null;
          province_id: string | null;
          municipality_id: string | null;
          sector_id: string | null;
          reference: string | null;
          latitude: number | null;
          longitude: number | null;
          maps_link: string | null;
          scheduled_date: string;
          scheduled_time: string | null;
          duration_minutes: number | null;
          priority: Priority;
          assignment_mode: AssignmentMode;
          required_role: "technician" | "helper" | "both";
          technician_count: number;
          helper_count: number;
          min_level: WorkerLevel | null;
          required_tools: string[] | null;
          materials_provided: string[] | null;
          materials_worker: string[] | null;
          payment_offered: number | null;
          travel_allowance: number | null;
          payment_method: string | null;
          internal_instructions: string | null;
          visible_instructions: string | null;
          accept_deadline: string | null;
          status: ServiceStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      service_applications: {
        Row: {
          id: string;
          service_id: string;
          worker_id: string;
          message: string | null;
          estimated_arrival: string | null;
          has_tools: boolean;
          is_available: boolean;
          proposed_helper: boolean;
          status: "pending" | "accepted" | "rejected" | "withdrawn";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_applications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_applications"]["Row"]>;
      };
      service_assignments: {
        Row: {
          id: string;
          service_id: string;
          worker_id: string;
          role: "technician" | "helper";
          assigned_by: string | null;
          status: "assigned" | "accepted" | "completed" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_assignments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_assignments"]["Row"]>;
      };
      service_status_history: {
        Row: {
          id: string;
          service_id: string;
          from_status: ServiceStatus | null;
          to_status: ServiceStatus;
          changed_by: string | null;
          reason: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_status_history"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_status_history"]["Row"]>;
      };
      service_comments: {
        Row: {
          id: string;
          service_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_comments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_comments"]["Row"]>;
      };
      service_completion_reports: {
        Row: {
          id: string;
          service_id: string;
          worker_id: string;
          summary: string;
          result: CompletionResult;
          start_time: string | null;
          end_time: string | null;
          worked_minutes: number | null;
          diagnosis: string | null;
          solution: string | null;
          observations: string | null;
          recommendations: string | null;
          receiver_name: string | null;
          receiver_signature: string | null;
          requires_followup: boolean;
          next_visit_suggested: string | null;
          status: "submitted" | "approved" | "correction_requested";
          reviewed_by: string | null;
          reviewed_at: string | null;
          review_comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_completion_reports"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["service_completion_reports"]["Row"]>;
      };
      worker_ratings: {
        Row: {
          id: string;
          worker_id: string;
          service_id: string;
          rated_by: string;
          punctuality: number;
          quality: number;
          communication: number;
          presentation: number;
          equipment_care: number;
          documentation: number;
          overall: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["worker_ratings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["worker_ratings"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          worker_id: string;
          service_id: string | null;
          amount: number;
          travel_allowance: number | null;
          approved_expenses: number | null;
          deductions: number | null;
          bonus: number | null;
          total: number;
          status: PaymentStatus;
          method: string | null;
          reference: string | null;
          payment_date: string | null;
          receipt_url: string | null;
          observation: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          reason: string | null;
          ip: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>;
      };
      app_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["app_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["app_settings"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
