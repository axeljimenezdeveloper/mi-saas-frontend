import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useProductsStore,
  useToastStore,
} from '../../../../stores';
import NewProduct from './NewProduct';

const mockNavigate = vi.fn();
let mockId: string | undefined = undefined;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: mockId }),
  };
});

const SEED_PRODUCT = {
  id: 1,
  name: 'Camisa azul talla M',
  sku: 'CAM-AZ-001',
  category: 'Ropa y accesorios',
  price: 25.0,
  stock: 42,
  status: 'in-stock' as const,
  images: [],
};

function renderPage() {
  return render(
    <MemoryRouter>
      <NewProduct />
    </MemoryRouter>
  );
}

describe('NewProduct', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockId = undefined;
    useToastStore.setState({ toasts: [] });
    useProductsStore.setState({ products: [], isLoading: false, error: null });
  });

  it('renders in create mode with "Nuevo producto" title', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'Nuevo producto' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Guardar producto/i })
    ).toBeInTheDocument();
  });

  it('renders in edit mode with prefilled product data', () => {
    mockId = '1';
    useProductsStore.setState({ products: [SEED_PRODUCT] });
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'Editar producto' })
    ).toBeInTheDocument();
    const nameInput = screen.getByPlaceholderText(
      'Ej. Camisa azul talla M'
    ) as HTMLInputElement;
    expect(nameInput.value).toBe('Camisa azul talla M');
  });

  it('shows EmptyState when editing a non-existent product', () => {
    mockId = 'does-not-exist';
    useProductsStore.setState({ products: [SEED_PRODUCT] });
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Producto no encontrado' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Volver al inventario/i })
    ).toBeInTheDocument();
  });

  it('does not add product when form is empty', async () => {
    const user = userEvent.setup();
    renderPage();
    const submit = screen.getByRole('button', { name: /Guardar producto/i });
    expect(submit).toBeDisabled();
    await user.click(submit);
    expect(useProductsStore.getState().products).toHaveLength(0);
  });


  it('navigates to /products when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
});