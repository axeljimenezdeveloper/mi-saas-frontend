import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Alert.module.css';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  /** Variante semantica del alert. */
  variant?: AlertVariant;
  /** Titulo opcional (en negrita, arriba del mensaje). */
  title?: string;
  /** Contenido principal del alert. */
  children: React.ReactNode;
  /** Si se pasa, muestra un boton X para cerrar el alert. */
  onClose?: () => void;
  /** Icono custom. Si no se pasa, se usa uno segun la variante. */
  icon?: React.ReactNode;
  /** Clase adicional. */
  className?: string;
}

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  icon,
  className,
}: AlertProps) {
  const classes = [styles.alert, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="alert">
      <span className={styles.iconWrapper} aria-hidden="true">
        {icon ?? DEFAULT_ICONS[variant]}
      </span>
      <div className={styles.content}>
        {title && <span className={styles.title}>{title}</span>}
        <span className={styles.message}>{children}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
