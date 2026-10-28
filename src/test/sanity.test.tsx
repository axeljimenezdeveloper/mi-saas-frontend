// src/test/sanity.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Vitest infrastructure', () => {
  it('should perform basic arithmetic', () => {
    expect(2 + 2).toBe(4);
  });
});

function DummyComponent() {
  return <h1>Hola Vitest</h1>;
}

describe('React Testing Library infrastructure', () => {
  it('should render a React component and find text', () => {
    render(<DummyComponent />);
    expect(screen.getByText('Hola Vitest')).toBeInTheDocument();
  });
});