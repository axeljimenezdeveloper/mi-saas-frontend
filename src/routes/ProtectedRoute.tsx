import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, useCompanyStore } from '../stores';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Si es true, exige que el onboarding este completo. */
  requireConfigured?: boolean;
}

export function ProtectedRoute({
  children,
  requireConfigured = false,
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isConfigured = useCompanyStore((s) => s.isConfigured);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireConfigured && !isConfigured) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
