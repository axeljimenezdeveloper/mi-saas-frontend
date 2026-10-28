import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Escribe aquí" />);
    expect(screen.getByPlaceholderText('Escribe aquí')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Textarea onChange={handleChange} placeholder="Type" />);
    await user.type(screen.getByPlaceholderText('Type'), 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('renders error message and marks textarea as invalid', () => {
    render(<Textarea error="Descripción requerida" />);
    expect(screen.getByText('Descripción requerida')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text when no error', () => {
    render(<Textarea helperText="Máximo 200 caracteres" />);
    expect(screen.getByText('Máximo 200 caracteres')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Textarea error="Error" helperText="Helper" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('applies rows prop to native textarea', () => {
    render(<Textarea rows={6} placeholder="Rows" />);
    expect(screen.getByPlaceholderText('Rows')).toHaveAttribute('rows', '6');
  });
});
