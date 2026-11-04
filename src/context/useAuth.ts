import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';

/**
 * Hook para acceder al contexto de autenticacion.
 * Debe usarse dentro de un <AuthProvider>.
 *
 * Ejemplo:
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
