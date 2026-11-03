import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  /** Titulo principal del estado vacio. */
  title: string;
  /** Descripcion opcional debajo del titulo. */
  description?: string;
  /** Icono opcional. Por defecto se usa un icono de bandeja vacia. */
  icon?: React.ReactNode;
  /** Accion principal (boton, link, etc.). */
  action?: React.ReactNode;
  /** Tamano del empty state. */
  size?: 'sm' | 'md' | 'lg';
  /** Clase adicional. */
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const classes = [styles.emptyState, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon ?? <Inbox size={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} />}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
