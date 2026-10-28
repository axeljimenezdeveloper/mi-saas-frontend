import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} placeholder="Type" />);
    await user.type(screen.getByPlaceholderText('Type'), 'abc');
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('renders error message and marks input as invalid', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text when no error', () => {
    render(<Input helperText="Optional helper" />);
    expect(screen.getByText('Optional helper')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input error="Error" helperText="Helper" />);
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('renders left and right icons', () => {
    render(
      <Input
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
