import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

function Bomb(): ReactElement {
  throw new Error('boom test');
}

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Contenido normal</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
    expect(screen.queryByText('Algo salio mal')).not.toBeInTheDocument();
  });

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(
      screen.getByRole('heading', { name: 'Algo salio mal' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Recargar pagina/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ir al dashboard/i })
    ).toBeInTheDocument();
  });

  it('exposes the error message in technical details', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Detalles tecnicos')).toBeInTheDocument();
    expect(screen.getByText('boom test')).toBeInTheDocument();
  });

  it('calls onError callback when a child throws', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(onError).toHaveBeenCalledTimes(1);
    const [error] = onError.mock.calls[0];
    expect(error.message).toBe('boom test');
  });

  it('uses custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Algo salio mal' })
    ).not.toBeInTheDocument();
  });

});