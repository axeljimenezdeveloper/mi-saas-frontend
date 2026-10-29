import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(<Checkbox label="Acepto los terminos" />);
    expect(screen.getByLabelText('Acepto los terminos')).toBeInTheDocument();
  });

  it('toggles when clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Toggle me" />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(true);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('calls onChange when toggled', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox label="Notify" onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is checked by default when defaultChecked is passed', () => {
    render(<Checkbox label="Pre-checked" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders helper text when no error', () => {
    render(<Checkbox label="With helper" helperText="Este es un texto de ayuda" />);
    expect(screen.getByText('Este es un texto de ayuda')).toBeInTheDocument();
  });

  it('renders error message and marks checkbox as invalid', () => {
    render(<Checkbox label="Required" error="Debes aceptar los terminos" />);
    expect(screen.getByText('Debes aceptar los terminos')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hides helper text when error is present', () => {
    render(<Checkbox label="With both" helperText="Helper" error="Error" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
