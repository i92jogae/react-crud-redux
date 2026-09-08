# User Management Dashboard

Aplicación frontend para gestionar usuarios con **React**, **TypeScript**, **Redux Toolkit**, **RTK Query**, **React Hook Form**, **Zod** y **Tailwind CSS**.

El objetivo del proyecto es evolucionar un CRUD básico hacia una pequeña aplicación de gestión con una arquitectura más cercana a un entorno profesional: estado global tipado, API simulada, caché, optimistic UI, formularios validados, feedback visual, pruebas automatizadas y CI/CD.

## Stack

- React
- TypeScript
- Redux Toolkit
- RTK Query
- React Redux
- React Hook Form
- Zod
- Tailwind CSS
- Sonner
- Vitest
- React Testing Library
- GitHub Actions
- Vite

## Funcionalidades

- Listado de usuarios.
- Creación de usuarios.
- Edición de usuarios.
- Eliminación con confirmación.
- Validación de formularios con Zod.
- Mensajes de error por campo.
- Feedback visual con toasts.
- Búsqueda por nombre, email o usuario de GitHub.
- Ordenación por nombre, email o GitHub.
- Estados de carga y error.
- Empty states para mejorar la experiencia de usuario.
- Persistencia en localStorage.
- API simulada con RTK Query.
- Caché e invalidación de datos.
- Optimistic UI en edición y eliminación.
- Tests unitarios y de integración.
- Workflow de CI con lint, typecheck, test y build.

## Arquitectura

```txt
src/
├── components/
│   ├── CreateNewUser.tsx
│   ├── DashboardStats.tsx
│   ├── EditUserModal.tsx
│   └── ListOfUsers.tsx
├── hooks/
│   ├── store.ts
│   └── useUserActions.ts
├── store/
│   ├── index.ts
│   └── users/
│       ├── api.ts
│       ├── schema.ts
│       ├── slice.ts
│       ├── storage.ts
│       └── types.ts
└── test/
    └── test-utils.tsx
```

### Store

La store se configura con `configureStore` y combina dos piezas principales:

- `usersUi`: estado de interfaz para búsqueda y ordenación.
- `usersApi`: capa de datos creada con RTK Query.

También se añaden middlewares para persistencia de filtros y gestión centralizada de errores.

### RTK Query

El proyecto usa `createApi` con `fakeBaseQuery` para simular una API sin depender de un backend real. Esto permite trabajar con patrones habituales en proyectos profesionales:

- queries
- mutations
- loading states
- error states
- cache
- tag invalidation
- optimistic updates

### Formularios

Los formularios están gestionados con React Hook Form y validados con Zod. Los tipos del formulario se infieren directamente desde el schema, reduciendo duplicidad y manteniendo alineadas las reglas de validación con TypeScript.

### Testing

El proyecto incluye tests para:

- reducers del estado de interfaz
- endpoints de RTK Query
- creación de usuarios
- listado, búsqueda y eliminación de usuarios

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Instalación

```bash
npm install
npm run dev
```

## Decisiones técnicas

### ¿Por qué Redux Toolkit?

Redux Toolkit es la forma moderna y recomendada de trabajar con Redux. Permite reducir boilerplate, configurar la store con buenas prácticas por defecto, crear slices de forma más limpia y escribir actualizaciones inmutables de una manera más sencilla gracias a Immer.

### ¿Por qué RTK Query?

RTK Query permite centralizar la capa de datos y gestionar automáticamente estados de carga, errores, caché e invalidación. Aunque en este proyecto se usa una API simulada, la arquitectura queda preparada para sustituirla por una API REST real.

### ¿Por qué React Hook Form + Zod?

React Hook Form simplifica la gestión de formularios y Zod permite definir validaciones reutilizables y tipadas. Juntos ayudan a construir formularios más robustos, mantenibles y fáciles de testear.

## Próximas mejoras posibles

- Paginación.
- Filtros avanzados.
- Modo claro/oscuro.
- Integración con una API REST real.
- Autenticación.
- Roles de usuario.
- Tabla con selección múltiple.
- Tests end-to-end con Playwright.
