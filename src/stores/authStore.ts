// src/stores/authStore.ts
// Feature flag: con USE_BACKEND=false usa mocks (default, demo y tests).
// Con USE_BACKEND=true consume POST /api/auth/login y GET /api/auth/me.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { USE_BACKEND } from '../config/backend';
import { loginRequest, logoutRequest } from '../api/auth';
import { setUnauthorizedHandler } from '../api/axiosClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
}

export interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  /** Si es true, la sesion se persiste en localStorage. */
  rememberMe: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const STORAGE_KEY = 'mi-saas-auth-user';

const MOCK_CREDENTIALS = {
  email: 'admin@vendra.com',
  password: 'admin123',
};

const MOCK_USER: User = {
  id: '1',
  name: 'Axel Jimenez',
  email: 'admin@vendra.com',
  role: 'admin',
};

// Error shape de axios (para tipar sin `any`).
interface AxiosLikeError {
  response?: {
    status?: number;
    data?: { error?: { code?: string; message?: string } };
  };
}

function extractErrorCode(err: unknown): string | null {
  if (typeof err !== 'object' || err === null) return null;
  const resp = (err as AxiosLikeError).response;
  return resp?.data?.error?.code ?? null;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null) return fallback;
  const resp = (err as AxiosLikeError).response;
  return resp?.data?.error?.message ?? fallback;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      rememberMe: true,

      login: async (
        email: string,
        password: string,
        rememberMe = true
      ): Promise<boolean> => {
        set({ isLoading: true, error: null, rememberMe });

        // ─── Modo backend ────────────────────────────
        if (USE_BACKEND) {
          try {
            const user = await loginRequest(email, password);
            set({ user, isLoading: false });
            return true;
          } catch (err) {
            const code = extractErrorCode(err);
            const message =
              code === 'INVALID_CREDENTIALS'
                ? 'Credenciales incorrectas. Verifica tu correo y contrasena.'
                : extractErrorMessage(err, 'No se pudo iniciar sesion');
            set({ error: message, isLoading: false });
            return false;
          }
        }

        // ─── Modo mock (default, tests) ──────────────
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (
          email.trim().toLowerCase() === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          set({ user: MOCK_USER, isLoading: false });
          return true;
        }

        set({
          error: 'Credenciales incorrectas. Verifica tu correo y contrasena.',
          isLoading: false,
        });
        return false;
      },

      logout: () => {
        if (USE_BACKEND) {
          logoutRequest();
        }
        set({ user: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEY,
      // Solo persistimos user si rememberMe=true. isLoading y error son
      // transitorios; rememberMe no se persiste (es por sesion).
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
      }),
    }
  )
);

export const selectIsAuthenticated = (state: AuthStore): boolean =>
  state.user !== null;

// Handler de 401: si el backend responde 401 con un token presente, el
// interceptor de axios lo invoca y forzamos logout local.
setUnauthorizedHandler(() => {
  useAuthStore.getState().logout();
});