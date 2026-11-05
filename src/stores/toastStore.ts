import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

const DEFAULT_DURATION = 4000;
let toastCounter = 0;

function createId(): string {
  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

export interface ToastStore {
  toasts: ToastData[];
  show: (toast: Omit<ToastData, 'id'>) => string;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  show: (toast) => {
    const id = createId();
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id, duration: toast.duration ?? DEFAULT_DURATION },
      ],
    }));
    return id;
  },

  success: (title, description) =>
    get().show({ variant: 'success', title, description }),

  error: (title, description) =>
    get().show({ variant: 'error', title, description }),

  warning: (title, description) =>
    get().show({ variant: 'warning', title, description }),

  info: (title, description) =>
    get().show({ variant: 'info', title, description }),

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  dismissAll: () => set({ toasts: [] }),
}));

/**
 * Hook con la API de acciones (memoizada con useShallow para no re-renderizar
 * cada vez que la cola de toasts cambia).
 */
export function useToast() {
  return useToastStore(
    useShallow((s) => ({
      show: s.show,
      success: s.success,
      error: s.error,
      warning: s.warning,
      info: s.info,
      dismiss: s.dismiss,
      dismissAll: s.dismissAll,
    }))
  );
}
