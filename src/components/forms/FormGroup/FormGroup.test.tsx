import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormGroup } from './FormGroup';

describe('FormGroup', () => {
  it('renders title', () => {
    render(
      <FormGroup title="Datos del producto">
        <span>Contenido</span>
      </FormGroup>
    );
    expect(screen.getByText('Datos del producto')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <FormGroup title="Datos" description="Informacion basica del producto">
        <span>Contenido</span>
      </FormGroup>
    );
    expect(
      screen.getByText('Informacion basica del producto')
    ).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(
      <FormGroup title="Datos">
        <span>Contenido</span>
      </FormGroup>
    );
    expect(
      screen.queryByText('Informacion basica del producto')
    ).not.toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <FormGroup title="Datos">
        <span>Campo 1</span>
        <span>Campo 2</span>
      </FormGroup>
    );
    expect(screen.getByText('Campo 1')).toBeInTheDocument();
    expect(screen.getByText('Campo 2')).toBeInTheDocument();
  });

  it('uses semantic section and header elements', () => {
    const { container } = render(
      <FormGroup title="Datos">
        <span>Contenido</span>
      </FormGroup>
    );
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('h3')).toBeInTheDocument();
  });

  it('applies default stack layout', () => {
    const { container } = render(
      <FormGroup title="Datos">
        <span>Contenido</span>
      </FormGroup>
    );
    const content = container.querySelector('[class*="content"]') as HTMLElement;
    expect(content.className).toMatch(/stack/);
  });

  it('applies two-columns layout when specified', () => {
    const { container } = render(
      <FormGroup title="Datos" layout="two-columns">
        <span>Contenido</span>
      </FormGroup>
    );
    const content = container.querySelector('[class*="content"]') as HTMLElement;
    expect(content.className).toMatch(/two-columns/);
  });

  it('applies three-columns layout when specified', () => {
    const { container } = render(
      <FormGroup title="Datos" layout="three-columns">
        <span>Contenido</span>
      </FormGroup>
    );
    const content = container.querySelector('[class*="content"]') as HTMLElement;
    expect(content.className).toMatch(/three-columns/);
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormGroup title="Datos" className="custom-group">
        <span>Contenido</span>
      </FormGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toMatch(/custom-group/);
  });
});
