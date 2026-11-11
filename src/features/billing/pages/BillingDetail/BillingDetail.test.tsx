import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useInvoicesStore,
  useCompanyStore,
  useToastStore,
} from '../../../../stores';
import * as billingApi from '../../../../api/billing';
import BillingDetail from './BillingDetail';

const mockNavigate = vi.fn();
let mockId = 'inv-1';

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

vi.mock('../../../../api/billing', async () => {
  const actual = await vi.importActual<typeof import('../../../../api/billing')>(
    '../../../../api/billing'
  );
  return {
    ...actual,
    downloadInvoicePdfRequest: vi.fn().mockResolvedValue(new Blob(['mock-pdf'])),
  };
});

const SEED_INVOICE = {
  id: 'inv-1',
  number: 'FAC-2026-0001',
  client: 'Carlos Rodriguez',
  date: '2026-11-01',
  total: 1450.0,
  status: 'pending' as const,
  items: [
    { productId: 'p1', productName: 'Laptop Pro 14"', price: 500.0, quantity: 2 },
    { productId: 'p2', productName: 'Mouse Wireless', price: 75.0, quantity: 6 },
  ],
  pdfUrl: 'http://localhost:3000/uploads/invoices/FAC-2026-0001.pdf',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <BillingDetail />
    </MemoryRouter>
  );
}

describe('BillingDetail', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockId = 'inv-1';
    useToastStore.setState({ toasts: [] });
    useInvoicesStore.setState({
      invoices: [SEED_INVOICE],
      isLoading: false,
      error: null,
    });
    useCompanyStore.setState({
      company: {
        name: 'Bodega El Sol C.A.',
        rif: 'J-31245678-9',
        address: 'Av. Bolivar, Porlamar',
      },
      preferences: {
        currency: 'VES',
        defaultIva: '16',
        businessType: 'retail',
      },
      isConfigured: true,
    });
    // jsdom no implementa URL.createObjectURL; el download handler lo usa
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it('renders invoice header, client, status and items', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'FAC-2026-0001' })
    ).toBeInTheDocument();
    expect(screen.getByText('Carlos Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Laptop Pro 14"')).toBeInTheDocument();
    expect(screen.getByText('Mouse Wireless')).toBeInTheDocument();
  });

  it('shows EmptyState when invoice does not exist', () => {
    mockId = 'does-not-exist';
    renderPage();
    expect(screen.getByText('Factura no encontrada')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Volver a facturacion/i })
    ).toBeInTheDocument();
  });

  it('marks invoice as paid and shows a toast', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Marcar pagada/i }));
    expect(useInvoicesStore.getState().invoices[0].status).toBe('paid');
    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBeGreaterThan(0);
    expect(toasts[0].title).toMatch(/FAC-2026-0001/);
  });

  it('deletes invoice after confirming in dialog', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Eliminar factura/i }));
    expect(
      screen.getByRole('heading', { name: /Eliminar factura/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Si, eliminar/i }));
    expect(useInvoicesStore.getState().invoices).toHaveLength(0);
    expect(mockNavigate).toHaveBeenCalledWith('/billing');
  });

  it('does not delete invoice when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Eliminar factura/i }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(useInvoicesStore.getState().invoices).toHaveLength(1);
    expect(mockNavigate).not.toHaveBeenCalledWith('/billing');
  });

  it('calls downloadInvoicePdfRequest when download button is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Descargar PDF/i }));
    await waitFor(() => {
      expect(billingApi.downloadInvoicePdfRequest).toHaveBeenCalledWith('inv-1');
    });
  });

  it('navigates to /billing when back button is clicked', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(mockNavigate).toHaveBeenCalledWith('/billing');
  });
});