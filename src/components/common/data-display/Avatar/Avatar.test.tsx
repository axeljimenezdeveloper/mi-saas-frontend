import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders initials for a single name', () => {
    render(<Avatar name="Axel" />);
    expect(screen.getByText('AX')).toBeInTheDocument();
  });

  it('renders two initials for first and last name', () => {
    render(<Avatar name="Axel Jimenez" />);
    expect(screen.getByText('AJ')).toBeInTheDocument();
  });

  it('renders first and last initial when name has middle names', () => {
    render(<Avatar name="Axel Gabriel Jimenez Malaver" />);
    expect(screen.getByText('AM')).toBeInTheDocument();
  });

  it('exposes the full name via aria-label', () => {
    render(<Avatar name="Axel Jimenez" />);
    expect(screen.getByRole('img', { name: 'Axel Jimenez' })).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar name="Axel" src="https://example.com/avatar.jpg" />);
    const img = screen.getByRole('img', { name: 'Axel' }).querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders status dot when status is provided', () => {
    const { container } = render(<Avatar name="Axel" status="online" />);
    const dot = container.querySelector('[class*="statusDot"]');
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toMatch(/online/);
  });

  it('does not render status dot when status is not provided', () => {
    const { container } = render(<Avatar name="Axel" />);
    const dot = container.querySelector('[class*="statusDot"]');
    expect(dot).not.toBeInTheDocument();
  });

  it('applies size class', () => {
    render(<Avatar name="Axel" size="lg" />);
    const avatar = screen.getByRole('img', { name: 'Axel' });
    expect(avatar.className).toMatch(/lg/);
  });

  it('applies custom className', () => {
    render(<Avatar name="Axel" className="custom-avatar" />);
    const avatar = screen.getByRole('img', { name: 'Axel' });
    expect(avatar.className).toMatch(/custom-avatar/);
  });
});
