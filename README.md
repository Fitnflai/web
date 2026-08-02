# Fitnflai Admin Panel 

Panel de administración para la app Fitnflai.

## Stack
- React 19 + TypeScript + Vite
- TailwindCSS + Zustand + React Query
- Axios (API-Ready — actualmente con mocks)

## Inicio rápido
```bash
npm install
npm run dev
```

## Estructura
```
src/
├── components/
│   ├── layout/     # Sidebar, Topbar, AdminLayout
│   └── ui/         # Badge, Button, Modal, Toggle, etc.
├── pages/          # Una página por módulo
├── routes/         # router.tsx + AdminApp
├── services/
│   ├── api/        # client.ts (Axios) — swap URL para producción
│   ├── endpoints/  # usersService, etc.
│   └── mocks/      # Datos demo mientras no hay backend
├── store/          # useAppStore (Zustand Slices)
├── types/          # Todos los tipos TypeScript
├── constants/      # Constantes globales
└── utils/          # cn(), formatDate(), getPlanState(), etc.
```

## Conectar el backend
1. Cambiar `USE_MOCK = false` en `src/services/endpoints/users.ts`
2. Actualizar `VITE_API_URL` en `.env`
3. Los servicios usan el mismo `apiClient` de Axios

## Añadir nueva página
1. Crear `src/pages/NuevaPagina.tsx`
2. Añadir el `NavPage` type en `src/types/index.ts`
3. Agregar case en `src/pages/AdminApp.tsx`
4. Agregar item en `src/components/layout/Sidebar.tsx`
