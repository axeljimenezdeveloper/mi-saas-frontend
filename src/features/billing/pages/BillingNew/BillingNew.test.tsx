import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useToastStore } from '../../../../stores';
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
    useToastStore.setState({ toasts: [] });
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

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.click(screen.getByRole('button', { name: 'Guardar factura' }));
    expect(screen.getByText('El nombre del cliente es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('Agrega al menos un producto a la factura')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows validation error when client name is too short', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.type(screen.getByPlaceholderText('Ej. Carlos Rodriguez'), 'AB');
    await addProduct(user, 'Gorra bordada');
    await user.click(screen.getByRole('button', { name: 'Guardar factura' }));
    expect(
      screen.getByText('El nombre debe tener al menos 3 caracteres')
    ).toBeInTheDocument();
  });

  it('navigates to /billing on successful submit', async () => {
    const user = userEvent.setup();
    renderBillingNew();
    await user.type(screen.getByPlaceholderText('Ej. Carlos Rodriguez'), 'Carlos Rodriguez');
    await addProduct(user, 'Camisa azul talla M');
    await user.click(screen.getByRole('button', { name: 'Guardar factura' }));

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
});
