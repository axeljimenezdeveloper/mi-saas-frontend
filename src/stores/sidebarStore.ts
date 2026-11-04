import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SidebarStore {
  /** En desktop: sidebar colapsado a 64px (solo iconos). */
  isCollapsed: boolean;
  /** En mobile: drawer abierto (overlay visible). */
  isMobileOpen: boolean;
  /** Alterna el estado colapsado (desktop). */
  toggleCollapse: () => void;
  /** Setea el estado colapsado explicitamente. */
  setCollapsed: (collapsed: boolean) => void;
  /** Abre el drawer mobile. */
  openMobile: () => void;
  /** Cierra el drawer mobile. */
  closeMobile: () => void;
}

const STORAGE_KEY = 'mi-saas-sidebar';

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,

      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),

      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

      openMobile: () => set({ isMobileOpen: true }),

      closeMobile: () => set({ isMobileOpen: false }),
    }),
    {
      name: STORAGE_KEY,
      // Solo persistimos isCollapsed. isMobileOpen siempre arranca false.
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
