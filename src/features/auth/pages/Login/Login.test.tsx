import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {
  useAuthStore,
  useToastStore,
  useCompanyStore,
  useProductsStore,
  useInvoicesStore,
} from '../../../../stores';
import Login from './Login';

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

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    useAuthStore.setState({ user: null, isLoading: false, error: null });
    useToastStore.setState({ toasts: [] });
    useCompanyStore.setState({
      company: { name: '', rif: '', address: '' },
      isConfigured: false,
    });
    useProductsStore.setState({ products: [] });
    useInvoicesStore.setState({ invoices: [] });
  });

  it('renders brand, title and creator', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'Vendra' })).toBeInTheDocument();
    expect(screen.getByText(/Axel Gabriel Jimenez Malaver/)).toBeInTheDocument();
    expect(screen.getByText(/C\.I\. 27\.870\.662/)).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('tu@empresa.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu contrasena')).toBeInTheDocument();
  });

  it('renders demo credentials link', () => {
    renderLogin();
    expect(screen.getByText('Rellenar credenciales de prueba')).toBeInTheDocument();
  });

  it('renders demo data link', () => {
    renderLogin();
    expect(screen.getByText('Probar con datos de ejemplo')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole('button', { name: /Iniciar sesion/i }));
    expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'no-es-email');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesion/i }));
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
  });

  it('fills demo credentials when link is clicked', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByText('Rellenar credenciales de prueba'));
    expect(screen.getByPlaceholderText('tu@empresa.com')).toHaveValue('admin@vendra.com');
    expect(screen.getByPlaceholderText('Tu contrasena')).toHaveValue('admin123');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Tu contrasena');
    expect(passwordInput).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(passwordInput).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navigates to /onboarding when not configured', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'admin@vendra.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesion/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
      },
      { timeout: 2000 }
    );
  });

  it('navigates to /dashboard when already configured', async () => {
    useCompanyStore.setState({ isConfigured: true });
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'admin@vendra.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesion/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      },
      { timeout: 2000 }
    );
  });

  it('demo data button loads demo data and navigates to dashboard', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByText('Probar con datos de ejemplo'));

    await waitFor(
      () => {
        expect(useCompanyStore.getState().isConfigured).toBe(true);
        expect(useProductsStore.getState().products.length).toBeGreaterThan(0);
        expect(useInvoicesStore.getState().invoices.length).toBeGreaterThan(0);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      },
      { timeout: 3000 }
    );
  });
});


