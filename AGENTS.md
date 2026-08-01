# Fitnflai Admin Panel — Agent Guide

This repository contains the Admin Panel for the Fitnflai app, built with **React 19 + TypeScript + Vite + TailwindCSS + Zustand + React Query**.

---

### ⚠️ CRITICAL GOTCHAS (Read before coding!)

1. **Frozen Simulated Timeline (`2026-06-06`)**
   - The application mock data, progress logs, and reports are designed around a frozen baseline reference date: **`2026-06-06`**.
   - `TODAY` is defined in `src/constants/index.ts` as `'2026-06-06'`.
   - Local date checks (e.g., in `src/utils/index.ts`) also compare against `new Date('2026-06-06')`.
   - **Do NOT use standard `new Date()` for real-time calendar operations** when checking plan states or rendering logs. Doing so will break plan-state calculations and mock views.

2. **No URL Sub-Routes / Dynamic View Switching**
   - Even though `react-router-dom` is installed, there are **no sub-routes mapped to URLs**. The router (`src/routes/router.tsx`) only maps `/` and `*` (404).
   - All page switching is handled **dynamically** in `src/views/shared/AdminApp.tsx` based on store values (`userRole` and `currentPage`).
   - Switching pages is done by calling `setPage('page-id')` from `useAppStore()`.

3. **Eslint Command is Broken out-of-the-box**
   - `npm run lint` executes `eslint .` but will **fail** because ESLint v9 is installed and there is no `eslint.config.js` configuration file in the project.
   - Do not rely on ESLint validation in CI/CD without first creating or fixing the config file.

4. **Port & Adapter (Clean) Architecture**
   - Features under `src/core/` are structured using Port & Adapter architecture:
     - `src/core/domain/types.ts` contains the core types.
     - `src/core/repositories/ports.ts` defines domain interface repositories (e.g., `IBiometricRepository`, `INutritionRepository`).
     - `src/core/repositories/mocks/` contains mock implementations of those repositories.
     - `src/core/repositories/index.ts` instantiates those mock repositories. Use `useRepositories()` to consume them in views.

5. **Mock vs Real Backend Toggle**
   - Services default to mock data (`USE_MOCK = true` in `src/services/endpoints/users.ts`).
   - When connecting to the real backend, set `USE_MOCK = false`, and make sure `VITE_API_URL` is set in `.env` (the app uses Axios `apiClient` defined in `src/services/api/client.ts`).
   - The `apiClient` auto-injects JWTs from `localStorage.getItem('access_token')` and redirects unauthorized calls (`401`) to `/login`.

6. **Strongly Typed Translations (EN/ES)**
   - Translation strings reside in `src/i18n/locales/es.json` and `en.json`.
   - `TranslationKey` is recursively typed using TypeScript template literal types mapped to the structure of `es.json`.
   - Modifying key structures or adding keys requires keeping both files in sync and ensuring TypeScript does not throw type errors on `t('key.name')`.

---

### DEVELOPMENT & VERIFICATION COMMANDS

| Task | Command | Notes |
|---|---|---|
| **Install Dependencies** | `npm install` | |
| **Run Dev Server** | `npm run dev` | Spins up Vite local server |
| **Build for Production**| `npm run build` | Runs `tsc -b && vite build` |
| **Lint Check** | `npm run lint` | *Warning: Fails out-of-the-box due to missing eslint config* |
| **Run Tests** | *None* | No test framework is currently configured in `package.json` |

---

### ARCHITECTURAL SUMMARY & FILE PATHS

- **Zustand Slices (`src/store/slices/`)**:
  - `uiSlice.ts`: handles theme (`isDarkMode`), language (`'EN' | 'ES'`), and `userRole` (`'admin' | 'specialist'`).
  - `dataSlice.ts`: handles page state (`currentPage`) and selected users/patients/professionals.
  - `toastSlice.ts`: handles notifications & feedback toast elements.
- **Theme Variables**:
  - CSS Variables in `src/styles/globals.css` map to Tailwind theme values in `tailwind.config.js` (`surface-bg`, `surface-panel`, `surface-card`, etc.) to facilitate class-based dark mode switching.
- **To Add a New Page**:
  1. Create a page component (e.g., `src/views/admin/MyNewPage.tsx`).
  2. Add the page id (union literal) to the `NavPage` type inside `src/types/index.ts`.
  3. Register the rendering condition inside the `AdminApp` component in `src/views/shared/AdminApp.tsx`.
  4. Register the navigation item inside `src/components/layout/Sidebar.tsx` with its translation key.
