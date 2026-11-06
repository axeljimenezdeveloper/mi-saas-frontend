import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

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
  addNotification: (
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearByCategory: (category: NotificationCategory) => void;
}

const MAX_NOTIFICATIONS = 50;
let notificationCounter = 0;

function createId(): string {
  notificationCounter += 1;
  return 'notif-' + Date.now() + '-' + notificationCounter;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],

  addNotification: (notification) => {
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

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  clearByCategory: (category) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.category !== category),
    })),
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
