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
    useAuthStore.setState({ user: null, isLoading: false, error: null, rememberMe: true });
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

  it('renders create test account button with hint', () => {
    renderLogin();
    expect(
      screen.getByRole('button', { name: /Crear cuenta de prueba/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Se creara una cuenta demo automaticamente/i)
    ).toBeInTheDocument();
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
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding', { replace: true });
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
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      },
      { timeout: 2000 }
    );
  });

  it('creates test account and navigates to /onboarding', async () => {
    const user = userEvent.setup();
    renderLogin();
    const createBtn = screen.getByRole('button', {
      name: /Crear cuenta de prueba/i,
    });
    await user.click(createBtn);

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/onboarding', {
          replace: true,
        });
      },
      { timeout: 3000 }
    );

    // El store debe tener un user creado (mock mode)
    expect(useAuthStore.getState().user).not.toBeNull();
    expect(useAuthStore.getState().user?.name).toBe('Profesor Demo');
    // El email debe tener el prefijo demo_
    expect(useAuthStore.getState().user?.email).toMatch(/^demo_.*@vendra\.local$/);
  });
});