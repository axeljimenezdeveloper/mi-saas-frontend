import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Package,
  Receipt,
  Shield,
  Settings2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../../../../components/common/actions/Button';
import { Select } from '../../../../components/common/inputs/Select';
import { Badge } from '../../../../components/common/data-display/Badge';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { ConfirmDialog } from '../../../../components/common/overlay/ConfirmDialog';
import {
  useNotificationsStore,
  useNotificationsActions,
} from '../../../../stores';
import type {
  AppNotification,
  NotificationVariant,
  NotificationCategory,
} from '../../../../stores/notificationsStore';
import styles from './Notifications.module.css';

type StatusFilter = 'all' | 'unread' | 'read';

const VARIANT_ICONS: Record<NotificationVariant, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: React.ReactNode }
> = {
  system: { label: 'Sistema', icon: <Settings2 size={14} /> },
  inventory: { label: 'Inventario', icon: <Package size={14} /> },
  billing: { label: 'Facturacion', icon: <Receipt size={14} /> },
  auth: { label: 'Cuenta', icon: <Shield size={14} /> },
};

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todas las categorias' },
  { value: 'system', label: 'Sistema' },
  { value: 'inventory', label: 'Inventario' },
  { value: 'billing', label: 'Facturacion' },
  { value: 'auth', label: 'Cuenta' },
];

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'No leidas' },
  { value: 'read', label: 'Leidas' },
];

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

export default function Notifications() {
  const navigate = useNavigate();
  const notifications = useNotificationsStore((s) => s.notifications);
  const { markAsRead, markAllAsRead, removeNotification, clearAll, clearByCategory } =
    useNotificationsActions();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [notificationToDelete, setNotificationToDelete] =
    useState<AppNotification | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      read: notifications.filter((n) => n.read).length,
    };
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !n.read) ||
        (statusFilter === 'read' && n.read);
      const matchesCategory =
        categoryFilter === 'all' || n.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [notifications, statusFilter, categoryFilter]);

  const handleNotificationClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.actionUrl) {
      navigate(n.actionUrl);
    }
  };

  const handleConfirmDelete = () => {
    if (!notificationToDelete) return;
    removeNotification(notificationToDelete.id);
    setNotificationToDelete(null);
  };

  const handleConfirmClearAll = () => {
    clearAll();
    setIsClearAllOpen(false);
  };

  const isFilteredEmpty = filtered.length === 0 && notifications.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <Bell size={22} />
              <h1 className={styles.title}>Notificaciones</h1>
            </div>
            <p className={styles.subtitle}>
              Historial completo de las acciones realizadas en el sistema
            </p>
          </div>
          {notifications.length > 0 && (
            <div className={styles.headerActions}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<CheckCheck size={14} />}
                onClick={markAllAsRead}
                disabled={counts.unread === 0}
              >
                Marcar todas
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 size={14} />}
                onClick={() => setIsClearAllOpen(true)}
              >
                Limpiar todo
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.value}
                className={[
                  styles.tab,
                  statusFilter === tab.value && styles.tabActive,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
                <span className={styles.tabCount}>{counts[tab.value]}</span>
              </button>
            ))}
          </div>

          <div className={styles.filterWrapper}>
            <Select
              options={CATEGORY_OPTIONS}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              leftIcon={<Filter size={14} />}
              size="sm"
            />
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.emptyWrapper}>
            <EmptyState
              title="Sin notificaciones"
              description="Cuando realices acciones en el sistema (crear productos, emitir facturas, etc.) apareceran aqui."
              icon={<Inbox size={32} />}
            />
          </div>
        ) : isFilteredEmpty ? (
          <div className={styles.emptyWrapper}>
            <EmptyState
              title="Sin resultados"
              description="No hay notificaciones que coincidan con los filtros seleccionados."
              icon={<Inbox size={32} />}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          </div>
        ) : (
          <ul className={styles.list}>
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onClick={() => handleNotificationClick(n)}
                onDelete={() => setNotificationToDelete(n)}
              />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={notificationToDelete !== null}
        onClose={() => setNotificationToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar notificacion"
        message={
          <>
            ¿Eliminar la notificacion <strong>"{notificationToDelete?.title}"</strong>?
          </>
        }
        confirmLabel="Si, eliminar"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={isClearAllOpen}
        onClose={() => setIsClearAllOpen(false)}
        onConfirm={handleConfirmClearAll}
        title="Limpiar todas las notificaciones"
        message={
          <>
            Se eliminaran <strong>{notifications.length}</strong> notificaciones
            del historial. Esta accion no se puede deshacer.
          </>
        }
        confirmLabel="Si, limpiar todo"
        variant="danger"
      />
    </div>
  );
}

function NotificationRow({
  notification,
  onClick,
  onDelete,
}: {
  notification: AppNotification;
  onClick: () => void;
  onDelete: () => void;
}) {
  const categoryMeta = CATEGORY_META[notification.category];

  return (
    <li
      className={[
        styles.row,
        !notification.read && styles.rowUnread,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button type="button" className={styles.rowContent} onClick={onClick}>
        <span
          className={[
            styles.rowIcon,
            styles[notification.variant],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {VARIANT_ICONS[notification.variant]}
        </span>
        <span className={styles.rowText}>
          <span className={styles.rowTitleRow}>
            <span className={styles.rowTitle}>{notification.title}</span>
            {!notification.read && (
              <span className={styles.unreadDot} aria-label="Sin leer" />
            )}
          </span>
          {notification.description && (
            <span className={styles.rowDescription}>
              {notification.description}
            </span>
          )}
          <span className={styles.rowMeta}>
            <Badge variant="neutral" size="sm">
              {categoryMeta.icon}
              {categoryMeta.label}
            </Badge>
            <span className={styles.rowTime}>
              {timeAgo(notification.timestamp)}
            </span>
            {notification.actionUrl && (
              <span className={styles.rowAction}>
                <ArrowRight size={12} />
                Ir
              </span>
            )}
          </span>
        </span>
      </button>
      <button
        type="button"
        className={styles.rowRemove}
        onClick={onDelete}
        aria-label={'Eliminar notificacion: ' + notification.title}
      >
        <X size={16} />
      </button>
    </li>
  );
}
