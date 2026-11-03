import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar, type SidebarItem } from './Sidebar';

const ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: <span>D</span>, href: '/dashboard' },
  { label: 'Inventario', icon: <span>I</span>, href: '/products' },
  { label: 'Facturacion', icon: <span>F</span>, href: '/billing', badge: 3 },
];

describe('Sidebar', () => {
  it('renders all items with labels', () => {
    render(<Sidebar items={ITEMS} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Inventario')).toBeInTheDocument();
    expect(screen.getByText('Facturacion')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<Sidebar items={ITEMS} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/dashboard');
    expect(links[1]).toHaveAttribute('href', '/products');
    expect(links[2]).toHaveAttribute('href', '/billing');
  });

  it('marks active item with aria-current', () => {
    render(<Sidebar items={ITEMS} activeHref="/products" />);
    const activeLink = screen.getByRole('link', { name: /Inventario/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark other items with aria-current', () => {
    render(<Sidebar items={ITEMS} activeHref="/products" />);
    const dashboardLink = screen.getByRole('link', { name: /Dashboard/ });
    expect(dashboardLink).not.toHaveAttribute('aria-current');
  });

  it('renders badge when provided', () => {
    render(<Sidebar items={ITEMS} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onNavigate when item is clicked and onNavigate is provided', async () => {
    const handleNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar items={ITEMS} onNavigate={handleNavigate} />);
    await user.click(screen.getByRole('link', { name: /Inventario/ }));
    expect(handleNavigate).toHaveBeenCalledWith('/products');
  });

  it('hides labels when isCollapsed is true', () => {
    render(<Sidebar items={ITEMS} isCollapsed />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Inventario')).not.toBeInTheDocument();
  });

  it('shows labels when isCollapsed is false', () => {
    render(<Sidebar items={ITEMS} isCollapsed={false} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders collapse button when onToggleCollapse is provided', () => {
    render(<Sidebar items={ITEMS} onToggleCollapse={() => {}} />);
    expect(
      screen.getByRole('button', { name: 'Colapsar menu' })
    ).toBeInTheDocument();
  });

  it('shows "Expandir menu" label when isCollapsed is true', () => {
    render(<Sidebar items={ITEMS} isCollapsed onToggleCollapse={() => {}} />);
    expect(
      screen.getByRole('button', { name: 'Expandir menu' })
    ).toBeInTheDocument();
  });

  it('calls onToggleCollapse when collapse button is clicked', async () => {
    const handleToggle = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar items={ITEMS} onToggleCollapse={handleToggle} />);
    await user.click(screen.getByRole('button', { name: 'Colapsar menu' }));
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('renders footer when provided', () => {
    render(
      <Sidebar
        items={ITEMS}
        footer={<div>Mi cuenta</div>}
      />
    );
    expect(screen.getByText('Mi cuenta')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(<Sidebar items={ITEMS} />);
    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Sidebar items={ITEMS} className="custom-sidebar" />
    );
    const sidebar = container.firstChild as HTMLElement;
    expect(sidebar.className).toMatch(/custom-sidebar/);
  });
});
