import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../../../components/feedback/alerts/Toast';
import { AuthProvider } from '../../../../context';
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

function renderSettings() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <AuthProvider>
          <Settings />
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
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

  it('renders company name and RIF with initial values', () => {
    renderSettings();
    expect(screen.getByLabelText('Nombre de la empresa')).toHaveValue(
      'Mi Empresa C.A.'
    );
    expect(screen.getByLabelText('RIF')).toHaveValue('J-12345678-9');
  });

  it('shows error when company name is cleared and blurred', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('Nombre de la empresa');
    await user.clear(input);
    await user.tab();
    expect(
      screen.getByText('El nombre de la empresa es obligatorio')
    ).toBeInTheDocument();
  });

  it('shows error when RIF has invalid format', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('RIF');
    await user.clear(input);
    await user.type(input, 'invalid-rif');
    await user.tab();
    expect(
      screen.getByText('Formato invalido. Ej: J-12345678-9')
    ).toBeInTheDocument();
  });

  it('accepts valid RIF format', async () => {
    const user = userEvent.setup();
    renderSettings();
    const input = screen.getByLabelText('RIF');
    await user.clear(input);
    await user.type(input, 'V-98765432-1');
    await user.tab();
    expect(
      screen.queryByText('Formato invalido. Ej: J-12345678-9')
    ).not.toBeInTheDocument();
  });

  it('shows validation errors on submit when fields are empty', async () => {
    const user = userEvent.setup();
    renderSettings();
    const nameInput = screen.getByLabelText('Nombre de la empresa');
    const rifInput = screen.getByLabelText('RIF');
    await user.clear(nameInput);
    await user.clear(rifInput);
    await user.click(screen.getByRole('button', { name: /Guardar cambios/i }));
    expect(
      screen.getByText('El nombre de la empresa es obligatorio')
    ).toBeInTheDocument();
    expect(screen.getByText('El RIF es obligatorio')).toBeInTheDocument();
  });

  it('shows success toast on valid submit', async () => {
    const user = userEvent.setup();
    renderSettings();
    await user.click(screen.getByRole('button', { name: /Guardar cambios/i }));

    await waitFor(
      () => {
        expect(screen.getByText('Configuracion guardada')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('logs out and navigates to /login when logout button is clicked', async () => {
    const user = userEvent.setup();
    renderSettings();
    const logoutButtons = screen.getAllByRole('button', { name: /Cerrar sesion/i });
    await user.click(logoutButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
