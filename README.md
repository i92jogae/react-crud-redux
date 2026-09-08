# Redux Users Dashboard

Demo: https://redux-users-dashboard.netlify.app/

User Management Dashboard built with React, TypeScript, Redux Toolkit, RTK Query, React Hook Form, Zod, Tailwind CSS and Vitest.

## Overview

This project is a frontend dashboard for managing users. It includes CRUD actions, form validation, search, sorting, local persistence and a simulated API layer using RTK Query.

The goal of the project is to demonstrate a production-oriented frontend structure: typed global state, separated responsibilities, reusable components, automated tests and a CI pipeline.

## Features

- Create, edit and delete users.
- Search users by name, email or GitHub username.
- Sort table data by name, email or GitHub profile.
- Form validation with React Hook Form and Zod.
- Simulated API layer with RTK Query.
- Cache invalidation and optimistic updates.
- Local persistence with `localStorage`.
- Responsive UI built with Tailwind CSS.
- Custom favicon and subtle CSS animations.
- Automated checks with ESLint, TypeScript, Vitest and GitHub Actions.

## Tech stack

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
- Testing Library
- Vite
- GitHub Actions
- Netlify

## Architecture

The project is organized around feature-based responsibilities:

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

## Key decisions

### Redux Toolkit for UI state

Redux Toolkit is used to manage dashboard UI state such as search filters and table sorting.

### RTK Query for the data layer

User operations are handled through RTK Query, which provides a realistic API-oriented structure while keeping the project self-contained.

### React Hook Form + Zod

Forms are validated using a schema-first approach, keeping validation rules centralized and reusable.

### LocalStorage persistence

The app persists users and UI preferences in `localStorage`, so the demo keeps state between page reloads.

### Testing and CI

The project includes unit and component tests, plus a GitHub Actions workflow that runs linting, type checking, tests and production build on every push or pull request to `main`.

## Available scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

## Getting started

```bash
git clone https://github.com/i92jogae/react-crud-redux.git
cd react-crud-redux
npm install
npm run dev
```

## Production

```bash
npm run build
```

The production build is deployed on Netlify:

```txt
https://redux-users-dashboard.netlify.app/
```

## Possible improvements

- Add pagination for bigger datasets.
- Replace the simulated API with a real backend.
- Add user roles and status labels.
- Add e2e tests with Playwright.
- Add a dark/light mode toggle.
