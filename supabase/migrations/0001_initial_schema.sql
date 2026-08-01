-- ============================================
-- Red Técnico Fulltech — Migración inicial
-- Esquema completo, RLS y funciones RPC
-- ============================================

-- Extensión para UUID
create extension if not exists "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
create type user_role as enum ('super_admin', 'admin', 'technician', 'helper');
create type worker_status as enum ('draft', 'pending_review', 'approved', 'rejected', 'suspended', 'inactive');
create type worker_type as enum ('technician', 'helper', 'both');
create type worker_level as enum ('aprendiz', 'basico', 'intermedio', 'avanzado', 'especialista');
create type service_status as enum (
  'draft', 'published', 'receiving_applications', 'assigned', 'accepted',
  'on_the_way', 'arrived', 'in_progress', 'paused', 'pending_evidence',
  'submitted_for_review', 'correction_requested', 'completed', 'cancelled', 'expired'
);
create type assignment_mode as enum ('direct_acceptance', 'application', 'private_assignment');
create type service_type as enum ('instalacion', 'reparacion', 'mantenimiento', 'levantamiento', 'soporte', 'otro');
create type priority as enum ('baja', 'media', 'alta', 'urgente');
create type payment_status as enum ('pendiente', 'aprobado', 'programado', 'pagado', 'rechazado');
create type completion_result as enum ('resuelto', 'parcialmente_resuelto', 'no_resuelto', 'requiere_visita_adicional');
create type application_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type assignment_status as enum ('assigned', 'accepted', 'completed', 'cancelled');
create type report_status as enum ('submitted', 'approved', 'correction_requested');

-- ============================================
-- TABLAS
-- ============================================

-- Perfiles de usuario
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles de usuario
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role user_role not null default 'technician',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, role)
);

-- Provincias
create table public.provinces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  created_at timestamptz not null default now()
);

