// src/config/backend.ts
// Feature flag de migracion frontend -> backend.
//
// VITE_USE_BACKEND=true  -> stores consumen la API real (localhost:3000)
// VITE_USE_BACKEND=false -> stores usan mocks en memoria (fallback)
//
// IMPORTANTE: en Vitest, MODE es 'test', asi que forzamos USE_BACKEND=false
// para que los 366 tests sigan usando mocks sin depender del backend real.
// En dev y prod respetamos VITE_USE_BACKEND del .env.

const RAW = import.meta.env.VITE_USE_BACKEND as string | undefined;
const MODE = import.meta.env.MODE as string | undefined;

export const USE_BACKEND = MODE === 'test' ? false : RAW === 'true';

// URL base del backend. Si no se define VITE_API_URL, usa localhost:3000 (dev).
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

// Key de localStorage para el JWT.
export const TOKEN_STORAGE_KEY = 'mi-saas-auth-token';