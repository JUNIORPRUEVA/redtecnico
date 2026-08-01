-- ============================================
-- Red Técnico Fulltech — Seed de desarrollo
-- Datos de demostración. NO usar en producción.
-- ============================================

-- ============================================
-- CATÁLOGO: Provincias (priorizando La Altagracia)
-- ============================================
insert into public.provinces (name, code) values
  ('La Altagracia', '11'),
  ('Santo Domingo', '32'),
  ('Distrito Nacional', '01'),
  ('San Pedro de Macorís', '23'),
  ('La Romana', '12'),
  ('Santiago', '25')
on conflict do nothing;

-- ============================================
-- CATÁLOGO: Municipios
-- ============================================
insert into public.municipalities (province_id, name) values
  ((select id from public.provinces where code = '11'), 'Higüey'),
  ((select id from public.provinces where code = '11'), 'San Rafael del Yuma'),
  ((select id from public.provinces where code = '11'), 'Boca de Yuma'),
  ((select id from public.provinces where code = '32'), 'Santo Domingo Este'),
  ((select id from public.provinces where code = '32'), 'Santo Domingo Norte'),
  ((select id from public.provinces where code = '01'), 'Distrito Nacional'),
  ((select id from public.provinces where code = '23'), 'San Pedro de Macorís'),
  ((select id from public.provinces where code = '12'), 'La Romana')
on conflict do nothing;

-- ============================================
-- CATÁLOGO: Sectores
-- ============================================
insert into public.sectors (municipality_id, name) values
  ((select id from public.municipalities where name = 'Higüey'), 'Centro'),
  ((select id from public.municipalities where name = 'Higüey'), 'Villa Cerro'),
  ((select id from public.municipalities where name = 'Higüey'), 'Los Ríos'),
  ((select id from public.municipalities where name = 'Higüey'), 'Bávaro'),
  ((select id from public.municipalities where name = 'Higüey'), 'Punta Cana'),
  ((select id from public.municipalities where name = 'Santo Domingo Este'), 'Los Mina'),
  ((select id from public.municipalities where name = 'Santo Domingo Este'), 'San Isidro'),
  ((select id from public.municipalities where name = 'Distrito Nacional'), 'Gazcue'),
  ((select id from public.municipalities where name = 'Distrito Nacional'), 'Naco')
on conflict do nothing;

-- ============================================
-- CATÁLOGO: Especialidades
-- ============================================
insert into public.specialties (name, slug, description, sort_order) values
  ('Cámaras de seguridad', 'camaras-seguridad', 'Instalación y configuración de cámaras de seguridad', 1),
  ('DVR y NVR', 'dvr-nvr', 'Instalación y configuración de grabadores DVR/NVR', 2),
  ('Redes y cableado', 'redes-cableado', 'Cableado estructurado y redes', 3),
  ('Motores de portón', 'motores-porton', 'Instalación y reparación de motores de portón', 4),
  ('Intercomunicadores', 'intercomunicadores', 'Instalación de intercomunicadores', 5),
  ('Cercos eléctricos', 'cercos-electricos', 'Instalación y mantenimiento de cercos eléctricos', 6),
  ('Alarmas', 'alarmas', 'Instalación de sistemas de alarma', 7),
  ('Control de acceso', 'control-acceso', 'Sistemas de control de acceso', 8),
  ('Sistemas POS', 'sistemas-pos', 'Instalación y soporte de sistemas POS', 9),
  ('Computadoras', 'computadoras', 'Reparación y mantenimiento de computadoras', 10),
  ('Electricidad básica', 'electricidad-basica', 'Trabajos de electricidad básica', 11),
  ('Mantenimiento preventivo', 'mantenimiento-preventivo', 'Mantenimiento preventivo de equipos', 12),
  ('Levantamientos técnicos', 'levantamientos-tecnicos', 'Levantamiento de información técnica', 13),
  ('Ayudante general', 'ayudante-general', 'Apoyo general en instalaciones', 14)
