import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children message', () => {
    render(<Alert>Producto creado correctamente</Alert>);
    expect(
      screen.getByText('Producto creado correctamente')
    ).toBeInTheDocument();
  });

  it('renders with role alert for accessibility', () => {
    render(<Alert>Mensaje</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Exito">Operacion completada</Alert>);
    expect(screen.getByText('Exito')).toBeInTheDocument();
    expect(screen.getByText('Operacion completada')).toBeInTheDocument();
  });

  it('does not render title when not provided', () => {
    render(<Alert>Solo mensaje</Alert>);
    expect(screen.queryByText('Exito')).not.toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<Alert variant="error">Error</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/error/);
  });

  it('uses default variant info', () => {
    render(<Alert>Info</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/info/);
  });

  it('renders close button when onClose is provided', () => {
    render(<Alert onClose={() => {}}>Cerrar</Alert>);
    expect(
      screen.getByRole('button', { name: 'Cerrar alerta' })
    ).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Alert>Sin cerrar</Alert>);
    expect(
      screen.queryByRole('button', { name: 'Cerrar alerta' })
    ).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();
    render(<Alert onClose={handleClose}>Cerrar</Alert>);
    await user.click(screen.getByRole('button', { name: 'Cerrar alerta' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon when provided', () => {
    render(
      <Alert icon={<span data-testid="custom-icon">*</span>}>Custom</Alert>
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Alert className="custom-alert">Custom</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/custom-alert/);
  });
});
