import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  /** Identificador unico del toast (generado por el provider). */
  id: string;
  /** Variante semantica. */
  variant: ToastVariant;
  /** Titulo corto del toast. */
  title: string;
  /** Descripcion opcional. */
  description?: string;
  /** Duracion en ms antes de auto-cerrar. Si es 0, no se auto-cierra. */
  duration?: number;
}

export interface ToastProps {
  /** Datos del toast. */
  toast: ToastData;
  /** Callback cuando el toast se cierra (manual o automatico). */
  onClose: (id: string) => void;
}

const DEFAULT_ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export function Toast({ toast, onClose }: ToastProps) {
  const { id, variant, title, description, duration = 4000 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const classes = [styles.toast, styles[variant]].join(' ');

  return (
    <div className={classes} role="status" aria-live="polite">
      <span className={styles.iconWrapper} aria-hidden="true">
        {DEFAULT_ICONS[variant]}
      </span>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => onClose(id)}
        aria-label="Cerrar notificacion"
      >
        <X size={16} />
      </button>
      {duration > 0 && (
        <div
          className={styles.progressBar}
          style={{ animationDuration: `${duration}ms` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
