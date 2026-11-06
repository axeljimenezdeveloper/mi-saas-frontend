import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
  useNotificationsStore,
  type NotificationCategory,
} from './notificationsStore';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastOptions {
  category?: NotificationCategory;
  actionUrl?: string;
}

const DEFAULT_DURATION = 4000;
let toastCounter = 0;

function createId(): string {
  toastCounter += 1;
  return 'toast-' + Date.now() + '-' + toastCounter;
}

export interface ToastStore {
  toasts: ToastData[];
  show: (toast: Omit<ToastData, 'id'>, options?: ToastOptions) => string;
  success: (title: string, description?: string, options?: ToastOptions) => string;
  error: (title: string, description?: string, options?: ToastOptions) => string;
  warning: (title: string, description?: string, options?: ToastOptions) => string;
  info: (title: string, description?: string, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  show: (toast, options) => {
    const id = createId();
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id, duration: toast.duration ?? DEFAULT_DURATION },
      ],
    }));

    // Cada toast tambien se registra como notificacion persistente
    useNotificationsStore.getState().addNotification({
      title: toast.title,
      description: toast.description,
      variant: toast.variant,
      category: options?.category ?? 'system',
      actionUrl: options?.actionUrl,
    });

    return id;
  },

  success: (title, description, options) =>
    get().show({ variant: 'success', title, description }, options),

  error: (title, description, options) =>
    get().show({ variant: 'error', title, description }, options),

  warning: (title, description, options) =>
    get().show({ variant: 'warning', title, description }, options),

  info: (title, description, options) =>
    get().show({ variant: 'info', title, description }, options),

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  dismissAll: () => set({ toasts: [] }),
}));

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
