import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useProductsStore,
  useToastStore,
  useCompanyStore,
} from '../../../../stores';
import ProductsList from './ProductsList';
import type { Product } from '../../../../stores/productsStore';

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

const SEED_PRODUCTS: Product[] = [
  { id: 1, name: 'Camisa azul talla M', sku: 'CAM-AZ-001', category: 'Ropa', price: 25, stock: 42, status: 'in-stock', images: [] },
  { id: 2, name: 'Pantalon negro', sku: 'PAN-NE-002', category: 'Ropa', price: 40, stock: 8, status: 'low-stock', images: [] },
  { id: 3, name: 'Zapatos deportivos', sku: 'ZAP-DEP-003', category: 'Calzado', price: 60, stock: 0, status: 'out-of-stock', images: [] },
  { id: 4, name: 'Gorra bordada', sku: 'GOR-BOR-004', category: 'Accesorios', price: 15, stock: 120, status: 'in-stock', images: [] },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductsList />
    </MemoryRouter>
  );
}

describe('ProductsList', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    useToastStore.setState({ toasts: [] });
    useCompanyStore.setState({ isConfigured: true });
    useProductsStore.setState({ products: SEED_PRODUCTS });
  });

  it('renders page title and new product button', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Nuevo producto/i })).toBeInTheDocument();
    });
  });

  it('shows empty state when there are no products', async () => {
    useProductsStore.setState({ products: [] });
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('No hay productos registrados')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('renders products after loading', async () => {
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    expect(screen.getByText('Pantalon negro')).toBeInTheDocument();
    expect(screen.getByText('Zapatos deportivos')).toBeInTheDocument();
    expect(screen.getByText('Gorra bordada')).toBeInTheDocument();
  });

  it('shows stock status badges', async () => {
    renderPage();
    // Esperamos a que la tabla cargue (no el option del select)
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
    // Ahora sí verificamos los 3 badges (los 3 son visibles porque hay 4 productos)
    expect(screen.getAllByText('En stock').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Stock bajo').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Agotado').length).toBeGreaterThan(0);
  });

  it('filters products by search term', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    await user.type(searchInput, 'Camisa');

    expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
    expect(screen.queryByText('Gorra bordada')).not.toBeInTheDocument();
  });

  it('filters products by status', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'out-of-stock');

    expect(screen.getByText('Zapatos deportivos')).toBeInTheDocument();
    expect(screen.queryByText('Camisa azul talla M')).not.toBeInTheDocument();
  });

  it('shows "no results" state when filters return empty', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const searchInput = screen.getByPlaceholderText(/Buscar por nombre/i);
    await user.type(searchInput, 'ZZZ_No_Existe');

    expect(screen.getByText('No se encontraron productos')).toBeInTheDocument();
  });

  it('navigates to new product when clicking "Nuevo producto"', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.click(screen.getByRole('button', { name: /Nuevo producto/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/products/new');
  });

  it('navigates to edit when clicking edit button', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.click(screen.getByLabelText('Editar Camisa azul talla M'));
    expect(mockNavigate).toHaveBeenCalledWith('/products/1/edit');
  });

  it('opens confirm dialog when clicking delete button', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.click(screen.getByLabelText('Eliminar Camisa azul talla M'));
    expect(screen.getByRole('heading', { name: 'Eliminar producto' })).toBeInTheDocument();
    // El nombre aparece 2 veces: en la fila de la tabla y en el <strong> del modal
    expect(screen.getAllByText('Camisa azul talla M').length).toBeGreaterThan(1);
  });

  it('removes product when confirming delete', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.click(screen.getByLabelText('Eliminar Camisa azul talla M'));
    await user.click(screen.getByRole('button', { name: /Si, eliminar/i }));

    await waitFor(() => {
      expect(useProductsStore.getState().products.length).toBe(SEED_PRODUCTS.length - 1);
    });
  });

  it('does not remove product when canceling delete', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    await user.click(screen.getByLabelText('Eliminar Camisa azul talla M'));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(useProductsStore.getState().products.length).toBe(SEED_PRODUCTS.length);
  });

  it('sorts products by price ascending', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Click en "Precio" en el sort bar
    const priceButton = screen.getByRole('button', { name: /Precio/i });
    await user.click(priceButton);

    // Verifica que el primer producto en el DOM sea el más barato (Gorra $15)
    const rows = screen.getAllByRole('row');
    // rows[0] es el header, rows[1] es la primera fila de datos
    expect(rows[1]).toHaveTextContent('Gorra bordada');
  });

  it('shows pagination info', async () => {
    renderPage();
    await waitFor(
      () => {
        expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Con 4 productos y 10 por página, debe mostrar "Mostrando 1-4 de 4"
    expect(screen.getByText(/Mostrando 1-4 de 4/)).toBeInTheDocument();
  });
});


