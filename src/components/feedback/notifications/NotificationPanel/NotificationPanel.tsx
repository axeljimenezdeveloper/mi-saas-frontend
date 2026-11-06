import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  X,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  ArrowRight,
  Package,
  Receipt,
  Shield,
  Settings2,
} from 'lucide-react';
import {
  useNotificationsStore,
  useNotificationsActions,
  selectUnreadCount,
} from '../../../../stores';
import type {
  AppNotification,
  NotificationVariant,
  NotificationCategory,
} from '../../../../stores/notificationsStore';
import styles from './NotificationPanel.module.css';

const VARIANT_ICONS: Record<NotificationVariant, React.ReactNode> = {
  success: <CheckCircle2 size={16} />,
  error: <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

const CATEGORY_ICONS: Record<NotificationCategory, React.ReactNode> = {
  system: <Settings2 size={12} />,
  inventory: <Package size={12} />,
  billing: <Receipt size={12} />,
  auth: <Shield size={12} />,
};

const MAX_VISIBLE = 5;

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Ahora';
  if (min < 60) return 'Hace ' + min + ' min';
  const hours = Math.floor(min / 60);
  if (hours < 24) return 'Hace ' + hours + 'h';
  const days = Math.floor(hours / 24);
  return 'Hace ' + days + 'd';
}

export function NotificationPanel() {
  const navigate = useNavigate();
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = useNotificationsStore(selectUnreadCount);
  const { markAsRead, markAllAsRead, removeNotification, clearAll } =
    useNotificationsActions();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);
  const hasMore = notifications.length > MAX_VISIBLE;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleGoToNotifications = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.actionUrl) {
      setIsOpen(false);
      navigate(n.actionUrl);
    }
  };

  const ariaLabel =
    unreadCount > 0
      ? 'Notificaciones (' + unreadCount + ' sin leer)'
      : 'Notificaciones';

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.bellButton}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Notificaciones">
          <header className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Notificaciones</h3>
              {unreadCount > 0 && (
                <p className={styles.panelSubtitle}>
                  {unreadCount} sin leer
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                className={styles.headerAction}
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                aria-label="Marcar todas como leidas"
              >
                <CheckCheck size={14} />
              </button>
            )}
          </header>

          <div className={styles.panelBody}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <Inbox size={32} />
                <p className={styles.emptyTitle}>Sin notificaciones</p>
                <p className={styles.emptyText}>
                  Aqui veras las acciones que realices en el sistema
                </p>
              </div>
            ) : (
              <ul className={styles.list}>
                {visibleNotifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkAsRead={handleNotificationClick}
                    onRemove={removeNotification}
                  />
                ))}
              </ul>
            )}
          </div>

          {notifications.length > 0 && (
            <footer className={styles.panelFooter}>
              <button
                type="button"
                className={styles.viewAllButton}
                onClick={handleGoToNotifications}
              >
                {hasMore ? (
                  <>
                    Ver todas ({notifications.length})
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    Ir al historial
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearAll}
              >
                Limpiar
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
}: {
  notification: AppNotification;
  onMarkAsRead: (n: AppNotification) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li
      className={[
        styles.item,
        !notification.read && styles.itemUnread,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className={styles.itemContent}
        onClick={() => onMarkAsRead(notification)}
      >
        <span
          className={[
            styles.itemIcon,
            styles[notification.variant],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {VARIANT_ICONS[notification.variant]}
        </span>
        <span className={styles.itemText}>
          <span className={styles.itemTitle}>{notification.title}</span>
          {notification.description && (
            <span className={styles.itemDescription}>
              {notification.description}
            </span>
          )}
          <span className={styles.itemMeta}>
            <span className={styles.itemCategory}>
              {CATEGORY_ICONS[notification.category]}
            </span>
            <span className={styles.itemTime}>
              {timeAgo(notification.timestamp)}
            </span>
          </span>
        </span>
        {!notification.read && (
          <span className={styles.unreadDot} aria-label="Sin leer" />
        )}
      </button>
      <button
        type="button"
        className={styles.itemRemove}
        onClick={() => onRemove(notification.id)}
        aria-label={'Eliminar notificacion: ' + notification.title}
      >
        <X size={14} />
      </button>
    </li>
  );
}
