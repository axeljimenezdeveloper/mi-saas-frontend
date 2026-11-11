import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useProductsStore,
  useInvoicesStore,
  useCompanyStore,
  useToastStore,
} from '../../../../stores';
import Dashboard from './Dashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const SEED_PRODUCTS = [
  {
    id: 1,
    name: 'Laptop Pro 14"',
    sku: 'LAP-001',
    category: 'Electrónica',
    price: 500.0,
    stock: 42,
    status: 'in-stock' as const,
    images: [],
  },
  {
    id: 2,
    name: 'Mouse Wireless',
    sku: 'MOU-002',
    category: 'Electrónica',
    price: 75.0,
    stock: 5,
    status: 'low-stock' as const,
    images: [],
  },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useToastStore.setState({ toasts: [] });
    useProductsStore.setState({ products: [], isLoading: false, error: null });
    useInvoicesStore.setState({ invoices: [], isLoading: false, error: null });
    useCompanyStore.setState({
      company: { name: 'Bodega El Sol', rif: 'J-12345678-9', address: '' },
      preferences: {
        currency: 'VES',
        defaultIva: '16',
        businessType: 'retail',
      },
      isConfigured: true,
    });
  });

  it('does not show empty state while products are loading', () => {
    useProductsStore.setState({ isLoading: true });
    renderPage();
    expect(
      screen.queryByText('Tu negocio esta vacio')
    ).not.toBeInTheDocument();
  });

  it('shows empty state when there are no products and not loading', () => {
    renderPage();
    expect(screen.getByText('Tu negocio esta vacio')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Crear primer producto/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Generar productos/i })
    ).toBeInTheDocument();
  });

  it('renders stats grid when there are products', () => {
    useProductsStore.setState({ products: SEED_PRODUCTS });
    renderPage();
    expect(
      screen.queryByText('Tu negocio esta vacio')
    ).not.toBeInTheDocument();
    expect(screen.getAllByText('Productos').length).toBeGreaterThan(0);
    expect(screen.getByText('Ventas cobradas')).toBeInTheDocument();
    expect(screen.getByText('Alertas de stock')).toBeInTheDocument();
  });

  it('generates 16 sample products when the button is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    expect(useProductsStore.getState().products).toHaveLength(0);
    await user.click(
      screen.getByRole('button', { name: /Generar productos/i })
    );
    await waitFor(() => {
      expect(useProductsStore.getState().products).toHaveLength(16);
    });
  });

  it('navigates to /products/new when creating the first product', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(
      screen.getByRole('button', { name: /Crear primer producto/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/products/new');
  });
});