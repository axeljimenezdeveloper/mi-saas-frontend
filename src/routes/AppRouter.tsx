import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../features/auth/pages/Login';
import Dashboard from '../features/dashboard/pages/Dashboard';
import ProductsList from '../features/inventory/pages/ProductsList';
import NewProduct from '../features/inventory/pages/NewProduct';

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