on conflict (slug) do nothing;

-- ============================================
-- CATÁLOGO: Tipos de documento
-- ============================================
insert into public.worker_document_types (name, slug, is_required, sort_order) values
  ('Cédula frontal', 'cedula-frontal', true, 1),
  ('Cédula posterior', 'cedula-posterior', true, 2),
  ('Certificado', 'certificado', false, 3),
  ('Fotografía de trabajo', 'foto-trabajo', false, 4),
  ('Buena conducta', 'buena-conducta', false, 5)
on conflict (slug) do nothing;

-- ============================================
-- USUARIOS DE DEMOSTRACIÓN (auth.users)
-- Nota: en un entorno real se crean vía Supabase Auth.
-- Aquí se insertan directamente para desarrollo.
-- ============================================
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000001', 'superadmin@fulltech.do', crypt('SuperAdmin123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Super Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'admin@fulltech.do', crypt('Admin123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Fulltech"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'tecnico1@fulltech.do', crypt('Tecnico123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Juan Pérez"}', now(), now()),
  ('00000000-0000-0000-0000-000000000004', 'tecnico2@fulltech.do', crypt('Tecnico123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"María Gómez"}', now(), now()),
  ('00000000-0000-0000-0000-000000000005', 'ayudante1@fulltech.do', crypt('Ayudante123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Pedro Martínez"}', now(), now()),
  ('00000000-0000-0000-0000-000000000006', 'pendiente1@fulltech.do', crypt('Pendiente123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Luis Rodríguez"}', now(), now())
on conflict (id) do nothing;

-- ============================================
-- PERFILES
-- ============================================
insert into public.profiles (id, email, full_name, first_name, last_name, phone) values
  ('00000000-0000-0000-0000-000000000001', 'superadmin@fulltech.do', 'Super Admin', 'Super', 'Admin', '809-000-0001'),
  ('00000000-0000-0000-0000-000000000002', 'admin@fulltech.do', 'Admin Fulltech', 'Admin', 'Fulltech', '809-000-0002'),
  ('00000000-0000-0000-0000-000000000003', 'tecnico1@fulltech.do', 'Juan Pérez', 'Juan', 'Pérez', '809-555-0101'),
  ('00000000-0000-0000-0000-000000000004', 'tecnico2@fulltech.do', 'María Gómez', 'María', 'Gómez', '809-555-0102'),
  ('00000000-0000-0000-0000-000000000005', 'ayudante1@fulltech.do', 'Pedro Martínez', 'Pedro', 'Martínez', '809-555-0103'),
  ('00000000-0000-0000-0000-000000000006', 'pendiente1@fulltech.do', 'Luis Rodríguez', 'Luis', 'Rodríguez', '809-555-0104')
on conflict (id) do nothing;

-- ============================================
-- ROLES
-- ============================================
insert into public.user_roles (user_id, role) values
  ('00000000-0000-0000-0000-000000000001', 'super_admin'),
  ('00000000-0000-0000-0000-000000000002', 'admin'),
  ('00000000-0000-0000-0000-000000000003', 'technician'),
  ('00000000-0000-0000-0000-000000000004', 'technician'),
  ('00000000-0000-0000-0000-000000000005', 'helper'),
  ('00000000-0000-0000-0000-000000000006', 'technician')
on conflict (user_id, role) do nothing;

-- ============================================
-- PERFILES DE COLABORADOR
-- ============================================
insert into public.worker_profiles (
  user_id, status, worker_type, cedula, address, province_id, municipality_id, sector_id,
  years_experience, experience_description, level, is_available, has_vehicle, vehicle_type,
  has_tools, can_work_as_helper, can_lead_installation, can_travel_outside, rating_avg,
  services_completed, approved_at, approved_by
) values
  (
    '00000000-0000-0000-0000-000000000003', 'approved', 'technician', '001-1234567-8',
    'Calle Principal #12', (select id from public.provinces where code = '11'),
    (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Centro'),
    5, 'Técnico con experiencia en cámaras y redes.', 'intermedio', true, true, 'Camioneta',
    true, true, true, true, 4.5, 12, now(), '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000004', 'approved', 'technician', '001-2345678-9',
    'Av. Los Ríos #45', (select id from public.provinces where code = '11'),
    (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Los Ríos'),
    3, 'Especialista en alarmas y control de acceso.', 'avanzado', true, false, null,
    true, false, true, true, 4.8, 8, now(), '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000005', 'approved', 'helper', '001-3456789-0',
    'Sector Bávaro', (select id from public.provinces where code = '11'),
    (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Bávaro'),
    2, 'Ayudante general en instalaciones.', 'basico', true, false, null,
    true, true, false, false, 4.2, 5, now(), '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-000000000006', 'pending_review', 'technician', '001-4567890-1',
    'Calle Duarte #8', (select id from public.provinces where code = '11'),
    (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Villa Cerro'),
    1, 'Nuevo técnico en formación.', 'aprendiz', false, false, null,
    false, true, false, false, null, 0, null, null
  )
on conflict (user_id) do nothing;

-- ============================================
-- ESPECIALIDADES DE COLABORADORES
-- ============================================
insert into public.worker_specialties (worker_id, specialty_id) values
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000003'), (select id from public.specialties where slug = 'camaras-seguridad')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000003'), (select id from public.specialties where slug = 'redes-cableado')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000004'), (select id from public.specialties where slug = 'alarmas')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000004'), (select id from public.specialties where slug = 'control-acceso')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000005'), (select id from public.specialties where slug = 'ayudante-general'))
on conflict (worker_id, specialty_id) do nothing;

-- ============================================
-- ZONAS DE TRABAJO
-- ============================================
insert into public.worker_service_areas (worker_id, municipality_id, province_id) values
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000003'), (select id from public.municipalities where name = 'Higüey'), (select id from public.provinces where code = '11')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000004'), (select id from public.municipalities where name = 'Higüey'), (select id from public.provinces where code = '11')),
  ((select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000005'), (select id from public.municipalities where name = 'Higüey'), (select id from public.provinces where code = '11'));

-- ============================================
-- CLIENTES FICTICIOS
-- ============================================
insert into public.clients (name, phone, email, address, province_id, municipality_id, sector_id, created_by) values
  ('Hotel Punta Cana Resort', '809-555-2001', 'mantenimiento@hotelpuntacana.do', 'Bávaro', (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'), (select id from public.sectors where name = 'Bávaro'), '00000000-0000-0000-0000-000000000002'),
  ('Comercial Higüey', '809-555-2002', 'soporte@comercialhiguey.do', 'Centro', (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'), (select id from public.sectors where name = 'Centro'), '00000000-0000-0000-0000-000000000002'),
  ('Residencial Los Ríos', '809-555-2003', 'admin@residencialrios.do', 'Los Ríos', (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'), (select id from public.sectors where name = 'Los Ríos'), '00000000-0000-0000-0000-000000000002');

-- ============================================
-- SERVICIOS DE DEMOSTRACIÓN
-- ============================================
insert into public.services (
  code, title, description, service_type, client_id, client_name, client_phone,
  address, province_id, municipality_id, sector_id, scheduled_date, priority,
  assignment_mode, required_role, technician_count, helper_count, min_level,
  payment_offered, travel_allowance, status, created_by
) values
  (
    'SV-2026-0001', 'Instalación de cámaras de seguridad', 'Instalación de 4 cámaras IP en área de recepción.',
    'instalacion', (select id from public.clients where name = 'Hotel Punta Cana Resort'),
    'Hotel Punta Cana Resort', '809-555-2001', 'Bávaro',
    (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Bávaro'), current_date + interval '2 days', 'alta',
    'direct_acceptance', 'technician', 1, 1, 'intermedio', 4500, 500, 'published',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'SV-2026-0002', 'Reparación de sistema de alarma', 'Falla en panel de alarma principal.',
    'reparacion', (select id from public.clients where name = 'Comercial Higüey'),
    'Comercial Higüey', '809-555-2002', 'Centro',
    (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Centro'), current_date + interval '1 day', 'urgente',
    'application', 'technician', 1, 0, 'avanzado', 3500, 300, 'receiving_applications',
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    'SV-2026-0003', 'Mantenimiento preventivo de DVR', 'Mantenimiento y limpieza de grabadores.',
    'mantenimiento', (select id from public.clients where name = 'Residencial Los Ríos'),
    'Residencial Los Ríos', '809-555-2003', 'Los Ríos',
    (select id from public.provinces where code = '11'), (select id from public.municipalities where name = 'Higüey'),
    (select id from public.sectors where name = 'Los Ríos'), current_date + interval '3 days', 'media',
    'private_assignment', 'technician', 1, 1, 'basico', 2500, 200, 'draft',
    '00000000-0000-0000-0000-000000000002'
  );

-- ============================================
-- ESPECIALIDADES DE SERVICIOS
-- ============================================
insert into public.service_specialties (service_id, specialty_id) values
  ((select id from public.services where code = 'SV-2026-0001'), (select id from public.specialties where slug = 'camaras-seguridad')),
  ((select id from public.services where code = 'SV-2026-0001'), (select id from public.specialties where slug = 'redes-cableado')),
  ((select id from public.services where code = 'SV-2026-0002'), (select id from public.specialties where slug = 'alarmas')),
  ((select id from public.services where code = 'SV-2026-0003'), (select id from public.specialties where slug = 'dvr-nvr'))
on conflict (service_id, specialty_id) do nothing;

-- ============================================
-- SOLICITUDES DE DEMOSTRACIÓN
-- ============================================
insert into public.service_applications (service_id, worker_id, message, has_tools, is_available) values
  ((select id from public.services where code = 'SV-2026-0002'), (select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000004'), 'Puedo atender hoy mismo.', true, true);

-- ============================================
-- ASIGNACIONES DE DEMOSTRACIÓN
-- ============================================
insert into public.service_assignments (service_id, worker_id, role, assigned_by, status) values
  ((select id from public.services where code = 'SV-2026-0003'), (select id from public.worker_profiles where user_id = '00000000-0000-0000-0000-000000000003'), 'technician', '00000000-0000-0000-0000-000000000002', 'assigned');

-- ============================================
-- NOTIFICACIONES DE DEMOSTRACIÓN
-- ============================================
insert into public.notifications (user_id, type, title, body) values
  ('00000000-0000-0000-0000-000000000003', 'profile_approved', 'Perfil aprobado', 'Tu perfil ha sido aprobado. Ya puedes ver servicios disponibles.'),
  ('00000000-0000-0000-0000-000000000003', 'new_service', 'Nuevo servicio disponible', 'Hay un nuevo servicio compatible en tu zona.'),
  ('00000000-0000-0000-0000-000000000006', 'registration_received', 'Registro recibido', 'Hemos recibido tu solicitud. Fulltech la revisará pronto.');

-- ============================================
-- CONFIGURACIÓN DE LA APLICACIÓN
-- ============================================
insert into public.app_settings (key, value, description) values
  ('allow_both_worker_type', 'true', 'Permitir que un colaborador se registre como técnico y ayudante'),
  ('require_birth_date', 'false', 'Requerir fecha de nacimiento en el registro'),
  ('require_good_conduct', 'false', 'Requerir documento de buena conducta'),
  ('require_location_evidence', 'false', 'Requerir evidencia de ubicación al finalizar'),
  ('currency', '"RD$"', 'Moneda de la aplicación'),
  ('timezone', '"America/Santo_Domingo"', 'Zona horaria de la aplicación')
on conflict (key) do nothing;
