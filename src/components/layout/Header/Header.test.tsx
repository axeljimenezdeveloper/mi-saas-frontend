import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

describe('Header', () => {
  it('renders brand when provided', () => {
    render(<Header brand={<span>Vendra</span>} />);
    expect(screen.getByText('Vendra')).toBeInTheDocument();
  });

  it('does not render brand when not provided', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('[class*="brand"]')).not.toBeInTheDocument();
  });

  it('renders search when provided', () => {
    render(<Header search={<input placeholder="Buscar..." />} />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('does not render search when not provided', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('[class*="search"]')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<Header actions={<button>Notificaciones</button>} />);
    expect(
      screen.getByRole('button', { name: 'Notificaciones' })
    ).toBeInTheDocument();
  });

  it('does not render actions when not provided', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('[class*="actions"]')).not.toBeInTheDocument();
  });

  it('does not render menu button by default', () => {
    render(<Header />);
    expect(
      screen.queryByRole('button', { name: 'Abrir menu' })
    ).not.toBeInTheDocument();
  });

  it('renders menu button when showMenuButton is true', () => {
    render(<Header showMenuButton />);
    expect(
      screen.getByRole('button', { name: 'Abrir menu' })
    ).toBeInTheDocument();
  });

  it('calls onMenuClick when menu button is clicked', async () => {
    const handleMenu = vi.fn();
    const user = userEvent.setup();
    render(<Header showMenuButton onMenuClick={handleMenu} />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(handleMenu).toHaveBeenCalledTimes(1);
  });

  it('renders all 3 slots simultaneously', () => {
    render(
      <Header
        brand={<span>Logo</span>}
        search={<input placeholder="Buscar" />}
        actions={<button>Accion</button>}
      />
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accion' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Header className="custom-header" />);
    const header = container.firstChild as HTMLElement;
    expect(header.className).toMatch(/custom-header/);
  });
});

