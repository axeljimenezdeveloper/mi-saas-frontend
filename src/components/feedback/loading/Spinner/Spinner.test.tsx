import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with status role', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default accessible label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
  });

  it('accepts custom label', () => {
    render(<Spinner label="Guardando producto" />);
    expect(
      screen.getByRole('status', { name: 'Guardando producto' })
    ).toBeInTheDocument();
  });

  it('applies size class', () => {
    render(<Spinner size="lg" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toMatch(/lg/);
  });

  it('applies color class', () => {
    render(<Spinner color="inverse" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toMatch(/inverse/);
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-spinner" />);
    const spinner = screen.getByRole('status');
    expect(spinner.className).toMatch(/custom-spinner/);
  });
});
