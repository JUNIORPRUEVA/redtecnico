# Red Técnico Fulltech

Aplicación PWA profesional para construir y administrar una red privada de técnicos y ayudantes aliados de **FULLTECH SRL**. Permite registrar colaboradores, aprobarlos, publicar trabajos técnicos, asignarlos de forma segura, seguir su ejecución, recibir evidencias, aprobar finalizaciones, calificar y registrar pagos.

> **Importante:** Esta es una red de aliados para recibir oportunidades de trabajos eventuales. No constituye una promesa de empleo fijo ni de cantidad garantizada de servicios.

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript estricto |
| Interfaz | Tailwind CSS v4 + componentes accesibles (shadcn/ui) |
| Backend / BD | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage (buckets privados + URLs firmadas) |
| Seguridad | Row Level Security (RLS) en todas las tablas sensibles |
| Formularios | React Hook Form + Zod |
| Estado / consultas | TanStack Query |
| Mapas | Enlaces a Google Maps + coordenadas (estructura preparada para Mapbox/Google Maps) |
| PWA | Manifiesto, service worker, instalación, página offline |
| Pruebas | Vitest (lógica) + Playwright (flujos críticos) |
| Calidad | ESLint, Prettier, TypeScript estricto |

---

## Requisitos

- Node.js 20 o superior
- npm
- Una cuenta de Supabase (proyecto PostgreSQL + Auth + Storage)
- (Opcional) Cuenta de Vercel para despliegue

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd REDTECNICO_FULLTECH

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con las credenciales de Supabase

# 4. Ejecutar migraciones en Supabase
# (ver sección "Configuración Supabase")

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Crear un archivo `.env.local` con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key  # SOLO en servidor, nunca exponer
```

> **Seguridad:** La `SUPABASE_SERVICE_ROLE_KEY` es una clave secreta. Nunca debe exponerse en el frontend ni en variables `NEXT_PUBLIC_`. Solo se usa en código de servidor (RPC, migraciones, seeds).

---

## Configuración Supabase

### 1. Crear el proyecto

1. Crear un proyecto en [Supabase](https://supabase.com).
2. Copiar la URL del proyecto y la anon key.

### 2. Ejecutar migraciones

En el SQL Editor de Supabase, ejecutar en orden:

1. `supabase/migrations/0001_initial_schema.sql` — esquema completo (tablas, índices, enums).
2. `supabase/migrations/0002_rls_policies_and_rpc.sql` — políticas RLS y funciones RPC.

### 3. Crear buckets de Storage

Crear los siguientes buckets **privados**:

- `worker-documents` — documentos de colaboradores (cédula, certificados, etc.)
- `service-attachments` — evidencias y archivos de servicios
- `avatars` — fotos de perfil

### 4. Crear el primer super_admin

Ejecutar en el SQL Editor (reemplazando el correo):

```sql
-- 1. Crear el usuario en Supabase Auth (desde la UI o API)
-- 2. Luego ejecutar:
insert into public.profiles (id, email, full_name, role)
values ('<UUID-del-usuario-auth>', 'admin@fulltech.com', 'Administrador', 'super_admin')
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
values ('<UUID-del-usuario-auth>', 'super_admin')
on conflict do nothing;
```

### 5. Cargar datos base (especialidades, provincias, municipios, sectores)

Ejecutar `supabase/seed/seed.sql` en el SQL Editor para cargar datos de demostración (especialidades, provincias de República Dominicana priorizando La Altagracia e Higüey, municipios, sectores, clientes ficticios, servicios de ejemplo, etc.).

> Los datos seed son solo para desarrollo. No mezclar con producción.

---

## Ejecución local

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción (Webpack)
npm run start        # Servidor de producción
npm run lint         # ESLint
npm run typecheck    # TypeScript estricto
npm run test         # Pruebas unitarias (Vitest)
npm run test:e2e     # Pruebas end-to-end (Playwright)
npm run db:seed      # Ejecutar seed (requiere tsx y credenciales)
```

---

## Estructura del proyecto

```
src/
├── app/                    # Rutas de Next.js (App Router)
│   ├── (public)            # Landing, login, registro, términos, etc.
│   ├── app/                # Portal del colaborador (mobile-first)
│   │   ├── services/       # Servicios disponibles
│   │   ├── jobs/           # Mis trabajos asignados
│   │   ├── notifications/  # Notificaciones
│   │   └── profile/        # Perfil del colaborador
│   ├── admin/              # Portal administrativo
│   │   ├── services/       # Gestión de servicios
│   │   ├── workers/        # Gestión de colaboradores
│   │   ├── requests/       # Solicitudes de aprobación
│   │   ├── payments/       # Pagos
│   │   ├── specialties/    # Catálogo de especialidades
│   │   ├── audit/          # Auditoría
│   │   └── settings/       # Configuración
│   └── register/           # Onboarding por pasos
├── components/
│   └── ui/                 # Componentes base (shadcn/ui)
├── domain/                 # Lógica de negocio pura
│   ├── service-state-machine.ts
│   └── service-compatibility.ts
├── hooks/                  # Hooks de TanStack Query
├── lib/
│   └── supabase/           # Clientes Supabase (browser, server, service)
├── services/               # Capa de acceso a datos
├── types/                  # Tipos TypeScript
└── __tests__/              # Pruebas unitarias
supabase/
├── migrations/             # Migraciones SQL versionadas
└── seed/                   # Datos seed de desarrollo
public/                     # Manifiesto PWA, service worker, iconos
e2e/                        # Pruebas Playwright
docs/                       # Documentación
```

