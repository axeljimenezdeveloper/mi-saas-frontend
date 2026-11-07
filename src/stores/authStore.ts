import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
