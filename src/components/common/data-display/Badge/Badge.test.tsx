import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>En stock</Badge>);
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Badge variant="success">Activo</Badge>);
    const badge = screen.getByText('Activo').parentElement!;
    expect(badge.className).toMatch(/success/);
  });

  it('applies size class', () => {
    render(<Badge size="lg">Grande</Badge>);
    const badge = screen.getByText('Grande').parentElement!;
    expect(badge.className).toMatch(/lg/);
  });

  it('renders dot indicator when withDot is true', () => {
    const { container } = render(<Badge withDot>Online</Badge>);
    const dot = container.querySelector('[class*="dot"]');
    expect(dot).toBeInTheDocument();
  });

  it('does not render dot when withDot is false', () => {
    const { container } = render(<Badge>Sin dot</Badge>);
    const dot = container.querySelector('[class*="dot"]');
    expect(dot).not.toBeInTheDocument();
  });

  it('renders icon when icon prop is provided', () => {
    render(
      <Badge icon={<span data-testid="badge-icon">*</span>}>Con icono</Badge>
    );
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText('Custom').parentElement!;
    expect(badge.className).toMatch(/custom-class/);
  });
});
