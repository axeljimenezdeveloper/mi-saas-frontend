import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a single skeleton by default', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[class*="skeleton"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('is aria-hidden (decorative, no info for screen readers)', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('[class*="skeleton"]');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders multiple lines when lines > 1', () => {
    const { container } = render(<Skeleton lines={3} />);
    const items = container.querySelectorAll('[class*="skeleton"]');
    expect(items).toHaveLength(3);
  });

  it('applies circular variant class', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.querySelector('[class*="skeleton"]');
    expect(skeleton?.className).toMatch(/circular/);
  });

  it('applies rectangular variant class', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const skeleton = container.querySelector('[class*="skeleton"]');
    expect(skeleton?.className).toMatch(/rectangular/);
  });

  it('applies custom width and height', () => {
    const { container } = render(
      <Skeleton width="200px" height="80px" variant="rectangular" />
    );
    const skeleton = container.querySelector('[class*="skeleton"]') as HTMLElement;
    expect(skeleton.style.width).toBe('200px');
    expect(skeleton.style.height).toBe('80px');
  });

  it('last line of multi-line has 60% width', () => {
    const { container } = render(<Skeleton lines={3} />);
    const items = container.querySelectorAll('[class*="skeleton"]');
    const lastItem = items[items.length - 1] as HTMLElement;
    expect(lastItem.style.width).toBe('60%');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    const skeleton = container.querySelector('[class*="skeleton"]');
    expect(skeleton?.className).toMatch(/custom-skeleton/);
  });
});
