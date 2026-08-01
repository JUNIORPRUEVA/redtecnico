# Plan de Implementación — Red Técnico Fulltech

> Documento vivo. Este plan guía el desarrollo de la PWA "Red Técnico Fulltech" de FULLTECH SRL.

---

## 1. Diagnóstico del repositorio

- **Estado inicial:** Repositorio vacío (no es repositorio git todavía).
- **Herramientas disponibles:** Node v24.14.1, npm 11.11.0, git, curl, python.
- **Decisión:** Se inicializará un proyecto Next.js desde cero con TypeScript, App Router y Tailwind CSS. Se inicializará git para control de versiones.

---

## 2. Arquitectura propuesta

### Stack
- **Frontend:** Next.js (App Router) + TypeScript estricto + Tailwind CSS + shadcn/ui.
- **Backend/BD:** Supabase (PostgreSQL, Auth, Storage, RLS).
- **Formularios:** React Hook Form + Zod.
- **Estado/consultas:** TanStack Query.
- **PWA:** manifest, service worker, estrategia de caché básica.
- **Pruebas:** Vitest (lógica) + Playwright (flujos críticos).
- **Calidad:** ESLint, Prettier, TypeScript estricto.

### Separación de capas
- `src/lib/` → clientes de Supabase, utilidades, validadores.
- `src/domain/` → lógica de negocio pura (máquina de estados, compatibilidad, cálculos).
- `src/services/` → acceso a datos (repositorios) que respetan RLS.
- `src/components/` → componentes UI reutilizables.
- `src/app/` → rutas de la aplicación (App Router).

### Decisiones clave
- Toda la autorización se valida en servidor (RLS + funciones RPC), nunca solo ocultando botones.
- La aceptación directa de servicios usa una función RPC atómica para evitar dobles asignaciones.
- Los documentos sensibles se guardan en buckets privados con URLs firmadas de duración limitada.
- Zona horaria única: `America/Santo_Domingo`. Moneda: `RD$`.
- Capa de proveedor de notificaciones para agregar push/correo/WhatsApp sin reescribir negocio.

---

## 3. Modelo de datos

Tablas principales (todas con UUID PK, `created_at`, `updated_at`, `created_by` donde aplique):

- `profiles` — datos base del usuario autenticado.
- `user_roles` — roles del usuario (super_admin, admin, technician, helper).
- `worker_profiles` — perfil operativo del colaborador (estado, nivel, disponibilidad, etc.).
- `worker_documents` — documentos subidos (cédula, certificados, etc.).
- `worker_document_types` — catálogo de tipos de documento.
- `specialties` — catálogo de especialidades.
- `worker_specialties` — especialidades autorizadas por colaborador.
- `provinces`, `municipalities`, `sectors` — geografía dominicana.
- `worker_service_areas` — zonas donde trabaja el colaborador.
- `worker_availability` — disponibilidad (días, horarios).
- `worker_tools` — herramientas del colaborador.
- `clients` — clientes de Fulltech.
- `services` — servicios/trabajos.
- `service_specialties` — especialidades requeridas por servicio.
- `service_requirements` — requisitos obligatorios del servicio.
- `service_invitations` — invitaciones privadas.
- `service_applications` — solicitudes de colaboradores.
- `service_assignments` — asignaciones.
- `service_team_members` — miembros del equipo asignado.
- `service_status_history` — historial inmutable de estados.
- `service_comments` — comentarios cronológicos.
- `service_attachments` — archivos del servicio.
- `service_checklist_items` — checklist de finalización.
- `service_checklist_responses` — respuestas del checklist.
- `service_completion_reports` — reportes de finalización.
- `service_materials` — materiales usados.
- `service_expenses` — gastos.
- `service_incidents` — incidencias.
- `worker_ratings` — calificaciones.
- `payments` — pagos.
- `notifications` — notificaciones internas.
- `admin_notes` — notas internas (nunca visibles para el técnico).
- `audit_logs` — auditoría.
- `app_settings` — configuración de la aplicación.

### Índices
- Estado del servicio, provincia/municipio, fecha programada, especialidades, estado del trabajador, usuario asignado, servicios publicados, notificaciones no leídas, búsquedas frecuentes.

---

## 4. Diagrama textual de módulos

```
Red Técnico Fulltech
├── Público
│   ├── Landing
│   ├── Login
│   ├── Registro (onboarding 7 pasos)
│   ├── Recuperar contraseña
│   ├── Verificar correo
│   ├── Términos / Privacidad
│   └── Estado de solicitud
├── Colaborador (técnico/ayudante)
│   ├── Inicio
│   ├── Servicios disponibles
│   ├── Mis trabajos
│   ├── Notificaciones
│   └── Perfil
└── Administración
    ├── Dashboard
    ├── Servicios
    ├── Calendario
    ├── Técnicos y ayudantes
    ├── Solicitudes
    ├── Clientes
    ├── Pagos
    ├── Especialidades
    ├── Zonas
    ├── Notificaciones
    ├── Reportes
    ├── Configuración
    └── Auditoría
```

