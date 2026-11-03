import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
  it('renders with default currency symbol Bs.', () => {
    render(<CurrencyInput value={undefined} onChange={() => {}} />);
    expect(screen.getByText('Bs.')).toBeInTheDocument();
  });

  it('renders with USD symbol when currency="USD"', () => {
    render(<CurrencyInput value={undefined} onChange={() => {}} currency="USD" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders currency selector when showCurrencySelector is true', () => {
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        showCurrencySelector
      />
    );
    expect(
      screen.getByRole('combobox', { name: 'Seleccionar moneda' })
    ).toBeInTheDocument();
  });

  it('calls onCurrencyChange when currency is changed', async () => {
    const handleCurrency = vi.fn();
    const user = userEvent.setup();
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        showCurrencySelector
        onCurrencyChange={handleCurrency}
      />
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Seleccionar moneda' }),
      'USD'
    );
    expect(handleCurrency).toHaveBeenCalledWith('USD');
  });

  it('calls onChange with parsed number when typing', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<CurrencyInput value={undefined} onChange={handleChange} />);
    const input = screen.getByPlaceholderText('0,00');
    await user.type(input, '123');
    expect(handleChange).toHaveBeenCalled();
    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe(123);
  });

  it('renders formatted initial value', () => {
    render(<CurrencyInput value={1234.56} onChange={() => {}} />);
    const input = screen.getByPlaceholderText('0,00') as HTMLInputElement;
    // El formato esperado es "1.234,56" (es-VE)
    expect(input.value).toMatch(/1[.,]234[.,]56/);
  });

  it('renders error message and marks input as invalid', () => {
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        error="El precio es obligatorio"
      />
    );
    expect(screen.getByText('El precio es obligatorio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0,00')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('renders helper text when no error', () => {
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        helperText="Monto en bolivares"
      />
    );
    expect(screen.getByText('Monto en bolivares')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        error="Error"
        helperText="Helper"
      />
    );
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <CurrencyInput value={undefined} onChange={() => {}} disabled />
    );
    expect(screen.getByPlaceholderText('0,00')).toBeDisabled();
  });

  it('uses custom placeholder when provided', () => {
    render(
      <CurrencyInput
        value={undefined}
        onChange={() => {}}
        placeholder="Ingresa un monto"
      />
    );
    expect(
      screen.getByPlaceholderText('Ingresa un monto')
    ).toBeInTheDocument();
  });
});
