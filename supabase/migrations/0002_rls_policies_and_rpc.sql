-- ============================================
-- Red Técnico Fulltech — Migración 0002
-- Políticas RLS restantes y funciones RPC críticas
-- ============================================

-- ============================================
-- POLÍTICAS RLS RESTANTES
-- ============================================

-- service_applications: colaborador gestiona las suyas; admins ven todas
create policy "service_applications_update_own" on public.service_applications
  for update using (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

-- service_assignments: colaborador ve sus asignaciones; admins ven todas
create policy "service_assignments_select" on public.service_assignments
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_assignments_admin_insert" on public.service_assignments
  for insert with check (public.is_admin(auth.uid()));
create policy "service_assignments_admin_update" on public.service_assignments
  for update using (public.is_admin(auth.uid()));

-- service_team_members: lectura para quienes ven el servicio
create policy "service_team_members_select" on public.service_team_members
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_team_members.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_team_members_admin_insert" on public.service_team_members
  for insert with check (public.is_admin(auth.uid()));
create policy "service_team_members_admin_delete" on public.service_team_members
  for delete using (public.is_admin(auth.uid()));

-- service_status_history: lectura para quienes ven el servicio
create policy "service_status_history_select" on public.service_status_history
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_status_history.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_status_history_insert" on public.service_status_history
  for insert with check (true);

-- service_comments: lectura para quienes ven el servicio; escritura para participantes
create policy "service_comments_select" on public.service_comments
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_comments.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_comments_insert" on public.service_comments
  for insert with check (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_comments.service_id and wp.user_id = auth.uid()
    )
  );

-- service_attachments: lectura para quienes ven el servicio
create policy "service_attachments_select" on public.service_attachments
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_attachments.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_attachments_insert" on public.service_attachments
  for insert with check (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_attachments.service_id and wp.user_id = auth.uid()
    )
  );

-- service_checklist_items: lectura para quienes ven el servicio
create policy "service_checklist_items_select" on public.service_checklist_items
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_checklist_items.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_checklist_items_admin_insert" on public.service_checklist_items
  for insert with check (public.is_admin(auth.uid()));
create policy "service_checklist_items_admin_delete" on public.service_checklist_items
  for delete using (public.is_admin(auth.uid()));

-- service_checklist_responses: colaborador gestiona las suyas
create policy "service_checklist_responses_select" on public.service_checklist_responses
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_checklist_responses_insert_own" on public.service_checklist_responses
  for insert with check (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_checklist_responses_update_own" on public.service_checklist_responses
  for update using (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

-- service_completion_reports: colaborador gestiona los suyos; admins ven todos
create policy "service_completion_reports_select" on public.service_completion_reports
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_completion_reports_insert_own" on public.service_completion_reports
  for insert with check (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_completion_reports_update_own" on public.service_completion_reports
  for update using (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_completion_reports_admin_update" on public.service_completion_reports
  for update using (public.is_admin(auth.uid()));

-- service_materials: lectura para quienes ven el servicio
create policy "service_materials_select" on public.service_materials
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_materials.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_materials_insert" on public.service_materials
  for insert with check (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_materials.service_id and wp.user_id = auth.uid()
    )
  );

-- service_expenses: colaborador gestiona los suyos; admins ven todos
create policy "service_expenses_select" on public.service_expenses
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "service_expenses_insert_own" on public.service_expenses
  for insert with check (
    exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );

-- service_incidents: lectura para quienes ven el servicio
create policy "service_incidents_select" on public.service_incidents
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_incidents.service_id and wp.user_id = auth.uid()
    )
  );
create policy "service_incidents_insert" on public.service_incidents
  for insert with check (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = service_incidents.service_id and wp.user_id = auth.uid()
    )
  );

-- worker_ratings: colaborador ve sus calificaciones; admins gestionan
create policy "worker_ratings_select" on public.worker_ratings
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "worker_ratings_admin_insert" on public.worker_ratings
  for insert with check (public.is_admin(auth.uid()));

