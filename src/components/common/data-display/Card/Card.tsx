import styles from './Card.module.css';

export interface CardProps {
  /** Contenido principal de la card. */
  children: React.ReactNode;
  /** Estilo visual de la card. */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Padding interno de la card. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Slot opcional en la parte superior (header). */
  header?: React.ReactNode;
  /** Slot opcional en la parte inferior (footer). */
  footer?: React.ReactNode;
  /** Si es true, la card ocupa el 100% del ancho. */
  fullWidth?: boolean;
  /** Clase adicional. */
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  fullWidth = false,
  className,
}: CardProps) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
