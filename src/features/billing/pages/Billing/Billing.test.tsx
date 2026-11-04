import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Billing from './Billing';

// Mock de useNavigate para verificar redirecciones
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

function renderBilling() {
  return render(
    <MemoryRouter>
      <Billing />
    </MemoryRouter>
  );
}

describe('Billing', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('shows skeleton loading initially', () => {
    const { container } = renderBilling();
    expect(container.querySelector('[class*="skeletonTable"]')).toBeInTheDocument();
  });

  it('renders invoices after loading', async () => {
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );
    expect(screen.getByText('Carlos Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Maria Gonzalez')).toBeInTheDocument();
    expect(screen.getByText('FAC-2026-0002')).toBeInTheDocument();
  });

  it('renders status badges', async () => {
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getAllByText('Pagada').length).toBeGreaterThan(0);
      },
      { timeout: 2500 }
    );
    expect(screen.getAllByText('Pendiente').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vencida').length).toBeGreaterThan(0);
  });

  it('renders search input and filter select', async () => {
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByPlaceholderText('Buscar por cliente o numero...')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('filters invoices by search term', async () => {
    const user = userEvent.setup();
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    const searchInput = screen.getByPlaceholderText('Buscar por cliente o numero...');
    await user.type(searchInput, 'Carlos');

    expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
    expect(screen.queryByText('FAC-2026-0002')).not.toBeInTheDocument();
  });

  it('filters invoices by status', async () => {
    const user = userEvent.setup();
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'overdue');

    expect(screen.getByText('FAC-2026-0004')).toBeInTheDocument();
    expect(screen.queryByText('FAC-2026-0001')).not.toBeInTheDocument();
  });

  it('shows "no results" state when filters return empty', async () => {
    const user = userEvent.setup();
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    const searchInput = screen.getByPlaceholderText('Buscar por cliente o numero...');
    await user.type(searchInput, 'ZZZ_No_Existe');

    expect(screen.getByText('No se encontraron facturas')).toBeInTheDocument();
  });

  it('navigates to /billing/new when "Nueva factura" is clicked', async () => {
    const user = userEvent.setup();
    renderBilling();
    await waitFor(
      () => {
        expect(screen.getByText('FAC-2026-0001')).toBeInTheDocument();
      },
      { timeout: 2500 }
    );

    await user.click(screen.getByRole('button', { name: /Nueva factura/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/billing/new');
  });
});
