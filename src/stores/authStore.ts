import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
}

export interface AuthStore {
  /** Usuario logueado o null si no hay sesion. */
  user: User | null;
  /** Si es true, hay una operacion de login en curso. */
  isLoading: boolean;
  /** Error del ultimo intento de login (o null). */
  error: string | null;
  /** Intenta iniciar sesion. Retorna true si fue exitoso. */
  login: (email: string, password: string) => Promise<boolean>;
  /** Cierra la sesion actual. */
  logout: () => void;
  /** Limpia el error del login. */
  clearError: () => void;
}

const STORAGE_KEY = 'mi-saas-auth-user';

/** Credenciales de prueba (en un SaaS real vendrian del backend). */
const MOCK_CREDENTIALS = {
  email: 'admin@invensaas.com',
  password: 'admin123',
};

const MOCK_USER: User = {
  id: '1',
  name: 'Axel Jimenez',
  email: 'admin@invensaas.com',
  role: 'admin',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        // Simula latencia de red
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

      logout: () => set({ user: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEY,
      // Solo persistimos el user. isLoading y error son transitorios.
      partialize: (state) => ({ user: state.user }),
    }
  )
);

/** Selector: true si hay sesion activa. */
export const selectIsAuthenticated = (state: AuthStore): boolean =>
  state.user !== null;
