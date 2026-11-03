import styles from './Badge.module.css';

export interface BadgeProps {
  /** Contenido del badge. */
  children: React.ReactNode;
  /** Variante semantica del badge. */
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Tamaño del badge. */
  size?: 'sm' | 'md' | 'lg';
  /** Muestra un punto de color a la izquierda (util para estados). */
  withDot?: boolean;
  /** Icono opcional a la izquierda (lucide-react o cualquier nodo). */
  icon?: React.ReactNode;
  /** Clase adicional para casos especiales. */
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  withDot = false,
  icon,
  className,
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {withDot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <span className={styles.label}>{children}</span>
    </span>
  );
}