-- payments: colaborador ve sus pagos; admins gestionan
create policy "payments_select" on public.payments
  for select using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from public.worker_profiles wp
      where wp.id = worker_id and wp.user_id = auth.uid()
    )
  );
create policy "payments_admin_insert" on public.payments
  for insert with check (public.is_admin(auth.uid()));
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin(auth.uid()));

-- notifications: usuario ve sus notificaciones
create policy "notifications_select" on public.notifications
  for select using (auth.uid() = user_id);
create policy "notifications_insert" on public.notifications
  for insert with check (auth.uid() = user_id);
create policy "notifications_update" on public.notifications
  for update using (auth.uid() = user_id);

-- admin_notes: solo admins
create policy "admin_notes_admin_all" on public.admin_notes
  for all using (public.is_admin(auth.uid()));

-- audit_logs: solo admins
create policy "audit_logs_admin_select" on public.audit_logs
  for select using (public.is_admin(auth.uid()));
create policy "audit_logs_admin_insert" on public.audit_logs
  for insert with check (public.is_admin(auth.uid()));

-- app_settings: lectura pública; escritura solo super_admin
create policy "app_settings_select" on public.app_settings
  for select using (true);
create policy "app_settings_super_admin_update" on public.app_settings
  for update using (public.is_super_admin(auth.uid()));
create policy "app_settings_super_admin_insert" on public.app_settings
  for insert with check (public.is_super_admin(auth.uid()));

-- ============================================
-- FUNCIONES RPC CRÍTICAS
-- ============================================

-- ============================================
-- ACEPTACIÓN ATÓMICA DE SERVICIO (direct_acceptance)
-- Evita dobles asignaciones mediante transacción y bloqueo de fila.
-- ============================================
create or replace function public.accept_service_direct(
  p_service_id uuid,
  p_worker_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service public.services%rowtype;
  v_worker public.worker_profiles%rowtype;
  v_role user_role;
  v_assignment_id uuid;
begin
  -- Verificar autenticación
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'No autenticado');
  end if;

  -- Obtener rol del usuario
  select role into v_role from public.user_roles where user_id = auth.uid() limit 1;

  -- Verificar que el worker pertenece al usuario autenticado
  select * into v_worker from public.worker_profiles where id = p_worker_id;
  if v_worker.user_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'No autorizado');
  end if;

  -- Verificar que el colaborador está aprobado y disponible
  if v_worker.status <> 'approved' then
    return jsonb_build_object('success', false, 'error', 'Perfil no aprobado');
  end if;
  if not v_worker.is_available then
    return jsonb_build_object('success', false, 'error', 'Colaborador no disponible');
  end if;

  -- Bloquear la fila del servicio para evitar doble asignación
  select * into v_service from public.services where id = p_service_id for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Servicio no encontrado');
  end if;

  -- Verificar que el servicio está publicado y es de aceptación directa
  if v_service.status not in ('published', 'receiving_applications') then
    return jsonb_build_object('success', false, 'error', 'El servicio ya no está disponible');
  end if;
  if v_service.assignment_mode <> 'direct_acceptance' then
    return jsonb_build_object('success', false, 'error', 'Este servicio no es de aceptación directa');
  end if;

  -- Verificar que no haya expirado
  if v_service.accept_deadline is not null and v_service.accept_deadline < now() then
    return jsonb_build_object('success', false, 'error', 'El servicio ha expirado');
  end if;

  -- Verificar que no esté ya asignado
  if exists (select 1 from public.service_assignments where service_id = p_service_id) then
    return jsonb_build_object('success', false, 'error', 'El servicio ya fue tomado por otro colaborador');
  end if;

  -- Verificar compatibilidad básica (rol requerido)
  if v_service.required_role = 'technician' and v_worker.worker_type = 'helper' then
    return jsonb_build_object('success', false, 'error', 'Este servicio requiere un técnico');
  end if;
  if v_service.required_role = 'helper' and v_worker.worker_type = 'technician' then
    return jsonb_build_object('success', false, 'error', 'Este servicio requiere un ayudante');
  end if;

  -- Crear la asignación
  insert into public.service_assignments (service_id, worker_id, role, assigned_by, status)
  values (p_service_id, p_worker_id, v_service.required_role, auth.uid(), 'assigned')
  returning id into v_assignment_id;

  -- Actualizar el estado del servicio
  update public.services
  set status = 'assigned', updated_at = now()
  where id = p_service_id;

  -- Registrar historial de estado
  insert into public.service_status_history (service_id, from_status, to_status, changed_by)
  values (p_service_id, v_service.status, 'assigned', auth.uid());

  -- Registrar auditoría
  insert into public.audit_logs (actor_id, action, entity, entity_id, new_values)
  values (auth.uid(), 'service_direct_accept', 'services', p_service_id::text,
          jsonb_build_object('assignment_id', v_assignment_id));

  return jsonb_build_object('success', true, 'assignment_id', v_assignment_id);
