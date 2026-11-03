import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('renders children', () => {
    render(
      <PageContainer>
        <p>Contenido de la pagina</p>
      </PageContainer>
    );
    expect(screen.getByText('Contenido de la pagina')).toBeInTheDocument();
  });

  it('applies default maxWidth lg', () => {
    const { container } = render(
      <PageContainer>
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/maxWidth-lg/);
  });

  it('applies custom maxWidth', () => {
    const { container } = render(
      <PageContainer maxWidth="sm">
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/maxWidth-sm/);
  });

  it('applies maxWidth full', () => {
    const { container } = render(
      <PageContainer maxWidth="full">
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/maxWidth-full/);
  });

  it('applies default padding md', () => {
    const { container } = render(
      <PageContainer>
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/padding-md/);
  });

  it('applies custom padding', () => {
    const { container } = render(
      <PageContainer padding="none">
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/padding-none/);
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageContainer className="custom-container">
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/custom-container/);
  });

  it('combines all classes correctly', () => {
    const { container } = render(
      <PageContainer maxWidth="xl" padding="lg" className="extra">
        <span>Contenido</span>
      </PageContainer>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/maxWidth-xl/);
    expect(el.className).toMatch(/padding-lg/);
    expect(el.className).toMatch(/extra/);
  });
});
