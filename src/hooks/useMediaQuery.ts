import { useSyncExternalStore } from 'react';

/**
 * Hook que retorna true si la query de media matchea el viewport actual.
 * Usa useSyncExternalStore (patron oficial de React para suscribirse a
 * fuentes externas como window.matchMedia).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    // subscribe
    (callback) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    // getSnapshot
    () => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
      }
      return window.matchMedia(query).matches;
    },
    // getServerSnapshot (SSR)
    () => false
  );
}
