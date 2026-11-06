import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NotificationPanel } from './NotificationPanel';
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

function renderPanel() {
  return render(
    <MemoryRouter>
      <NotificationPanel />
    </MemoryRouter>
  );
}

describe('NotificationPanel', () => {
  beforeEach(() => {
    useNotificationsStore.setState({ notifications: [] });
    mockNavigate.mockClear();
  });

  it('renders the bell button', () => {
    renderPanel();
    expect(
      screen.getByRole('button', { name: /Notificaciones/i })
    ).toBeInTheDocument();
  });

  it('does not show unread count when there are no unread notifications', () => {
    renderPanel();
    const btn = screen.getByRole('button', { name: /Notificaciones/i });
    expect(btn.getAttribute('aria-label')).not.toContain('sin leer');
  });

  it('shows unread count in aria-label', () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Test 1',
          variant: 'success',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
        {
          id: '2',
          title: 'Test 2',
          variant: 'info',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    renderPanel();
    expect(
      screen.getByRole('button', { name: /2 sin leer/i })
    ).toBeInTheDocument();
  });

  it('opens the panel on click', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows empty state when no notifications', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByText('Sin notificaciones')).toBeInTheDocument();
  });

  it('renders notifications when there are some', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Producto creado',
          description: 'Camisa azul',
          variant: 'success',
          category: 'inventory',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByText('Producto creado')).toBeInTheDocument();
    expect(screen.getByText('Camisa azul')).toBeInTheDocument();
  });

  it('shows only the last 5 notifications', async () => {
    useNotificationsStore.setState({
      notifications: Array.from({ length: 8 }, (_, i) => ({
        id: String(i),
        title: 'Notif ' + i,
        variant: 'info' as const,
        category: 'system' as const,
        timestamp: Date.now() - i * 1000,
        read: false,
      })),
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByText('Notif 0')).toBeInTheDocument();
    expect(screen.getByText('Notif 4')).toBeInTheDocument();
    expect(screen.queryByText('Notif 5')).not.toBeInTheDocument();
  });

  it('shows "Ver todas" when there are more than 5 notifications', async () => {
    useNotificationsStore.setState({
      notifications: Array.from({ length: 8 }, (_, i) => ({
        id: String(i),
        title: 'Notif ' + i,
        variant: 'info' as const,
        category: 'system' as const,
        timestamp: Date.now() - i * 1000,
        read: false,
      })),
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByText(/Ver todas \(8\)/i)).toBeInTheDocument();
  });

  it('navigates to /notifications when "Ver todas" is clicked', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Test',
          variant: 'info',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    await user.click(screen.getByRole('button', { name: /Ir al historial/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });

  it('marks a notification as read on click', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: 'n1',
          title: 'Nueva factura',
          variant: 'info',
          category: 'billing',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    await user.click(screen.getByText('Nueva factura'));
    expect(useNotificationsStore.getState().notifications[0].read).toBe(true);
  });

  it('marks all as read when "Marcar todas" is clicked', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: '1',
          title: 'Test 1',
          variant: 'success',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
        {
          id: '2',
          title: 'Test 2',
          variant: 'info',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    await user.click(
      screen.getByRole('button', { name: /Marcar todas/i })
    );
    expect(
      useNotificationsStore.getState().notifications.every((n) => n.read)
    ).toBe(true);
  });

  it('removes a notification when X is clicked', async () => {
    useNotificationsStore.setState({
      notifications: [
        {
          id: 'n1',
          title: 'Test',
          variant: 'success',
          category: 'system',
          timestamp: Date.now(),
          read: false,
        },
      ],
    });
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    await user.click(
      screen.getByRole('button', { name: /Eliminar notificacion: Test/i })
    );
    expect(useNotificationsStore.getState().notifications.length).toBe(0);
  });

  it('closes the panel on Escape', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the panel on outside click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <div>
          <NotificationPanel />
          <button>Outside</button>
        </div>
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: /Notificaciones/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
