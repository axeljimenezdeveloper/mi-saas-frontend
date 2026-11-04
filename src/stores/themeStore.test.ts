import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from './themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    useThemeStore.setState({ theme: 'dark' });
  });

  it('has dark as default theme', () => {
    const theme = useThemeStore.getState().theme;
    expect(['light', 'dark']).toContain(theme);
  });

  it('setTheme changes the theme and applies to DOM', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('setTheme persists to localStorage', () => {
    useThemeStore.getState().setTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggleTheme toggles from dark to light', () => {
    useThemeStore.setState({ theme: 'dark' });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggleTheme toggles from light to dark', () => {
    useThemeStore.setState({ theme: 'light' });
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggleTheme persists the new theme to localStorage', () => {
    useThemeStore.setState({ theme: 'dark' });
    useThemeStore.getState().toggleTheme();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
