import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders with label', () => {
    render(<Switch label="Notificaciones" />);
    expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument();
  });

  it('has role switch', () => {
    render(<Switch label="Mode" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('toggles when clicked', async () => {
    const user = userEvent.setup();
    render(<Switch label="Toggle me" />);
    const sw = screen.getByRole('switch') as HTMLInputElement;
    expect(sw.checked).toBe(false);
    await user.click(sw);
    expect(sw.checked).toBe(true);
    await user.click(sw);
    expect(sw.checked).toBe(false);
  });

  it('calls onChange when toggled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Switch label="Notify" onChange={handleChange} />);
    await user.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is checked by default when defaultChecked is passed', () => {
    render(<Switch label="Pre-checked" defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch label="Disabled" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('renders helper text when no error', () => {
    render(<Switch label="With helper" helperText="Recibe alertas por email" />);
    expect(screen.getByText('Recibe alertas por email')).toBeInTheDocument();
  });

  it('renders error message and marks switch as invalid', () => {
    render(<Switch label="Required" error="Debes activar esta opcion" />);
    expect(screen.getByText('Debes activar esta opcion')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hides helper text when error is present', () => {
    render(<Switch label="With both" helperText="Helper" error="Error" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
