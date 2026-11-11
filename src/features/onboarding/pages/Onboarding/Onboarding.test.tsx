import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useCompanyStore,
  useToastStore,
} from '../../../../stores';
import Onboarding from './Onboarding';

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

function renderPage() {
  return render(
    <MemoryRouter>
      <Onboarding />
    </MemoryRouter>
  );
}

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByPlaceholderText('Ej. Mi Empresa C.A.'),
    'Bodega El Sol'
  );
  await user.type(
    screen.getByPlaceholderText('J-12345678-9'),
    'J-12345678-9'
  );
  await user.type(
    screen.getByPlaceholderText(/Av. Principal/i),
    'Av. Bolivar, Porlamar'
  );
}

describe('Onboarding', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useToastStore.setState({ toasts: [] });
    useCompanyStore.setState({
      company: { name: '', rif: '', address: '' },
      preferences: {
        currency: 'VES',
        defaultIva: '16',
        businessType: 'retail',
      },
      isConfigured: false,
      isLoading: false,
      error: null,
    });
  });

  it('renders step 1 with company fields', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: /Configura tu empresa/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Ej. Mi Empresa C.A.')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('J-12345678-9')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Av. Principal/i)
    ).toBeInTheDocument();
  });

  it('stays on step 1 when clicking Continuar with empty fields', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    expect(
      screen.getByPlaceholderText('Ej. Mi Empresa C.A.')
    ).toBeInTheDocument();
  });

  it('advances to step 2 when step 1 is valid', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => {
      expect(screen.getByText('Moneda por defecto')).toBeInTheDocument();
    });
    expect(screen.getByText('IVA por defecto')).toBeInTheDocument();
    expect(screen.getByText('Tipo de negocio', { exact: true })).toBeInTheDocument();
  });

  it('shows validation error for invalid RIF format', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(
      screen.getByPlaceholderText('Ej. Mi Empresa C.A.'),
      'Bodega El Sol'
    );
    await user.type(
      screen.getByPlaceholderText('J-12345678-9'),
      'invalid'
    );
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/Formato invalido/i)
      ).toBeInTheDocument();
    });
  });

  it('returns to step 1 with Atras button', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => screen.getByText('Moneda por defecto'));
    await user.click(screen.getByRole('button', { name: /Atras/i }));
    expect(
      screen.getByPlaceholderText('Ej. Mi Empresa C.A.')
    ).toBeInTheDocument();
  });

  it('submits in mock mode, saves company and navigates to dashboard', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillStep1(user);
    await user.click(screen.getByRole('button', { name: /Continuar/i }));
    await waitFor(() => screen.getByText('Moneda por defecto'));

    const finalizar = screen.getByRole('button', { name: /Finalizar/i });
    await waitFor(() => expect(finalizar).toBeEnabled());
    await user.click(finalizar);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
    const state = useCompanyStore.getState();
    expect(state.isConfigured).toBe(true);
    expect(state.company.name).toBe('Bodega El Sol');
    expect(state.company.rif).toBe('J-12345678-9');
  });
});