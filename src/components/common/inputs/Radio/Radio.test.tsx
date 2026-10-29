import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders with label', () => {
    render(<Radio label="Opcion A" name="test" />);
    expect(screen.getByLabelText('Opcion A')).toBeInTheDocument();
  });

  it('selects when clicked', async () => {
    const user = userEvent.setup();
    render(<Radio label="Select me" name="test" />);
    const radio = screen.getByRole('radio') as HTMLInputElement;
    expect(radio.checked).toBe(false);
    await user.click(radio);
    expect(radio.checked).toBe(true);
  });

  it('calls onChange when selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Radio label="Notify" name="test" onChange={handleChange} />);
    await user.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is checked by default when defaultChecked is passed', () => {
    render(<Radio label="Pre-checked" name="test" defaultChecked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Radio label="Disabled" name="test" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('renders helper text when no error', () => {
    render(<Radio label="With helper" name="test" helperText="Este es un texto de ayuda" />);
    expect(screen.getByText('Este es un texto de ayuda')).toBeInTheDocument();
  });

  it('renders error message and marks radio as invalid', () => {
    render(<Radio label="Required" name="test" error="Debes elegir una opcion" />);
    expect(screen.getByText('Debes elegir una opcion')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('hides helper text when error is present', () => {
    render(<Radio label="With both" name="test" helperText="Helper" error="Error" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('only one radio can be selected in the same group', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Radio label="A" name="group" value="a" />
        <Radio label="B" name="group" value="b" />
        <Radio label="C" name="group" value="c" />
      </div>
    );
    const [radioA, radioB, radioC] = screen.getAllByRole('radio');
    await user.click(radioA);
    expect(radioA).toBeChecked();
    await user.click(radioB);
    expect(radioA).not.toBeChecked();
    expect(radioB).toBeChecked();
    await user.click(radioC);
    expect(radioB).not.toBeChecked();
    expect(radioC).toBeChecked();
  });
});
