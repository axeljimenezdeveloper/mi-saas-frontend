import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, type ToastData } from './Toast';

const makeToast = (overrides: Partial<ToastData> = {}): ToastData => ({
  id: 'test-1',
  variant: 'success',
  title: 'Producto guardado',
  ...overrides,
});

describe('Toast', () => {
  it('renders title', () => {
    render(<Toast toast={makeToast()} onClose={() => {}} />);
    expect(screen.getByText('Producto guardado')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Toast
        toast={makeToast({ description: 'El producto se agrego al inventario' })}
        onClose={() => {}}
      />
    );
    expect(
      screen.getByText('El producto se agrego al inventario')
    ).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<Toast toast={makeToast()} onClose={() => {}} />);
    expect(
      screen.queryByText('El producto se agrego al inventario')
    ).not.toBeInTheDocument();
  });

  it('has role status for accessibility', () => {
    render(<Toast toast={makeToast()} onClose={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Toast toast={makeToast({ variant: 'error' })} onClose={() => {}} />);
    const toast = screen.getByRole('status');
    expect(toast.className).toMatch(/error/);
  });

  it('calls onClose with id when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<Toast toast={makeToast({ id: 'toast-abc' })} onClose={handleClose} />);
    await user.click(screen.getByRole('button', { name: 'Cerrar notificacion' }));
    expect(handleClose).toHaveBeenCalledWith('toast-abc');
  });

  it('auto-closes after duration ms', async () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    render(
      <Toast
        toast={makeToast({ id: 'auto-close', duration: 2000 })}
        onClose={handleClose}
      />
    );
    expect(handleClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(handleClose).toHaveBeenCalledWith('auto-close');
    vi.useRealTimers();
  });

  it('does not auto-close when duration is 0', async () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    render(
      <Toast
        toast={makeToast({ id: 'no-close', duration: 0 })}
        onClose={handleClose}
      />
    );
    vi.advanceTimersByTime(10000);
    expect(handleClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
