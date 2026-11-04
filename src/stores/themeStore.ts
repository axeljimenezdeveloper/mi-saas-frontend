import { create } from 'zustand';

export type Theme = 'light' | 'dark';

export interface ThemeStore {
  /** Tema actual. */
  theme: Theme;
  /** Cambia a un tema especifico. Aplica al DOM y a localStorage. */
  setTheme: (theme: Theme) => void;
  /** Alterna entre light y dark. */
  toggleTheme: () => void;
}

const STORAGE_KEY = 'theme';

/**
 * Lee el tema inicial en este orden:
 * 1. El atributo `data-theme` del <html> (ya aplicado por el script inline en index.html).
 * 2. localStorage['theme'] (por si el script no corrio, ej. tests).
 * 3. Fallback 'dark'.
 */
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const fromDom = document.documentElement.getAttribute('data-theme');
  if (fromDom === 'light' || fromDom === 'dark') return fromDom;

  try {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage === 'light' || fromStorage === 'dark') return fromStorage;
  } catch {
    // localStorage puede fallar en modo privado
  }

  return 'dark';
}

/** Aplica el tema al DOM y persiste en localStorage. */
function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  document.documentElement.setAttribute('data-theme', theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignorar errores de storage
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
