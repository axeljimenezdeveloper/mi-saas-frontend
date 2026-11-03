import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No hay productos" />);
    expect(screen.getByText('No hay productos')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No hay productos"
        description="Crea tu primer producto para empezar"
      />
    );
    expect(
      screen.getByText('Crea tu primer producto para empezar')
    ).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="Sin descripcion" />);
    expect(
      screen.queryByText('Crea tu primer producto para empezar')
    ).not.toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="Vacio"
        action={<button>Crear producto</button>}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Crear producto' })
    ).toBeInTheDocument();
  });

  it('does not render action when not provided', () => {
    render(<EmptyState title="Sin accion" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders default icon when no icon is provided', () => {
    const { container } = render(<EmptyState title="Default icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(
      <EmptyState
        title="Custom icon"
        icon={<span data-testid="custom-icon">*</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<EmptyState title="Large" size="lg" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toMatch(/lg/);
  });

  it('uses default size md', () => {
    const { container } = render(<EmptyState title="Default" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toMatch(/md/);
  });

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="Custom" className="custom-empty" />
    );
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState.className).toMatch(/custom-empty/);
  });
});
