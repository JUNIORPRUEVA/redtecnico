# Plan de Implementación — Red Técnico Fulltech (Flutter)

## 1. Diagnóstico del repositorio

### Tecnologías encontradas
El repositorio actual contiene una aplicación **Next.js 16** (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui, con backend **Supabase** (PostgreSQL, Auth, Storage). Incluye:

- Migraciones SQL (`supabase/migrations/0001_initial_schema.sql`, `0002_rls_policies_and_rpc.sql`).
- Seed de desarrollo (`supabase/seed/seed.sql`).
- Lógica de negocio en `src/domain/` (máquina de estados y compatibilidad de servicios).
- Servicios de acceso a datos en `src/services/`.
- Pruebas Vitest y configuración Playwright.

### Qué se conservará
- **Supabase** como backend (PostgreSQL, Auth, Storage, RLS, RPC). La estructura de tablas es correcta y se reutiliza.
- **Migraciones SQL** y **seed** (se ajustarán si es necesario mediante migraciones seguras).
- **Lógica de negocio** (máquina de estados, compatibilidad de servicios) que se portará a Dart.
- **Modelo de datos** y **matriz de roles** definidos.

### Qué se reemplazará
- Todo el frontend Next.js/React se reemplaza por **Flutter**.
- La interfaz, el enrutamiento, el estado y las pantallas se reconstruyen en Dart.

### Estrategia de migración
1. Crear una carpeta limpia `apps/fulltech_technicians_flutter/` para el proyecto Flutter.
2. Conservar el proyecto Next.js como referencia temporal (no se elimina hasta que Flutter cubra los flujos críticos).
3. Portar la lógica de negocio y el modelo de datos a Dart.
4. Reutilizar Supabase tal cual (migraciones y RLS ya existentes).

---

## 2. Arquitectura Flutter

Arquitectura **feature-first**, limpia y escalable, con separación de interfaz, dominio y datos.

```
apps/fulltech_technicians_flutter/lib/
├── app/
│   ├── app.dart
│   ├── bootstrap.dart
│   ├── router/
│   ├── theme/
│   └── responsive/
├── core/
│   ├── config/
│   ├── constants/
│   ├── errors/
│   ├── extensions/
│   ├── networking/
│   ├── security/
│   ├── storage/
│   ├── utils/
│   └── widgets/
├── features/
│   ├── authentication/
│   ├── onboarding/
│   ├── technician_profile/
│   ├── admin_dashboard/
│   ├── workers_management/
│   ├── services/
│   ├── service_applications/
│   ├── service_assignments/
│   ├── service_execution/
│   ├── completion_reports/
│   ├── payments/
│   ├── notifications/
│   ├── ratings/
│   ├── audit/
│   └── settings/
├── shared/
│   ├── models/
│   ├── providers/
│   └── widgets/
└── main.dart
```

Cada módulo usa:
- **data**: repositorios, DTO, fuentes de datos, acceso a Supabase.
- **domain**: entidades, contratos, reglas, casos de uso.
- **presentation**: páginas, widgets, controladores, providers.

---

## 3. Paquetes elegidos

| Paquete | Uso |
|---------|-----|
| `flutter_riverpod` | Estado e inyección de dependencias |
| `go_router` | Navegación y protección de rutas |
| `freezed_annotation` + `freezed` | Modelos inmutables |
| `json_serializable` + `json_annotation` | Serialización |
| `dio` | Peticiones HTTP externas |
| `supabase_flutter` | Cliente principal de Supabase |
| `flutter_secure_storage` | Datos sensibles en dispositivos |
| `shared_preferences` | Preferencias no sensibles |
| `hive` | Caché local y borradores offline |
| `image_picker` | Fotografías |
| `file_picker` | Documentos |
| `geolocator` | Ubicación opcional |
| `url_launcher` | Llamadas, WhatsApp, Google Maps |
| `connectivity_plus` | Detección de conexión |
| `flutter_local_notifications` | Notificaciones locales |
| `intl` | Fechas, moneda, formatos dominicanos |
| `logger` | Registros de desarrollo |
| `sentry_flutter` | Errores de producción (abstracción) |
| `formz` | Validadores reutilizables |
| `uuid` | Identificadores idempotentes |

---

## 4. Modelo de datos

Se reutiliza el esquema Supabase existente. Tablas principales:

`profiles`, `user_roles`, `worker_profiles`, `worker_documents`, `document_types`, `specialties`, `worker_specialties`, `provinces`, `municipalities`, `sectors`, `worker_service_areas`, `worker_availability`, `worker_tools`, `clients`, `services`, `service_specialties`, `service_requirements`, `service_invitations`, `service_applications`, `service_assignments`, `service_team_members`, `service_status_history`, `service_comments`, `service_attachments`, `service_checklist_items`, `service_checklist_responses`, `service_completion_reports`, `service_materials`, `service_expenses`, `service_incidents`, `worker_ratings`, `payments`, `notifications`, `admin_notes`, `audit_logs`, `app_settings`.

- UUID como clave primaria.
- `created_at`, `updated_at`, `created_by`, `updated_by`.
- Índices, foreign keys, constraints, triggers para `updated_at`.
- Auditoría en `audit_logs`.

---

## 5. Matriz de roles y permisos

| Rol | Permisos |
|-----|----------|
| `superAdmin` | Administración global, gestión de administradores, configuraciones críticas |
| `admin` | Operación: servicios, colaboradores, pagos, calificaciones, aprobaciones |
| `technician` | Ver servicios compatibles, aceptar/solicitar, ejecutar, reportar |
| `helper` | Apoyar en servicios asignados |

### Estados del colaborador
`draft` → `pendingReview` → `approved` | `rejected` | `suspended` | `inactive`

- Nuevo usuario queda en `pendingReview`.
- Solo `admin`/`superAdmin` aprueban o suspenden.
- Solo `superAdmin` crea administradores y modifica configuraciones críticas.
- Validaciones también en Supabase (RLS + RPC), no solo ocultando botones.

---

## 6. Máquina de estados del servicio

`draft` → `published` → `receivingApplications` → `assigned` → `accepted` → `onTheWay` → `arrived` → `inProgress` → `pendingEvidence` → `submittedForReview` → `completed` | `correctionRequested` | `cancelled` | `expired`

Transiciones validadas por rol en backend (RPC `transition_service_status`). Cada cambio registra estado anterior, nuevo, usuario, fecha, comentario, ubicación opcional, dispositivo y motivo.

### Modalidades de asignación
1. **`directAcceptance`** — aceptación atómica vía RPC (evita dobles asignaciones).
2. **`application`** — solicitud y selección por administrador.
3. **`privateAssignment`** — asignación directa por administrador.

---

## 7. Estrategia RLS

- RLS activa en todas las tablas sensibles.
- Técnico: ve/edita su perfil, sus documentos, servicios compatibles, dirección completa solo cuando está asignado, sus solicitudes/asignaciones/pagos. No puede aprobarse, calificarse, editar pagos, ver perfiles privados ajenos ni notas internas.
- Admin: gestiona operación, no puede otorgarse `superAdmin` ni alterar auditoría.
- SuperAdmin: administración global.
- Pruebas de RLS incluidas.

---

## 8. Estrategia offline

- Detectar conexión con `connectivity_plus`.
- Mostrar indicador "Sin conexión".
- Guardar borradores de formularios en Hive.
- Cola local de operaciones permitidas con reintento.
- Identificadores idempotentes (`uuid`) para evitar duplicaciones.
- No confirmar aceptación de servicio sin respuesta del servidor.
- No cambiar estados críticos completamente offline.
- No guardar documentos sensibles indefinidamente.

---

## 9. Estrategia PWA (Flutter Web)

- Configurar `manifest.json`, iconos, nombre, colores.
- Service worker de Flutter.
- Instalable como PWA.
- Página offline.
- Caché segura (no documentos privados).
- Responsive.
- HTTPS.
- Deep links.
- Informar actualización de versión.

---

## 10. Estrategia Android

- `applicationId` profesional y modificable.
- Nombre visible, ícono, splash screen.
- Permisos mínimos (cámara, galería, ubicación solo cuando se requiera, internet).
- Build flavors: `development`, `staging`, `production`.
- Variables por entorno.
- Versionado.
- Generación de APK y AAB.
- No guardar keystore en Git.

---

## 11. Riesgos

- **Aceptación simultánea**: mitigado con RPC atómico.
- **Acceso indebido a documentos**: mitigado con buckets privados + URLs firmadas + RLS.
- **Pérdida de formularios**: mitigado con borradores en Hive.
- **Doble envío de reportes**: mitigado con idempotencia.
- **Overflow en pantallas pequeñas**: mitigado con diseño responsive y pruebas.
- **Dependencias web incompatibles**: se evita copiar dependencias del proyecto Next.js.
- **Complejidad excesiva**: se prioriza estabilidad sobre cantidad de módulos.

---

## 12. Fases

### Fase 1 — Base
Inspección, plan, proyecto Flutter, tema, responsive, Supabase, autenticación, roles, navegación protegida.

### Fase 2 — Registro y aprobación
Onboarding por pasos, documentos, aprobación, gestión administrativa de colaboradores.

### Fase 3 — Servicios
Creación, publicación, filtros, solicitudes, asignación, aceptación transaccional.

### Fase 4 — Ejecución
Estados, evidencias, reporte, revisión, correcciones.

### Fase 5 — Administración
Pagos, calificaciones, notificaciones, auditoría, reportes.

### Fase 6 — Entrega
Offline, PWA, APK, AAB, responsive, pruebas, seguridad, documentación, optimización.

Al terminar cada fase: `flutter pub get`, `dart format .`, `flutter analyze`, `flutter test`, `flutter build apk --debug`, `flutter build web --release`. Corregir todos los errores antes de continuar.

---

## 13. Criterios de aceptación

La aplicación estará lista cuando:
- Un técnico pueda registrarse, cargar documentos y quedar pendiente.
- El administrador pueda aprobarlo.
- El técnico aprobado vea trabajos compatibles.
- Pueda solicitar o aceptar (aceptación directa atómica).
- Fulltech pueda asignar técnicos y ayudantes.
- El técnico pueda actualizar estados y registrar evidencias.
- No pueda finalizar incompleto.
- Fulltech pueda solicitar corrección, completar, calificar y registrar pago.
- El técnico pueda consultar su pago.
- Un suspendido no pueda operar.
- RLS bloquee accesos indebidos.
- Compile como APK, AAB y Flutter Web.
- La web sea instalable como PWA.
- Funcione en móvil y escritorio sin overflow ni errores críticos.
- Exista documentación de despliegue.
