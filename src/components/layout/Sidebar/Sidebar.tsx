import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  /** Texto visible del item. */
  label: string;
  /** Icono (lucide-react). */
  icon: React.ReactNode;
  /** href del item (para navegacion). */
  href: string;
  /** Badge opcional a la derecha (ej. contador de notificaciones). */
  badge?: string | number;
}

export interface SidebarProps {
  /** Lista de items de navegacion. */
  items: SidebarItem[];
  /** href del item activo (para resaltarlo). */
  activeHref?: string;
  /** Callback al hacer click en un item. Si no se pasa, usa <a href>. */
  onNavigate?: (href: string) => void;
  /** Estado colapsado (solo iconos). */
  isCollapsed?: boolean;
  /** Callback para togglear el colapsado. */
  onToggleCollapse?: () => void;
  /** Slot en la parte inferior (ej. avatar + logout). */
  footer?: React.ReactNode;
  /** Clase adicional. */
  className?: string;
}

export function Sidebar({
  items,
  activeHref,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
  footer,
  className,
}: SidebarProps) {
  const classes = [styles.sidebar, isCollapsed && styles.collapsed, className]
    .filter(Boolean)
    .join(' ');

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: SidebarItem
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.href);
    }
  };

  return (
    <aside className={classes}>
      <div className={styles.top}>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.collapseButton}
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        <ul className={styles.list}>
          {items.map((item) => {
            const isActive =
              item.href === activeHref ||
              (activeHref?.startsWith(item.href + '/') ?? false);
            const itemClasses = [styles.item, isActive && styles.active]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={itemClasses}
                  onClick={(e) => handleItemClick(e, item)}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.iconWrapper} aria-hidden="true">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className={styles.label}>{item.label}</span>
                  )}
                  {!isCollapsed && item.badge !== undefined && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {footer && <div className={styles.footer}>{footer}</div>}
    </aside>
  );
}

