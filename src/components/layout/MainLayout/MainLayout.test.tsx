import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  const defaultProps = {
    sidebar: <aside>Sidebar content</aside>,
    renderHeader: (onMenuClick: () => void) => (
      <header>
        <button onClick={onMenuClick}>Menu</button>
        <span>Header content</span>
      </header>
    ),
    children: <main>Page content</main>,
  };

  it('renders sidebar', () => {
    render(<MainLayout {...defaultProps} />);
    expect(screen.getByText('Sidebar content')).toBeInTheDocument();
  });

  it('renders header via renderHeader prop', () => {
    render(<MainLayout {...defaultProps} />);
    expect(screen.getByText('Header content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<MainLayout {...defaultProps} />);
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('calls renderHeader with a function', () => {
    const renderHeader = vi.fn(() => <header>Header</header>);
    render(
      <MainLayout
        sidebar={<aside>Sidebar</aside>}
        renderHeader={renderHeader}
        children={<main>Content</main>}
      />
    );
    expect(renderHeader).toHaveBeenCalledTimes(1);
    expect(typeof renderHeader.mock.calls[0][0]).toBe('function');
  });

  it('does not render backdrop initially', () => {
    const { container } = render(<MainLayout {...defaultProps} />);
    expect(container.querySelector('[class*="backdrop"]')).not.toBeInTheDocument();
  });

  it('opens sidebar (renders backdrop) when menu button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<MainLayout {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(container.querySelector('[class*="backdrop"]')).toBeInTheDocument();
  });

  it('closes sidebar when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<MainLayout {...defaultProps} />);
    // Abre
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    const backdrop = container.querySelector('[class*="backdrop"]') as HTMLElement;
    expect(backdrop).toBeInTheDocument();
    // Cierra
    await user.click(backdrop);
    expect(container.querySelector('[class*="backdrop"]')).not.toBeInTheDocument();
  });

  it('closes sidebar when a link inside sidebar is clicked', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      sidebar: (
        <aside>
          <a href="/dashboard">Dashboard</a>
        </aside>
      ),
    };
    const { container } = render(<MainLayout {...props} />);
    // Abre
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(container.querySelector('[class*="backdrop"]')).toBeInTheDocument();
    // Click en link del sidebar
    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    expect(container.querySelector('[class*="backdrop"]')).not.toBeInTheDocument();
  });

  it('does not close sidebar when clicking inside sidebar but not on a link', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      sidebar: (
        <aside>
          <span>Just a text inside sidebar</span>
          <a href="/x">A link</a>
        </aside>
      ),
    };
    const { container } = render(<MainLayout {...props} />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await user.click(screen.getByText('Just a text inside sidebar'));
    // Sigue abierto
    expect(container.querySelector('[class*="backdrop"]')).toBeInTheDocument();
  });

  it('applies custom className to the root', () => {
    const { container } = render(
      <MainLayout {...defaultProps} className="custom-layout" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/custom-layout/);
  });
});
