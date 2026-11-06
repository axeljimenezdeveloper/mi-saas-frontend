import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Notifications } from './index';
import { useNotificationsStore } from '../../../../stores';

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
      <Notifications />
    </MemoryRouter>
  );
}

const seed = (count = 3) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i),
    title: 'Notif ' + i,
    description: 'Descripcion ' + i,
    variant: 'info' as const,
    category: 'system' as const,
    timestamp: Date.now() - i * 60000,
    read: i % 2 === 0,
  }));

describe('Notifications page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useNotificationsStore.setState({ notifications: [] });
  });

  it('renders title and subtitle', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { name: 'Notificaciones' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Historial completo/i)
    ).toBeInTheDocument();
  });

  it('shows empty state when there are no notifications', () => {
    renderPage();
    expect(screen.getByText('Sin notificaciones')).toBeInTheDocument();
  });

  it('renders notifications list', () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    renderPage();
    expect(screen.getByText('Notif 0')).toBeInTheDocument();
    expect(screen.getByText('Notif 1')).toBeInTheDocument();
    expect(screen.getByText('Notif 2')).toBeInTheDocument();
  });

  it('shows counts in tabs', () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    renderPage();
    expect(screen.getByRole('tab', { name: /Todas 3/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /No leidas 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Leidas 2/i })).toBeInTheDocument();
  });

  it('filters by unread tab', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('tab', { name: /No leidas/i }));
    expect(screen.getByText('Notif 1')).toBeInTheDocument();
    expect(screen.queryByText('Notif 0')).not.toBeInTheDocument();
  });

  it('filters by read tab', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('tab', { name: /^Leidas/i }));
    expect(screen.getByText('Notif 0')).toBeInTheDocument();
    expect(screen.queryByText('Notif 1')).not.toBeInTheDocument();
  });

  it('filters by category', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Factura pagada',
          variant: 'success',
          category: 'billing',
          timestamp: Date.now(),
          read: false,
        },
        {
          id: '2',
          title: 'Producto creado',
          variant: 'success',
          category: 'inventory',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPage();
    const combobox = screen.getByRole('combobox');
    await user.selectOptions(combobox, 'billing');
    expect(screen.getByText('Factura pagada')).toBeInTheDocument();
    expect(screen.queryByText('Producto creado')).not.toBeInTheDocument();
  });

  it('marks all as read', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Marcar todas/i }));
    expect(
      useNotificationsStore.getState().notifications.every((n) => n.read)
    ).toBe(true);
  });

  it('opens confirm dialog when clicking Limpiar todo', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Limpiar todo/i }));
    expect(
      screen.getByRole('heading', { name: /Limpiar todas/i })
    ).toBeInTheDocument();
  });

  it('clears all on confirm', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /Limpiar todo/i }));
    await user.click(
      screen.getByRole('button', { name: /Si, limpiar todo/i })
    );
    expect(useNotificationsStore.getState().notifications.length).toBe(0);
  });

  it('marks notification as read on click', async () => {
    useNotificationsStore.setState({ notifications: seed(1) });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText('Notif 0'));
    expect(useNotificationsStore.getState().notifications[0].read).toBe(true);
  });

  it('navigates to actionUrl when clicking a notification with it', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Ir a facturas',
          variant: 'info',
          category: 'billing',
          actionUrl: '/billing',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByText('Ir a facturas'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/billing');
    });
  });

  it('shows "Sin resultados" when filters return empty', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    const combobox = screen.getByRole('combobox');
    await user.selectOptions(combobox, 'billing');
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('clears filters when "Limpiar filtros" is clicked', async () => {
    useNotificationsStore.setState({ notifications: seed(3) });
    const user = userEvent.setup();
    renderPage();
    const combobox = screen.getByRole('combobox');
    await user.selectOptions(combobox, 'billing');
    await user.click(screen.getByRole('button', { name: /Limpiar filtros/i }));
    expect(screen.getByText('Notif 0')).toBeInTheDocument();
  });
});

