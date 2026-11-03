import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Contenido principal</Card>);
    expect(screen.getByText('Contenido principal')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    render(<Card header="Titulo de la card">Body</Card>);
    expect(screen.getByText('Titulo de la card')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(<Card footer={<button>Accion</button>}>Body</Card>);
    expect(screen.getByRole('button', { name: 'Accion' })).toBeInTheDocument();
  });

  it('does not render header when not provided', () => {
    render(<Card>Body only</Card>);
    expect(screen.getByText('Body only')).toBeInTheDocument();
    // No hay header: el texto del body debe ser el unico en el DOM
    expect(screen.queryByText('Titulo')).not.toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/elevated/);
  });

  it('applies padding class', () => {
    const { container } = render(<Card padding="lg">Padded</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/padding-lg/);
  });

  it('applies fullWidth class', () => {
    const { container } = render(<Card fullWidth>Full</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/fullWidth/);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Custom</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/custom/);
  });
});
