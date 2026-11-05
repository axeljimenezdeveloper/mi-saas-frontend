import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../../../components/feedback/alerts/Toast';
import { useAuthStore } from '../../../../stores';
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
      <ToastProvider>
        <Login />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    useAuthStore.setState({ user: null, isLoading: false, error: null });
  });

  it('renders brand and title', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'InvenSaaS' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Iniciar sesión' })
    ).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('tu@empresa.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tu contrasena')).toBeInTheDocument();
  });

  it('renders demo credentials button', () => {
    renderLogin();
    expect(screen.getByText('admin@invensaas.com')).toBeInTheDocument();
    expect(screen.getByText('admin123')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
    expect(screen.getByText('El correo es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'no-es-email');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
    expect(screen.getByText('Ingresa un correo válido')).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'admin@invensaas.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), '123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
    expect(
      screen.getByText('La contraseña debe tener al menos 6 caracteres')
    ).toBeInTheDocument();
  });

  it('fills demo credentials when demo button is clicked', async () => {
    const user = userEvent.setup();
    renderLogin();
    const demoButton = screen.getByText('admin@invensaas.com').closest('button')!;
    await user.click(demoButton);
    expect(screen.getByPlaceholderText('tu@empresa.com')).toHaveValue('admin@invensaas.com');
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

  it('shows error from store on invalid credentials', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'wrong@email.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/Credenciales incorrectas/i)
        ).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('navigates to /dashboard on successful login', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText('tu@empresa.com'), 'admin@invensaas.com');
    await user.type(screen.getByPlaceholderText('Tu contrasena'), 'admin123');
    await user.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      },
      { timeout: 2000 }
    );
  });
});
