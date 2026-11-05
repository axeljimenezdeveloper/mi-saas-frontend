import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '../stores';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Envuelve rutas privadas. Si el usuario no esta autenticado,
 * redirige a /login guardando la ruta original para volver tras login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
