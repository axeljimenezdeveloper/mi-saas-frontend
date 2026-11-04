import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
}

export interface AuthContextValue {
  /** Usuario logueado o null si no hay sesion. */
  user: User | null;
  /** Si es true, el usuario esta logueado. */
  isAuthenticated: boolean;
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

export const AuthContext = createContext<AuthContextValue | null>(null);

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

function loadUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignorar errores de storage (modo privado, quota, etc.)
  }
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza el localStorage cada vez que cambia el usuario
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simula latencia de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email.trim().toLowerCase() === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      setUser(MOCK_USER);
      setIsLoading(false);
      return true;
    }

    setError('Credenciales incorrectas. Verifica tu correo y contrasena.');
    setIsLoading(false);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
