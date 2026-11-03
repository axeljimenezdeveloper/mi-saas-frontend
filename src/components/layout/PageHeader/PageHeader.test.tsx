import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Inventario" />);
    expect(screen.getByRole('heading', { name: 'Inventario' })).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <PageHeader title="Inventario" subtitle="Gestiona tus productos" />
    );
    expect(screen.getByText('Gestiona tus productos')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<PageHeader title="Inventario" />);
    expect(
      screen.queryByText('Gestiona tus productos')
    ).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PageHeader
        title="Inventario"
        actions={<button>Nuevo producto</button>}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Nuevo producto' })
    ).toBeInTheDocument();
  });

  it('does not render actions when not provided', () => {
    render(<PageHeader title="Inventario" />);
    expect(
      screen.queryByRole('button', { name: 'Nuevo producto' })
    ).not.toBeInTheDocument();
  });

  it('does not render back button when onBack is not provided', () => {
    render(<PageHeader title="Inventario" />);
    expect(
      screen.queryByRole('button', { name: 'Volver' })
    ).not.toBeInTheDocument();
  });

  it('renders back button when onBack is provided', () => {
    render(<PageHeader title="Editar producto" onBack={() => {}} />);
    expect(
      screen.getByRole('button', { name: 'Volver' })
    ).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const handleBack = vi.fn();
    const user = userEvent.setup();
    render(<PageHeader title="Detalle" onBack={handleBack} />);
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('uses custom backLabel when provided', () => {
    render(
      <PageHeader title="Detalle" onBack={() => {}} backLabel="Regresar" />
    );
    expect(
      screen.getByRole('button', { name: 'Regresar' })
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageHeader title="Inventario" className="custom-header" />
    );
    const header = container.firstChild as HTMLElement;
    expect(header.className).toMatch(/custom-header/);
  });
});