---

## 5. Matriz de roles y permisos

| Acción | super_admin | admin | technician | helper |
|--------|:-----------:|:-----:|:----------:|:------:|
| Ver dashboard admin | ✅ | ✅ | ❌ | ❌ |
| Aprobar/rechazar/suspender colaboradores | ✅ | ✅ | ❌ | ❌ |
| Gestionar administradores | ✅ | ❌ | ❌ | ❌ |
| Configuración crítica | ✅ | ❌ | ❌ | ❌ |
| Crear/publicar servicios | ✅ | ✅ | ❌ | ❌ |
| Asignar servicios | ✅ | ✅ | ❌ | ❌ |
| Ver servicios compatibles | ✅ | ✅ | ✅ | ✅ |
| Aceptar/solicitar servicios | ✅ | ✅ | ✅ | ✅ |
| Cambiar estados operativos del servicio | ✅ | ✅ | ✅ | ✅ |
| Enviar reporte de finalización | ✅ | ✅ | ✅ | ✅ |
| Aprobar finalización | ✅ | ✅ | ❌ | ❌ |
| Calificar | ✅ | ✅ | ❌ | ❌ |
| Registrar pagos | ✅ | ✅ | ❌ | ❌ |
| Ver sus propios pagos | ✅ | ✅ | ✅ | ✅ |
| Ver documentos de otros | ❌ | ❌ | ❌ | ❌ |
| Ver notas internas | ✅ | ✅ | ❌ | ❌ |
| Ver auditoría | ✅ | ✅ | ❌ | ❌ |

---

## 6. Máquina de estados del servicio

```
draft → published → receiving_applications → assigned → accepted → on_the_way
  → arrived → in_progress → paused → pending_evidence → submitted_for_review
  → completed | correction_requested | cancelled | expired
```

Transiciones permitidas por rol (resumen):
- `draft → published`: admin/super_admin.
- `published → assigned`: admin o aceptación atómica (RPC).
- `assigned → accepted`: colaborador asignado.
- `accepted → on_the_way → arrived → in_progress`: colaborador.
- `in_progress → submitted_for_review`: colaborador (si cumple checklist).
- `submitted_for_review → completed`: admin/super_admin.
- `submitted_for_review → correction_requested`: admin/super_admin.
- `correction_requested → submitted_for_review`: colaborador.
- Cualquier cancelación registra actor, fecha y razón.

---

## 7. Riesgos

| Riesgo | Mitigación |
|--------|-----------|
| Doble asignación en aceptación directa | Función RPC atómica con transacción y bloqueo de fila |
| Acceso no autorizado a datos | RLS en todas las tablas sensibles + validación en servidor |
| Fuga de documentos sensibles | Buckets privados + URLs firmadas de corta duración |
| Pérdida de formularios largos | Borradores locales seguros + sincronización |
| Errores de zona horaria | Normalización a America/Santo_Domingo |
| Dependencia de credenciales reales | .env.example + variables por entorno |
| Complejidad excesiva del MVP | Alcance acotado a 2 portales, módulos futuros solo preparados |

---

## 8. Fases

- **Fase 1:** Arquitectura, configuración, diseño base, autenticación, roles, rutas protegidas, BD inicial.
- **Fase 2:** Registro y aprobación de técnicos y ayudantes.
- **Fase 3:** Creación, publicación, filtrado y asignación de servicios.
- **Fase 4:** Ejecución del trabajo, estados, evidencias y reporte final.
- **Fase 5:** Administración, pagos, calificaciones, notificaciones y auditoría.
- **Fase 6:** PWA, modo conexión limitada, pruebas, optimización y documentación.

Al final de cada fase: TypeScript, lint, pruebas, verificación móvil/escritorio, revisión de permisos, commits y documentación.

---

## 9. Criterios de aceptación

1. Un usuario se registra, completa onboarding, sube documentos, envía solicitud y queda `pending_review`.
2. Un admin aprueba y el técnico obtiene acceso operativo.
3. Un admin crea y publica un servicio; solo lo ven colaboradores compatibles.
4. Dos técnicos aceptan simultáneamente un servicio directo; solo uno obtiene la asignación.
5. El técnico cambia estados correctamente hasta `in_progress`.
6. El técnico no puede finalizar sin evidencias obligatorias (el sistema indica qué falta).
7. El técnico envía reporte, admin solicita corrección, el técnico corrige y reenvía.
8. El admin aprueba finalización, califica y registra pago.
9. Un técnico suspendido no puede aceptar trabajo (el servidor lo rechaza).
10. Un técnico no puede consultar documentos/trabajos de otro (RLS lo impide).
11. La PWA es instalable y funciona con conexión limitada.
12. Toda la interfaz visible está en español, con RD$ y zona America/Santo_Domingo.
