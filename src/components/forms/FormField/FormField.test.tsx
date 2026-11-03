import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../../common/inputs/Input';

describe('FormField', () => {
  it('renders label', () => {
    render(
      <FormField label="Nombre" htmlFor="name">
        <Input id="name" placeholder="Escribe tu nombre" />
      </FormField>
    );
    expect(screen.getByText('Nombre')).toBeInTheDocument();
  });

  it('renders children control', () => {
    render(
      <FormField label="Nombre" htmlFor="name">
        <Input id="name" placeholder="Escribe tu nombre" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Escribe tu nombre')).toBeInTheDocument();
  });

  it('links label with control via htmlFor', () => {
    render(
      <FormField label="Nombre" htmlFor="name">
        <Input id="name" />
      </FormField>
    );
    const label = screen.getByText('Nombre');
    expect(label).toHaveAttribute('for', 'name');
  });

  it('renders helper text when no error', () => {
    render(
      <FormField label="Nombre" helperText="Maximo 100 caracteres">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Maximo 100 caracteres')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    render(
      <FormField label="Nombre" error="Este campo es obligatorio">
        <Input />
      </FormField>
    );
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <FormField
        label="Nombre"
        helperText="Helper visible"
        error="Error visible"
      >
        <Input />
      </FormField>
    );
    expect(screen.queryByText('Helper visible')).not.toBeInTheDocument();
    expect(screen.getByText('Error visible')).toBeInTheDocument();
  });

  it('renders required asterisk when required is true', () => {
    const { container } = render(
      <FormField label="Nombre" required>
        <Input />
      </FormField>
    );
    const asterisk = container.querySelector('[class*="required"]');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk?.textContent).toBe('*');
  });

  it('does not render asterisk when required is false', () => {
    const { container } = render(
      <FormField label="Nombre">
        <Input />
      </FormField>
    );
    const asterisk = container.querySelector('[class*="required"]');
    expect(asterisk).not.toBeInTheDocument();
  });

  it('renders (opcional) when optional is true', () => {
    render(
      <FormField label="SKU" optional>
        <Input />
      </FormField>
    );
    expect(screen.getByText('(opcional)')).toBeInTheDocument();
  });

  it('does not render (opcional) when optional is false', () => {
    render(
      <FormField label="SKU">
        <Input />
      </FormField>
    );
    expect(screen.queryByText('(opcional)')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormField label="Nombre" className="custom-field">
        <Input />
      </FormField>
    );
    const field = container.firstChild as HTMLElement;
    expect(field.className).toMatch(/custom-field/);
  });

  it('generates an auto id when htmlFor is not provided', () => {
    render(
      <FormField label="Nombre">
        <Input />
      </FormField>
    );
    const label = screen.getByText('Nombre');
    expect(label).toHaveAttribute('for');
    expect(label.getAttribute('for')).not.toBe('');
  });
});
