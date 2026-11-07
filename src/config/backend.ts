// src/config/backend.ts
// Feature flag de migracion frontend -> backend.
//
// VITE_USE_BACKEND=true  -> stores consumen la API real (localhost:3000)
// VITE_USE_BACKEND=false -> stores usan mocks en memoria (default, seguro para demo)
//
// En tests (Vitest) import.meta.env.VITE_USE_BACKEND es undefined, por lo que
// USE_BACKEND queda false y los tests existentes siguen funcionando con mocks.

const RAW = import.meta.env.VITE_USE_BACKEND as string | undefined;

export const USE_BACKEND = RAW === 'true';

// URL base del backend. Si no se define VITE_API_URL, usa localhost:3000 (dev).
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

// Key de localStorage para el JWT.
export const TOKEN_STORAGE_KEY = 'mi-saas-auth-token';