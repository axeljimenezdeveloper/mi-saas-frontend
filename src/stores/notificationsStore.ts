// src/stores/notificationsStore.ts
// Feature flag: USE_BACKEND=false -> mock in-memory (tests, demo sin backend).
// USE_BACKEND=true -> backend-aware: fetchNotifications() trae del backend,
// los metodos sync hacen optimistic local + async fire-and-forget con rollback.
//
// API publica intacta (addNotification, markAsRead, markAllAsRead,
// removeNotification, clearAll, clearByCategory, useNotificationsActions)
// para no romper NotificationPanel, Notifications ni toastStore.
//
// addNotification: no-op en backend mode porque las notificaciones las crea
// el backend via notify() en los services. En mock mode sigue funcionando.

import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { USE_BACKEND } from '../config/backend';
import {
  listNotificationsRequest,
  markNotificationReadRequest,
  markAllNotificationsReadRequest,
  deleteNotificationRequest,
  clearAllNotificationsRequest,
} from '../api/notifications';

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export type NotificationCategory =
  | 'system'
  | 'inventory'
  | 'billing'
  | 'auth';

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  variant: NotificationVariant;
  category: NotificationCategory;
  /** Ruta opcional a la que navegar al hacer click. */
  actionUrl?: string;
  timestamp: number;
  read: boolean;
}

export interface NotificationsStore {
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearByCategory: (category: NotificationCategory) => void;
  /** Carga las notificaciones del backend (solo si USE_BACKEND=true). */
  fetchNotifications: () => Promise<void>;
  clearError: () => void;
}

const MAX_NOTIFICATIONS = 50;
let notificationCounter = 0;

function createId(): string {
  notificationCounter += 1;
  return 'notif-' + Date.now() + '-' + notificationCounter;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,

  addNotification: (notification) => {
    // En backend mode, las notificaciones las crea el backend via notify().
    // No-op silencioso: toastStore puede seguir llamando sin efecto.
    if (USE_BACKEND) {
      return '';
    }

    const id = createId();
    const newNotification: AppNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(
        0,
        MAX_NOTIFICATIONS
      ),
    }));
    return id;
  },

  markAsRead: (id) => {
    if (!USE_BACKEND) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
      return;
    }

    // Optimistic local + async fire-and-forget con rollback
    const backup = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
    void markNotificationReadRequest(id).catch(() => {
      set({ notifications: backup, error: 'No se pudo marcar como leida' });
    });
  },

  markAllAsRead: () => {
    if (!USE_BACKEND) {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
      return;
    }

    const backup = get().notifications;
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    void markAllNotificationsReadRequest().catch(() => {
      set({
        notifications: backup,
        error: 'No se pudieron marcar todas como leidas',
      });
    });
  },

  removeNotification: (id) => {
    if (!USE_BACKEND) {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
      return;
    }

    const backup = get().notifications;
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
    void deleteNotificationRequest(id).catch(() => {
      set({ notifications: backup, error: 'No se pudo eliminar la notificacion' });
    });
  },

  clearAll: () => {
    if (!USE_BACKEND) {
      set({ notifications: [] });
      return;
    }

    const backup = get().notifications;
    set({ notifications: [] });
    void clearAllNotificationsRequest().catch(() => {
      set({
        notifications: backup,
        error: 'No se pudieron limpiar las notificaciones',
      });
    });
  },

  // Local-only: no hay endpoint DELETE /api/notifications?category=X.
  // Deuda documentada: si se necesita en el futuro, se agrega al backend.
  clearByCategory: (category) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.category !== category),
    })),

  fetchNotifications: async () => {
    if (!USE_BACKEND) return;
    set({ isLoading: true, error: null });
    try {
      const { items } = await listNotificationsRequest({ pageSize: 100 });
      set({ notifications: items, isLoading: false });
    } catch {
      set({
        error: 'No se pudieron cargar las notificaciones desde el servidor',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

/** Selector: cuenta de notificaciones no leidas. */
export const selectUnreadCount = (state: NotificationsStore): number =>
  state.notifications.filter((n) => !n.read).length;

/** Selector: cuenta total. */
export const selectTotalCount = (state: NotificationsStore): number =>
  state.notifications.length;

/** Selector: cuenta por categoria. */
export const selectCountByCategory =
  (category: NotificationCategory) =>
  (state: NotificationsStore): number =>
    state.notifications.filter((n) => n.category === category).length;

/** Hook con las acciones memoizadas. */
export function useNotificationsActions() {
  return useNotificationsStore(
    useShallow((s) => ({
      addNotification: s.addNotification,
      markAsRead: s.markAsRead,
      markAllAsRead: s.markAllAsRead,
      removeNotification: s.removeNotification,
      clearAll: s.clearAll,
      clearByCategory: s.clearByCategory,
    }))
  );
}