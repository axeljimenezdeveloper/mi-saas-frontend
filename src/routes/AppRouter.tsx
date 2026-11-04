import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../features/auth/pages/Login';
import Dashboard from '../features/dashboard/pages/Dashboard';
import ProductsList from '../features/inventory/pages/ProductsList';
import NewProduct from '../features/inventory/pages/NewProduct';
import Billing from '../features/billing/pages/Billing';
import BillingNew from '../features/billing/pages/BillingNew';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductsList /> },
      { path: 'products/new', element: <NewProduct /> },
      { path: 'billing', element: <Billing /> },
      { path: 'billing/new', element: <BillingNew /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
