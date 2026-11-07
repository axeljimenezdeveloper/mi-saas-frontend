import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastViewport } from '../../../../components/feedback/alerts/Toast';
import {
  useAuthStore,
  useToastStore,
  useCompanyStore,
} from '../../../../stores';
import Settings from './Settings';

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

const SEED_COMPANY = {
  name: 'Bodega El Sol, C.A.',
  rif: 'J-31245678-9',
  address: 'Av. Bolivar, Local 5, Porlamar',
};

const SEED_PREFERENCES = {
  currency: 'VES' as const,
  defaultIva: '16' as const,
  businessType: 'retail' as const,
};

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
      <ToastViewport />
    </MemoryRouter>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    useToastStore.setState({ toasts: [] });
    useCompanyStore.setState({
      company: SEED_COMPANY,
      preferences: SEED_PREFERENCES,
      isConfigured: true,
    });
    useAuthStore.setState({
      user: {
        id: '1',
        name: 'Axel Jimenez',
        email: 'admin@vendra.com',
        role: 'admin',
      },
      isLoading: false,
      error: null,
    });
  });

  it('renders title and subtitle', () => {
    renderSettings();
    expect(
      screen.getByRole('heading', { name: 'Configuracion' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Administra la informacion de tu negocio')
    ).toBeInTheDocument();
  });

  it('renders company data fields', () => {
    renderSettings();
    expect(screen.getByLabelText('Nombre de la empresa')).toBeInTheDocument();
    expect(screen.getByLabelText('RIF')).toBeInTheDocument();
    expect(screen.getByLabelText(/Direccion fiscal/)).toBeInTheDocument();
  });

  it('renders preferences selects', () => {
    renderSettings();
    expect(screen.getByLabelText('Moneda por defecto')).toBeInTheDocument();
    expect(screen.getByLabelText('IVA por defecto')).toBeInTheDocument();
  });

  it('renders company name and RIF from store', () => {
    renderSettings();
    expect(screen.getByLabelText('Nombre de la empresa')).toHaveValue(
      'Bodega El Sol, C.A.'
    );
    expect(screen.getByLabelText('RIF')).toHaveValue('J-31245678-9');
  });

  it('renders account info from auth store', () => {
    renderSettings();
    expect(screen.getByText('Axel Jimenez')).toBeInTheDocument();
    expect(screen.getByText('admin@vendra.com')).toBeInTheDocument();
  });

  it('disables save button when nothing changed', () => {
    renderSettings();
    expect(
      screen.getByRole('button', { name: /Guardar cambios/i })
    ).toBeDisabled();
  });

  it('enables save button when a field changes', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('Nombre de la empresa');
    await user.clear(input);
    await user.type(input, 'Otra Empresa');
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Guardar cambios/i })
      ).toBeEnabled();
    });
  });

  it('shows error when company name is cleared and blurred', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('Nombre de la empresa');
    await user.clear(input);
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText('El nombre de la empresa es obligatorio')
      ).toBeInTheDocument();
    });
  });

  it('shows error when RIF has invalid format', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('RIF');
    await user.clear(input);
    await user.type(input, 'invalid-rif');
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText('Formato invalido. Ej: J-12345678-9')
      ).toBeInTheDocument();
    });
  });

  it('accepts valid RIF format', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('RIF');
    await user.clear(input);
    await user.type(input, 'V-98765432-1');
    await user.tab();
    await waitFor(() => {
      expect(
        screen.queryByText('Formato invalido. Ej: J-12345678-9')
      ).not.toBeInTheDocument();
    });
  });

  it('saves changes to store and shows toast', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('Nombre de la empresa');
    await user.clear(input);
    await user.type(input, 'Nueva Empresa');

    await user.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(screen.getByText('Configuracion guardada')).toBeInTheDocument();
    });
    expect(useCompanyStore.getState().company.name).toBe('Nueva Empresa');
  });

  it('logs out and navigates to /login', async () => {
    const user = userEvent.setup();
    renderSettings();
    const logoutButtons = screen.getAllByRole('button', {
      name: /Cerrar sesion/i,
    });
    await user.click(logoutButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(useAuthStore.getState().user).toBeNull();
  });
});

