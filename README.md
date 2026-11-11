# Vendra

Plataforma SaaS para la gestion de inventario y facturacion de PYMES venezolanas.
Proyecto academico para la asignatura Evaluacion de Proyectos (225) de la
Universidad Nacional Abierta (UNA), carrera Ingenieria de Sistemas.

> Version actual: **2.3.5** · Tests: **396 passing** · React 19 + TypeScript + Vite

## Que es Vendra

Vendra digitaliza dos procesos criticos de una PYME: el control del inventario
y la emision de facturas. Reemplaza los cuadernos y hojas de calculo por una
interfaz web moderna que funciona desde cualquier dispositivo con internet.

Permite registrar productos con foto, precio y stock, generar facturas con
calculo automatico de IVA, descontar stock al vender, cambiar el estado de las
facturas, descargar facturas en PDF, recibir notificaciones persistentes y
visualizar metricas de ventas en un dashboard.

La aplicacion se puede usar en dos modos:

- **Modo mock** (default): los stores de Zustand trabajan con datos en memoria.
  Ideal para demos offline, tests y desarrollo sin backend levantado.
- **Modo backend**: los stores consumen una API REST real. Se activa con la
  variable `VITE_USE_BACKEND=true` y la URL `VITE_API_URL`.

## Stack

| Capa | Tecnologia |
|---|---|
| UI | React 19, TypeScript 6 |
| Bundler | Vite 8 (rolldown) |
| Routing | React Router v7 |
| Estado global | Zustand 5 (persist middleware) |
| Formularios | React Hook Form 7 + Zod 4 |
| Estilos | CSS Modules (sin frameworks CSS) |
| Graficos | Recharts 3 |
| Iconos | lucide-react |
| HTTP | Axios 1 |
| Testing | Vitest 5 + Testing Library + jsdom |
| Calidad | ESLint 10 + Husky + Commitlint + commit-and-tag-version |

## Como ejecutar

```bash
# 1. Clonar e instalar
git clone https://github.com/axeljimenezdeveloper/mi-saas-frontend.git
cd mi-saas-frontend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# por defecto: VITE_USE_BACKEND=false (mock mode)

# 3. Levantar en modo desarrollo
npm run dev
# http://localhost:5173
```

Credenciales demo (mock mode): `admin@vendra.com` / `admin123`.
Tambien se puede usar el boton **"Crear cuenta de prueba"** en el login
para generar una cuenta nueva con auto-login.

### Modo backend

Para consumir la API real, editar `.env`:

```
VITE_USE_BACKEND=true
VITE_API_URL=http://localhost:3000
```

La API debe exponer los endpoints definidos en `src/api/` (auth, company,
inventory, billing, notifications). Los adapters de esa carpeta mapean el
contrato HTTP del backend a los tipos del frontend.

## Scripts

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de produccion (tsc + vite) |
| `npm run preview` | Servir el build localmente |
| `npm run test` | Vitest en modo watch |
| `npm run test:run` | Vitest una sola vez (CI) |
| `npm run test:coverage` | Vitest con reporte de cobertura |
| `npm run lint` | ESLint sobre todo el proyecto |
| `npm run release` | Bump de version + CHANGELOG + tag |


## Estructura del proyecto

```
src/
├── api/            Cliente Axios + adapters por modulo
├── components/     Design system (30 componentes compartidos)
│   ├── common/         Button, Input, Card, Table, Modal, ...
│   ├── feedback/       Alert, Toast, Spinner, Skeleton, ErrorBoundary
│   ├── forms/          FormField, FormGroup, CurrencyInput, ImageUploader
│   └── layout/         MainLayout, AppLayout, Header, Sidebar, ...
├── config/         Feature flag backend + constantes
├── features/       Modulos por dominio (auth, dashboard, billing, ...)
├── hooks/          Hooks compartidos (useMediaQuery)
├── routes/         React Router v7 + ProtectedRoute
├── schemas/        Schemas Zod (compartidos con el backend)
├── stores/         Zustand stores (7 stores)
├── styles/         Sistema de diseno 3 capas (tokens, themes, base)
└── test/           Setup de Vitest + sanity test
```

Convencion: cada componente compartido vive en su propia carpeta con exactamente
4 archivos: `Nombre.tsx`, `Nombre.module.css`, `Nombre.test.tsx`, `index.ts`.

## Feature flag: mock vs backend

El archivo `src/config/backend.ts` exporta `USE_BACKEND`, que se resuelve con:

1. `MODE === 'test'` → siempre `false` (tests con mocks)
2. `VITE_USE_BACKEND === 'true'` → `true` (modo backend)
3. Default → `false` (modo mock)

Cada store de dominio (`productsStore`, `invoicesStore`, `notificationsStore`,
`companyStore`) tiene dos ramas internas:

- **Mock mode**: operaciones sincronicas sobre el array en memoria.
- **Backend mode**: optimistic update local + request HTTP con rollback.

La API publica de cada store no cambia entre modos.

## Autenticacion

- JWT almacenado en `localStorage` (`mi-saas-auth-token`).
- El cliente Axios adjunta `Authorization: Bearer <token>` automaticamente.
- Response interceptor detecta 401 → logout + redirect a `/login`.
- `rememberMe` controla si el usuario persiste entre sesiones.
- `ProtectedRoute` valida `isAuthenticated` y opcionalmente `isConfigured`.

## Notificaciones

Cada toast se registra como notificacion persistente (max 50). Categorias:
`system`, `inventory`, `billing`, `auth`. En backend mode hay polling cada
15s para refrescar el badge del header. `/notifications` permite filtrar
por estado, categoria y acciones masivas.

## Documentacion

- **`Documento.txt`** — manual de operaciones del proyecto (reglas de trabajo,
  arquitectura, protocolo de commits, handoff al backend).
- **`/docs`** (ruta in-app) — documentacion conceptual para el evaluador
  academico: que es Vendra, que problema resuelve, como funciona, roadmap.
- **`CHANGELOG.md`** — historial completo de cambios por version.

## Roadmap

Completado en v2.3.5:

- Design system con 30 componentes
- Autenticacion JWT + onboarding wizard
- Inventario CRUD con imagenes
- Facturacion con IVA dinamico + PDF
- Dashboard con metricas y graficos
- Notificaciones persistentes
- Integracion backend via feature flag
- Cobertura de tests en todas las paginas

Proximos pasos:

- Backend REST completo (Express + Prisma + PostgreSQL)
- Multi-usuario por empresa con roles
- Reportes avanzados (ventas por periodo, margenes)
- Deploy a produccion (Vercel + Railway)

## Autor

**Axel Gabriel Jimenez Malaver** · C.I. 27.870.662
Ingenieria de Sistemas · Universidad Nacional Abierta
Evaluacion de Proyectos (225) · Lapso 2026-2

Repositorio: https://github.com/axeljimenezdeveloper/mi-saas-frontend
