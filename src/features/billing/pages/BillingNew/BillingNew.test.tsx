import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useProductsStore, useInvoicesStore } from '../../../../stores';
import BillingNew from './BillingNew';

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
  { id: 1, name: 'Camisa azul talla M', sku: 'CAM-AZ-M-001', category: 'Ropa', price: 25.0, stock: 42, status: 'in-stock' as const, images: [] },
  { id: 2, name: 'Pantalon negro talla 32', sku: 'PAN-NE-32-002', category: 'Ropa', price: 40.0, stock: 8, status: 'low-stock' as const, images: [] },
  { id: 3, name: 'Zapatos deportivos', sku: 'ZAP-DEP-003', category: 'Calzado', price: 60.0, stock: 0, status: 'out-of-stock' as const, images: [] },
  { id: 4, name: 'Gorra bordada', sku: 'GOR-BOR-004', category: 'Accesorios', price: 15.0, stock: 120, status: 'in-stock' as const, images: [] },
  { id: 5, name: 'Bufanda de lana', sku: 'BUF-LAN-005', category: 'Accesorios', price: 18.0, stock: 5, status: 'low-stock' as const, images: [] },
];

function renderBillingNew() {
  return render(
    <MemoryRouter>
      <BillingNew />
    </MemoryRouter>
  );
}

async function addProduct(
  user: ReturnType<typeof userEvent.setup>,
  productLabel: string,
  qty?: string
) {
  const select = screen.getByRole('combobox');
  const option = Array.from((select as HTMLSelectElement).options).find((o) =>
    o.textContent?.includes(productLabel)
  );
  if (!option) throw new Error(`Option "${productLabel}" not found`);
  await user.selectOptions(select, option.value);
  if (qty !== undefined) {
    const qtyInput = screen.getByPlaceholderText('Cant.');
    await user.clear(qtyInput);
    await user.type(qtyInput, qty);
  }
  await user.click(screen.getByRole('button', { name: 'Agregar' }));
}

describe('BillingNew', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useProductsStore.setState({ products: SEED_PRODUCTS });
    useInvoicesStore.setState({ invoices: [] });
  });

  it('renders title and back button', () => {
    renderBillingNew();
    expect(
      screen.getByRole('heading', { name: 'Nueva factura' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('renders client input and date', () => {
    renderBillingNew();
    expect(screen.getByPlaceholderText('Ej. Carlos Rodriguez')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de emision')).toBeInTheDocument();
  });

  it('shows empty state when no products added', () => {
    renderBillingNew();
    expect(screen.getByText('No hay productos en la factura')).toBeInTheDocument();
  });

  it('adds a product to the list', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await addProduct(user, 'Camisa azul talla M');
    expect(screen.getByText('Camisa azul talla M')).toBeInTheDocument();
    expect(screen.queryByText('No hay productos en la factura')).not.toBeInTheDocument();
  });

  it('increments quantity when adding the same product twice', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await addProduct(user, 'Camisa azul talla M');
    await addProduct(user, 'Camisa azul talla M');
    const allCamisas = screen.getAllByText('Camisa azul talla M');
    expect(allCamisas).toHaveLength(1);
  });

  it('removes a product from the list', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await addProduct(user, 'Gorra bordada');
    expect(screen.getByText('Gorra bordada')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Quitar Gorra bordada' }));
    expect(screen.queryByText('Gorra bordada')).not.toBeInTheDocument();
    expect(screen.getByText('No hay productos en la factura')).toBeInTheDocument();
  });

  it('calculates subtotal, IVA and total correctly', async () => {
    const user = userEvent.setup();
    renderBillingNew();

    await addProduct(user, 'Camisa azul talla M', '2');
    await addProduct(user, 'Gorra bordada', '1');

    const subtotalMatches = screen.getAllByText(/65,00/);
    expect(subtotalMatches.length).toBeGreaterThan(0);
    expect(screen.getByText(/10,40/)).toBeInTheDocument();
    expect(screen.getByText(/75,40/)).toBeInTheDocument();
  });

  it('disables submit button when form is empty', () => {
    renderBillingNew();
    const submitButton = screen.getByRole('button', { name: /Guardar factura/i });
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when only client is filled', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.type(screen.getByPlaceholderText('Ej. Carlos Rodriguez'), 'Carlos Rodriguez');
    const submitButton = screen.getByRole('button', { name: /Guardar factura/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when client and items are valid', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.type(screen.getByPlaceholderText('Ej. Carlos Rodriguez'), 'Carlos Rodriguez');
    await addProduct(user, 'Camisa azul talla M');
    const submitButton = screen.getByRole('button', { name: /Guardar factura/i });
    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('navigates to /billing on successful submit', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.type(screen.getByPlaceholderText('Ej. Carlos Rodriguez'), 'Carlos Rodriguez');
    await addProduct(user, 'Camisa azul talla M');
    await user.click(screen.getByRole('button', { name: /Guardar factura/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/billing');
      },
      { timeout: 2000 }
    );
  });

  it('navigates to /billing when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockNavigate).toHaveBeenCalledWith('/billing');
  });

  it('navigates to /billing when back button is clicked', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(mockNavigate).toHaveBeenCalledWith('/billing');
  });

  it('disables Agregar button when no product is selected', () => {
    renderBillingNew();
    const addButton = screen.getByRole('button', { name: 'Agregar' });
    expect(addButton).toBeDisabled();
  });

  it('shows empty state when there are no products in inventory', () => {
    useProductsStore.setState({ products: [] });
    renderBillingNew();
    expect(screen.getByText('No tienes productos aun')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Crear primer producto' })
    ).toBeInTheDocument();
  });
});

