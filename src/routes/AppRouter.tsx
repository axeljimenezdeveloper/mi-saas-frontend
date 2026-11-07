import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../features/auth/pages/Login';
import Onboarding from '../features/onboarding/pages/Onboarding';
import Dashboard from '../features/dashboard/pages/Dashboard';
import ProductsList from '../features/inventory/pages/ProductsList';
import NewProduct from '../features/inventory/pages/NewProduct';
import Billing from '../features/billing/pages/Billing';
import BillingNew from '../features/billing/pages/BillingNew';
import Settings from '../features/settings/pages/Settings';
import Docs from '../features/docs/pages/Docs';
import Notifications from '../features/notifications/pages/Notifications';
import NotFound from '../features/errors/pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // Grupo de rutas que REQUIEREN onboarding completado
      {
        element: (
          <ProtectedRoute requireConfigured>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'products', element: <ProductsList /> },
          { path: 'products/new', element: <NewProduct /> },
          { path: 'products/:id/edit', element: <NewProduct /> },
          { path: 'billing', element: <Billing /> },
          { path: 'billing/new', element: <BillingNew /> },
          { path: 'settings', element: <Settings /> },
          { path: 'docs', element: <Docs /> },
          { path: 'notifications', element: <Notifications /> },
        ],
      },
      // Catch-all SIN requireConfigured: muestra 404 dentro del AppLayout
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
