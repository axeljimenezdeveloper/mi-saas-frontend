import { describe, it, expect, beforeEach } from 'vitest';
import { useSidebarStore } from './sidebarStore';

describe('sidebarStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSidebarStore.setState({ isCollapsed: false, isMobileOpen: false });
  });

  it('has default state: not collapsed, mobile closed', () => {
    const state = useSidebarStore.getState();
    expect(state.isCollapsed).toBe(false);
    expect(state.isMobileOpen).toBe(false);
  });

  it('toggleCollapse toggles isCollapsed', () => {
    useSidebarStore.getState().toggleCollapse();
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
    useSidebarStore.getState().toggleCollapse();
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });

  it('setCollapsed sets isCollapsed to specific value', () => {
    useSidebarStore.getState().setCollapsed(true);
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
    useSidebarStore.getState().setCollapsed(false);
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });

  it('openMobile opens the mobile drawer', () => {
    useSidebarStore.getState().openMobile();
    expect(useSidebarStore.getState().isMobileOpen).toBe(true);
  });

  it('closeMobile closes the mobile drawer', () => {
    useSidebarStore.getState().openMobile();
    useSidebarStore.getState().closeMobile();
    expect(useSidebarStore.getState().isMobileOpen).toBe(false);
  });

  it('persists only isCollapsed to localStorage (not isMobileOpen)', () => {
    useSidebarStore.getState().setCollapsed(true);
    useSidebarStore.getState().openMobile();

    const raw = localStorage.getItem('mi-saas-sidebar');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string);
    // El formato de zustand persist es { state: {...}, version: 0 }
    expect(parsed.state.isCollapsed).toBe(true);
    expect(parsed.state.isMobileOpen).toBeUndefined();
  });
});