-- Municipios
create table public.municipalities (
  id uuid primary key default gen_random_uuid(),
  province_id uuid not null references public.provinces(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Sectores
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  municipality_id uuid not null references public.municipalities(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Especialidades
create table public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Perfiles de colaborador (técnico/ayudante)
create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  status worker_status not null default 'draft',
  worker_type worker_type not null default 'technician',
  cedula text,
  birth_date date,
  address text,
  province_id uuid references public.provinces(id),
  municipality_id uuid references public.municipalities(id),
  sector_id uuid references public.sectors(id),
  latitude numeric(10,7),
  longitude numeric(10,7),
  years_experience integer,
  experience_description text,
  level worker_level,
  availability text,
  available_days text[],
  available_hours text,
  max_distance_km numeric(6,1),
  has_vehicle boolean not null default false,
  vehicle_type text,
  has_tools boolean not null default false,
  tools_list text[],
  can_work_as_helper boolean not null default false,
  can_lead_installation boolean not null default false,
  can_travel_outside boolean not null default false,
  is_available boolean not null default false,
  rating_avg numeric(3,2),
  services_completed integer not null default 0,
  services_cancelled integer not null default 0,
  services_abandoned integer not null default 0,
  reliability_level text,
  rejection_reason text,
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Especialidades del colaborador
create table public.worker_specialties (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (worker_id, specialty_id)
);

-- Zonas de trabajo del colaborador
create table public.worker_service_areas (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  municipality_id uuid references public.municipalities(id),
  province_id uuid references public.provinces(id),
  created_at timestamptz not null default now()
);

-- Disponibilidad del colaborador
create table public.worker_availability (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time,
  end_time time,
  created_at timestamptz not null default now()
);

-- Herramientas del colaborador
create table public.worker_tools (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  name text not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- Tipos de documento
create table public.worker_document_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_required boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Documentos del colaborador
create table public.worker_documents (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  document_type_id uuid references public.worker_document_types(id),
  file_path text not null,
  file_name text,
  file_size integer,
  mime_type text,
  status text not null default 'pending',
  expires_at timestamptz,
  uploaded_at timestamptz not null default now()
);

-- Clientes
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  address text,
  province_id uuid references public.provinces(id),
  municipality_id uuid references public.municipalities(id),
  sector_id uuid references public.sectors(id),
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Servicios
create table public.services (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  category text,
  service_type service_type not null default 'otro',
  client_id uuid references public.clients(id),
  client_name text,
  client_phone text,
  address text,
  province_id uuid references public.provinces(id),
  municipality_id uuid references public.municipalities(id),
  sector_id uuid references public.sectors(id),
  reference text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  maps_link text,
  scheduled_date date not null,
  scheduled_time time,
  duration_minutes integer,
  priority priority not null default 'media',
  assignment_mode assignment_mode not null default 'application',
  required_role worker_type not null default 'technician',
  technician_count integer not null default 1,
  helper_count integer not null default 0,
  min_level worker_level,
  required_tools text[],
  materials_provided text[],
  materials_worker text[],
  payment_offered numeric(12,2),
  travel_allowance numeric(12,2),
  payment_method text,
  internal_instructions text,
  visible_instructions text,
  accept_deadline timestamptz,
  status service_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Especialidades requeridas por servicio
create table public.service_specialties (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (service_id, specialty_id)
);

-- Requisitos del servicio
create table public.service_requirements (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  is_required boolean not null default true,
  created_at timestamptz not null default now()
);

-- Invitaciones privadas
create table public.service_invitations (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  status text not null default 'pending',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (service_id, worker_id)
);

-- Solicitudes de colaboradores
create table public.service_applications (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  message text,
  estimated_arrival time,
  has_tools boolean not null default false,
  is_available boolean not null default true,
  proposed_helper boolean not null default false,
  status application_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, worker_id)
);

-- Asignaciones
create table public.service_assignments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  role worker_type not null default 'technician',
  assigned_by uuid references auth.users(id),
  status assignment_status not null default 'assigned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, worker_id)
);

-- Miembros del equipo
create table public.service_team_members (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  role worker_type not null default 'technician',
  created_at timestamptz not null default now()
);

-- Historial de estados
create table public.service_status_history (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  from_status service_status,
  to_status service_status not null,
  changed_by uuid references auth.users(id),
  reason text,
  created_at timestamptz not null default now()
);

-- Comentarios del servicio
create table public.service_comments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  content text not null,
  created_at timestamptz not null default now()
);

-- Adjuntos del servicio
create table public.service_attachments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  file_path text not null,
  file_name text,
  file_size integer,
  mime_type text,
  category text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Checklist de finalización
create table public.service_checklist_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Respuestas del checklist
create table public.service_checklist_responses (
  id uuid primary key default gen_random_uuid(),
  checklist_item_id uuid not null references public.service_checklist_items(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  is_completed boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

-- Reportes de finalización
create table public.service_completion_reports (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  summary text not null,
  result completion_result not null default 'resuelto',
  start_time timestamptz,
  end_time timestamptz,
  worked_minutes integer,
  diagnosis text,
  solution text,
  observations text,
  recommendations text,
  receiver_name text,
  receiver_signature text,
  requires_followup boolean not null default false,
  next_visit_suggested date,
  status report_status not null default 'submitted',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Materiales usados
create table public.service_materials (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  report_id uuid references public.service_completion_reports(id) on delete cascade,
  name text not null,
  quantity numeric(10,2) not null default 1,
  unit text,
  returned boolean not null default false,
  created_at timestamptz not null default now()
);

-- Gastos
create table public.service_expenses (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null,
  receipt_url text,
  status text not null default 'pending',
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- Incidencias
create table public.service_incidents (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  worker_id uuid references public.worker_profiles(id),
  description text not null,
  severity text not null default 'media',
  status text not null default 'open',
  reported_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Calificaciones
create table public.worker_ratings (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  rated_by uuid not null references auth.users(id),
  punctuality integer not null check (punctuality between 1 and 5),
  quality integer not null check (quality between 1 and 5),
  communication integer not null check (communication between 1 and 5),
  presentation integer not null check (presentation between 1 and 5),
  equipment_care integer not null check (equipment_care between 1 and 5),
  documentation integer not null check (documentation between 1 and 5),
  overall integer not null check (overall between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (service_id, worker_id)
);

-- Pagos
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  service_id uuid references public.services(id),
  amount numeric(12,2) not null default 0,
  travel_allowance numeric(12,2) default 0,
  approved_expenses numeric(12,2) default 0,
  deductions numeric(12,2) default 0,
  bonus numeric(12,2) default 0,
  total numeric(12,2) not null default 0,
  status payment_status not null default 'pendiente',
  method text,
  reference text,
  payment_date timestamptz,
  receipt_url text,
  observation text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notificaciones
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  data jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Notas internas (nunca visibles para el técnico)
create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references public.worker_profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete cascade,
  content text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Auditoría
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  reason text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Configuración de la aplicación
create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- ÍNDICES
-- ============================================
create index idx_services_status on public.services(status);
create index idx_services_province on public.services(province_id);
create index idx_services_municipality on public.services(municipality_id);
create index idx_services_scheduled_date on public.services(scheduled_date);
create index idx_services_created_at on public.services(created_at desc);
create index idx_worker_profiles_status on public.worker_profiles(status);
create index idx_worker_profiles_user on public.worker_profiles(user_id);
create index idx_worker_profiles_available on public.worker_profiles(is_available) where is_available = true;
create index idx_service_specialties_service on public.service_specialties(service_id);
create index idx_service_specialties_specialty on public.service_specialties(specialty_id);
create index idx_worker_specialties_worker on public.worker_specialties(worker_id);
create index idx_worker_specialties_specialty on public.worker_specialties(specialty_id);
create index idx_service_assignments_service on public.service_assignments(service_id);
create index idx_service_assignments_worker on public.service_assignments(worker_id);
create index idx_notifications_user_read on public.notifications(user_id, is_read);
create index idx_service_status_history_service on public.service_status_history(service_id);
create index idx_service_applications_service on public.service_applications(service_id);
create index idx_service_applications_worker on public.service_applications(worker_id);
create index idx_payments_worker on public.payments(worker_id);
create index idx_payments_status on public.payments(status);
create index idx_audit_logs_entity on public.audit_logs(entity, entity_id);
create index idx_audit_logs_created on public.audit_logs(created_at desc);
create index idx_worker_documents_worker on public.worker_documents(worker_id);
create index idx_service_comments_service on public.service_comments(service_id);
create index idx_service_completion_reports_service on public.service_completion_reports(service_id);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Obtener el rol principal de un usuario
create or replace function public.get_user_role(uid uuid)
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.user_roles where user_id = uid order by created_at limit 1;
$$;

-- Verificar si un usuario es admin o super_admin
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role in ('admin', 'super_admin')
  );
$$;

-- Verificar si un usuario es super_admin
create or replace function public.is_super_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role = 'super_admin'
  );
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.worker_specialties enable row level security;
alter table public.worker_service_areas enable row level security;
alter table public.worker_availability enable row level security;
alter table public.worker_tools enable row level security;
alter table public.worker_documents enable row level security;
alter table public.worker_document_types enable row level security;
alter table public.specialties enable row level security;
alter table public.provinces enable row level security;
alter table public.municipalities enable row level security;
alter table public.sectors enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.service_specialties enable row level security;
alter table public.service_requirements enable row level security;
alter table public.service_invitations enable row level security;
alter table public.service_applications enable row level security;
alter table public.service_assignments enable row level security;
alter table public.service_team_members enable row level security;
alter table public.service_status_history enable row level security;
alter table public.service_comments enable row level security;
alter table public.service_attachments enable row level security;
alter table public.service_checklist_items enable row level security;
alter table public.service_checklist_responses enable row level security;
alter table public.service_completion_reports enable row level security;
alter table public.service_materials enable row level security;
alter table public.service_expenses enable row level security;
alter table public.service_incidents enable row level security;
alter table public.worker_ratings enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_notes enable row level security;
alter table public.audit_logs enable row level security;
alter table public.app_settings enable row level security;

-- ============================================
-- POLÍTICAS RLS
-- ============================================

-- profiles: cada usuario ve/edita su propio perfil
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- user_roles: solo super_admin gestiona; usuarios ven su propio rol
create policy "user_roles_select_own" on public.user_roles
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "user_roles_admin_manage" on public.user_roles
  for all using (public.is_super_admin(auth.uid()));

-- worker_profiles: cada colaborador ve/edita su propio perfil; admins ven todos
create policy "worker_profiles_select_own" on public.worker_profiles
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "worker_profiles_insert_own" on public.worker_profiles
  for insert with check (auth.uid() = user_id);
create policy "worker_profiles_update_own" on public.worker_profiles
  for update using (auth.uid() = user_id);
create policy "worker_profiles_admin_update" on public.worker_profiles
  for update using (public.is_admin(auth.uid()));

-- worker_specialties: colaborador gestiona las suyas; admins ven todas
create policy "worker_specialties_select" on public.worker_specialties
  for select using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );
create policy "worker_specialties_insert_own" on public.worker_specialties
  for insert with check (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );
create policy "worker_specialties_delete_own" on public.worker_specialties
  for delete using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );

-- worker_service_areas: colaborador gestiona las suyas
create policy "worker_service_areas_select" on public.worker_service_areas
  for select using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );
create policy "worker_service_areas_insert_own" on public.worker_service_areas
  for insert with check (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );
create policy "worker_service_areas_delete_own" on public.worker_service_areas
  for delete using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );

-- worker_availability: colaborador gestiona la suya
create policy "worker_availability_select" on public.worker_availability
  for select using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );
create policy "worker_availability_insert_own" on public.worker_availability
  for insert with check (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );
create policy "worker_availability_delete_own" on public.worker_availability
  for delete using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );

-- worker_tools: colaborador gestiona las suyas
create policy "worker_tools_select" on public.worker_tools
  for select using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );
create policy "worker_tools_insert_own" on public.worker_tools
  for insert with check (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );
create policy "worker_tools_delete_own" on public.worker_tools
  for delete using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );

-- worker_documents: colaborador ve/gestiona los suyos; admins ven todos
create policy "worker_documents_select" on public.worker_documents
  for select using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
    or public.is_admin(auth.uid())
  );
create policy "worker_documents_insert_own" on public.worker_documents
  for insert with check (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );
create policy "worker_documents_delete_own" on public.worker_documents
  for delete using (
    exists (select 1 from public.worker_profiles wp where wp.id = worker_id and wp.user_id = auth.uid())
  );

-- worker_document_types: lectura pública (catálogo)
create policy "worker_document_types_select" on public.worker_document_types
  for select using (true);

-- specialties: lectura pública (catálogo)
create policy "specialties_select" on public.specialties
  for select using (true);
create policy "specialties_admin_manage" on public.specialties
  for all using (public.is_admin(auth.uid()));

-- provinces, municipalities, sectors: lectura pública
create policy "provinces_select" on public.provinces for select using (true);
create policy "municipalities_select" on public.municipalities for select using (true);
create policy "sectors_select" on public.sectors for select using (true);