end;
$$;

-- ============================================
-- TRANSICIÓN DE ESTADO DEL SERVICIO
-- Valida la máquina de estados y registra historial + auditoría.
-- ============================================
create or replace function public.transition_service_status(
  p_service_id uuid,
  p_to_status service_status,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service public.services%rowtype;
  v_role user_role;
  v_allowed boolean;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'No autenticado');
  end if;

  select role into v_role from public.user_roles where user_id = auth.uid() limit 1;

  select * into v_service from public.services where id = p_service_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Servicio no encontrado');
  end if;

  -- Validar transición según la máquina de estados
  v_allowed := false;

  -- Transiciones de administración
  if v_role in ('admin', 'super_admin') then
    v_allowed := (
      (v_service.status = 'draft' and p_to_status in ('published', 'cancelled')) or
      (v_service.status = 'published' and p_to_status in ('receiving_applications', 'assigned', 'cancelled', 'expired')) or
      (v_service.status = 'receiving_applications' and p_to_status in ('assigned', 'cancelled', 'expired')) or
      (v_service.status = 'submitted_for_review' and p_to_status in ('completed', 'correction_requested')) or
      (v_service.status = 'correction_requested' and p_to_status = 'cancelled') or
      (v_service.status in ('assigned', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'paused', 'pending_evidence') and p_to_status = 'cancelled')
    );
  end if;

  -- Transiciones del colaborador
  if v_role in ('technician', 'helper') then
    -- Verificar que el colaborador está asignado al servicio
    if exists (
      select 1 from public.service_assignments sa
      join public.worker_profiles wp on wp.id = sa.worker_id
      where sa.service_id = p_service_id and wp.user_id = auth.uid()
    ) then
      v_allowed := (
        (v_service.status = 'assigned' and p_to_status = 'accepted') or
        (v_service.status = 'accepted' and p_to_status = 'on_the_way') or
        (v_service.status = 'on_the_way' and p_to_status = 'arrived') or
        (v_service.status = 'arrived' and p_to_status = 'in_progress') or
        (v_service.status = 'in_progress' and p_to_status in ('paused', 'pending_evidence')) or
        (v_service.status = 'paused' and p_to_status = 'in_progress') or
        (v_service.status = 'pending_evidence' and p_to_status = 'submitted_for_review') or
        (v_service.status = 'correction_requested' and p_to_status = 'submitted_for_review')
      );
    end if;
  end if;

  if not v_allowed then
    return jsonb_build_object('success', false, 'error', 'Transición no permitida');
  end if;

  -- Si es cancelación, se requiere razón
  if p_to_status = 'cancelled' and (p_reason is null or p_reason = '') then
    return jsonb_build_object('success', false, 'error', 'Se requiere una razón para cancelar');
  end if;

  -- Registrar historial
  insert into public.service_status_history (service_id, from_status, to_status, changed_by, reason)
  values (p_service_id, v_service.status, p_to_status, auth.uid(), p_reason);

  -- Actualizar estado
  update public.services set status = p_to_status, updated_at = now() where id = p_service_id;

  -- Auditoría
  insert into public.audit_logs (actor_id, action, entity, entity_id, old_values, new_values, reason)
  values (auth.uid(), 'service_status_change', 'services', p_service_id::text,
          jsonb_build_object('status', v_service.status),
          jsonb_build_object('status', p_to_status), p_reason);

  return jsonb_build_object('success', true);