---

## Roles del sistema

| Rol | Descripción |
|-----|-------------|
| `super_admin` | Acceso total, gestiona administradores y configuración crítica |
| `admin` | Gestiona operación: servicios, colaboradores, pagos, calificaciones |
| `technician` | Técnico aprobado que ejecuta servicios |
| `helper` | Ayudante aprobado que apoya en servicios |

### Estados del perfil operativo

`draft` → `pending_review` → `approved` | `rejected` | `suspended` | `inactive`

- Un usuario recién registrado queda en `pending_review`.
- Solo `admin` y `super_admin` pueden aprobar, rechazar, suspender o reactivar.
- Solo `super_admin` gestiona administradores y configuraciones críticas.

---

## Estados del servicio

`draft` → `published` → `receiving_applications` → `assigned` → `accepted` → `on_the_way` → `arrived` → `in_progress` → `pending_evidence` → `submitted_for_review` → `completed` | `correction_requested` | `cancelled` | `expired`

Las transiciones están validadas por rol en el servidor (función RPC `transition_service_status`). Cada cambio se registra en `service_status_history` (historial inmutable).

### Modalidades de asignación

1. **`direct_acceptance`** — el primer colaborador elegible que confirme obtiene la asignación (aceptación atómica vía RPC, evita dobles asignaciones).
2. **`application`** — los colaboradores envían solicitud y el administrador decide.
3. **`private_assignment`** — el administrador asigna directamente.

---

## Seguridad

- **Row Level Security (RLS)** activa en todas las tablas sensibles.
- Un colaborador solo ve y modifica su propio perfil.
- No puede aprobarse a sí mismo ni modificar su calificación o pagos.
- Solo ve servicios compatibles y publicados.
- Solo ve la dirección completa cuando está asignado.
- Solo modifica servicios donde está asignado y mediante transiciones permitidas.
- Un administrador no puede cambiar permisos de `super_admin`.
- Auditoría de acciones sensibles en `audit_logs`.
- Validación de autorización en servidor (no solo ocultando botones).
- Documentos en buckets privados con URLs firmadas de duración limitada.
- La `service_role_key` nunca se expone en el frontend.

---

## PWA y conexión limitada

- Manifiesto (`public/manifest.webmanifest`) con nombre corto, colores e iconos.
- Service worker (`public/sw.js`) con caché de recursos estáticos.
- Página offline (`/offline`).
- Detección de conexión y estado "Sin conexión".
- Borradores locales seguros para formularios largos.
- No se almacenan documentos sensibles de forma permanente en caché.
- Acciones críticas idempotentes o transaccionales (validación en servidor).

---

## Pruebas

```bash
npm run test          # Vitest (lógica de negocio)
npm run test:e2e      # Playwright (flujos críticos)
```

Cobertura actual:
- Máquina de estados de servicios (transiciones permitidas por rol).
- Compatibilidad de servicios por zona y especialidad.
- (Playwright) Flujos principales de registro, aprobación y ejecución.

---

## Despliegue

### Frontend en Vercel

1. Conectar el repositorio a Vercel.
2. Configurar las variables de entorno (ver sección "Variables de entorno").
3. El script `build` usa Webpack (`next build --webpack`), estable en todas las plataformas.
4. Desplegar. HTTPS es automático.

### Supabase

- Backend, Auth, Storage y PostgreSQL están alojados en Supabase.
- Configurar variables separadas para desarrollo, pruebas y producción.
- Dominio personalizado posterior (opcional).

---

## Procedimiento de respaldo y restauración

1. **Base de datos:** En Supabase, usar la función de respaldo (Backups) o `pg_dump`.
2. **Storage:** Los buckets privados se respaldan con la herramienta de Supabase o descargando los archivos.
3. **Restauración:** Ejecutar las migraciones en orden y restaurar el respaldo de datos.

---

## Funciones futuras (no implementadas en esta versión)

- Portal de clientes.
- Tienda / marketplace de servicios.
- Solicitud de servicios por clientes.
- Cotizaciones.
- Pagos en línea.
- Comisiones.
- Suscripciones.
- Inventario de materiales.
- Rutas y geolocalización avanzada.
- Aplicaciones móviles nativas.
- Operación para varias empresas.
- Integración con WhatsApp.
- Facturación.
- Inteligencia para recomendar técnicos.
- Ranking y niveles de técnicos.

La arquitectura está preparada para incorporar estos módulos sin reescribir la lógica del negocio.

---

## Documentación adicional

- [Plan de implementación](docs/implementation-plan.md) — diagnóstico, arquitectura, modelo de datos, matriz de roles, máquina de estados, riesgos, fases y criterios de aceptación.

---

## Licencia

Uso interno de FULLTECH SRL. No redistribuir sin autorización.