-- clients: solo admins
create policy "clients_admin_all" on public.clients
  for all using (public.is_admin(auth.uid()));

-- services: admins gestionan; colaboradores ven solo compatibles/publicados
create policy "services_admin_all" on public.services
  for all using (public.is_admin(auth.uid()));

-- Colaboradores ven servicios publicados o en recepción de solicitudes
create policy "services_worker_select" on public.services
  for select using (
    status in ('published', 'receiving_applications')
    and exists (
      select 1 from public.worker_profiles wp
      where wp.user_id = auth.uid() and wp.status = 'approved' and wp.is_available = true
    )
  );

-- Colaboradores asignados ven su servicio en cualquier estado
create policy "services_assigned_select" on public.services
  for select using (
    exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = services.id and wp.user_id = auth.uid()
    )
  );

-- service_specialties: lectura para quienes ven el servicio
create policy "service_specialties_select" on public.service_specialties
  for select using (
    public.is_admin(auth.uid())
    or exists (select 1 from public.services s where s.id = service_id and s.status in ('published', 'receiving_applications'))
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_specialties.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_specialties_admin_insert" on public.service_specialties
  for insert with check (public.is_admin(auth.uid()));
create policy "service_specialties_admin_delete" on public.service_specialties
  for delete using (public.is_admin(auth.uid()));

-- service_requirements: lectura para quienes ven el servicio
create policy "service_requirements_select" on public.service_requirements
  for select using (
    public.is_admin(auth.uid())
    or exists (select 1 from public.services s where s.id = service_id and s.status in ('published', 'receiving_applications'))
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_requirements.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_requirements_admin_insert" on public.service_requirements
  for insert with check (public.is_admin(auth.uid()));
create policy "service_requirements_admin_delete" on public.service_requirements
  for delete using (public.is_admin(auth.uid()));

-- service_invitations: colaborador ve sus invitaciones; admins gestionan
create policy "service_invitations_select" on public.service_invitations
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_invitations_admin_insert" on public.service_invitations
  for insert with check (public.is_admin(auth.uid()));
create policy "service_invitations_admin_delete" on public.service_invitations
  for delete using (public.is_admin(auth.uid()));

-- service_applications: colaborador gestiona las suyas; admins ven todas
create policy "service_applications_select" on public.service_applications
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_applications_insert_own" on public.service_applications
  for insert with check (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_applications_update_own" on public