end;
$$;

-- ============================================
-- APROBAR / RECHAZAR / SUSPENDER COLABORADOR
-- ============================================
create or replace function public.review_worker(
  p_worker_id uuid,
  p_new_status worker_status,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_worker public.worker_profiles%rowtype;
  v_role user_role;
begin
  if auth.uid() is null then
    return jsonb_build_object('success', false, 'error', 'No autenticado');
  end if;

  select role into v_role from public.user_roles where user_id = auth.uid() limit 1;

  if v_role not in ('admin', 'super_admin') then
    return jsonb_build_object('success', false, 'error', 'No autorizado');
  end if;

  -- No puede aprobarse a sí mismo
  select * into v_worker from public.worker_profiles where id = p_worker_id;
  if v_worker.user_id = auth.uid() then
    return jsonb_build_object('success', false, 'error', 'No puedes aprobar tu propio perfil');
  end if;

  -- Estados permitidos para revisión
  if p_new_status not in ('approved', 'rejected', 'suspended', 'inactive') then
    return jsonb_build_object('success', false, 'error', 'Estado no permitido');
  end if;

  -- Si se rechaza o suspende, se requiere razón
  if p_new_status in ('rejected', 'suspended') and (p_reason is null or p_reason = '') then
    return jsonb_build_object('success', false, 'error', 'Se requiere una razón');
  end if;

  -- Actualizar perfil
  update public.worker_profiles
  set status = p_new_status,
      rejection_reason = case when p_new_status = 'rejected' then p_reason else rejection_reason end,
      approved_at = case when p_new_status = 'approved' then now() else approved_at end,
      approved_by = case when p_new_status = 'approved' then auth.uid() else approved_by end,
      updated_at = now()
  where id = p_worker_id;

  -- Auditoría
  insert into public.audit_logs (actor_id, action, entity, entity_id, old_values, new_values, reason)
  values (auth.uid(), 'worker_review', 'worker_profiles', p_worker_id::text,
          jsonb_build_object('status', v_worker.status),
          jsonb_build_object('status', p_new_status), p_reason);

  return jsonb_build_object('success', true);
end;
$$;

-- ============================================
-- REGISTRAR AUDITORÍA (genérico)
-- ============================================
create or replace function public.log_audit(
  p_action text,
  p_entity text,
  p_entity_id text,
  p_old_values jsonb default null,
  p_new_values jsonb default null,
  p_reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (actor_id, action, entity, entity_id, old_values, new_values, reason)
  values (auth.uid(), p_action, p_entity, p_entity_id, p_old_values, p_new_values, p_reason);
end;
$$;

-- ============================================
-- CREAR NOTIFICACIÓN
-- ============================================
create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_body text default null,
  p_data jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, data)
  values (p_user_id, p_type, p_title, p_body, p_data);
end;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Actualizar updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_user_roles before update on public.user_roles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_worker_profiles before update on public.worker_profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_specialties before update on public.specialties
  for each row execute function public.set_updated_at();
create trigger set_updated_at_services before update on public.services
  for each row execute function public.set_updated_at();
create trigger set_updated_at_payments before update on public.payments
  for each row execute function public.set_updated_at();
create trigger set_updated_at_app_settings before update on public.app_settings
  for each row execute function public.set_updated_at();

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
