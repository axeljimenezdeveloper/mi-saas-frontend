import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { value: 'electronics', label: 'Electrónica' },
  { value: 'clothing', label: 'Ropa' },
  { value: 'food', label: 'Alimentos' },
];

describe('Select', () => {
  it('renders placeholder as disabled hidden option', () => {
    render(<Select options={OPTIONS} placeholder="Selecciona una categoría" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    // El placeholder es un <option> con atributos disabled y hidden, por lo que
    // no es accesible como role="option". Lo verificamos por texto.
    const placeholder = screen.getByText('Selecciona una categoría');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute('disabled');
    expect(placeholder).toHaveAttribute('hidden');
  });

  it('renders all provided options', () => {
    render(<Select options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Electrónica' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ropa' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Alimentos' })).toBeInTheDocument();
  });

  it('calls onChange when an option is selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={OPTIONS} onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), 'clothing');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders error message and marks select as invalid', () => {
    render(<Select options={OPTIONS} error="La categoría es obligatoria" />);
    expect(screen.getByText('La categoría es obligatoria')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text when no error', () => {
    render(<Select options={OPTIONS} helperText="Selecciona la más adecuada" />);
    expect(screen.getByText('Selecciona la más adecuada')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <Select options={OPTIONS} error="Error" helperText="Helper" />
    );
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select options={OPTIONS} disabled placeholder="Disabled" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders left icon', () => {
    render(
      <Select
        options={OPTIONS}
        leftIcon={<span data-testid="left-icon">L</span>}
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });
});
