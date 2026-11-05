import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from '../Modal';
import { Button } from '../../actions/Button';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogProps {
  /** Controla la visibilidad. */
  isOpen: boolean;
  /** Callback al cerrar (cancelar o click fuera). */
  onClose: () => void;
  /** Callback al confirmar. */
  onConfirm: () => void;
  /** Titulo del dialogo. */
  title: string;
  /** Mensaje o descripcion. */
  message: string | React.ReactNode;
  /** Texto del boton confirmar. */
  confirmLabel?: string;
  /** Texto del boton cancelar. */
  cancelLabel?: string;
  /** Variante visual: danger (rojo) o primary (azul). */
  variant?: 'danger' | 'primary';
  /** Si es true, el boton confirmar muestra spinner y se deshabilita. */
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const Icon = variant === 'danger' ? AlertTriangle : Info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" preventClose={isLoading}>
      <div className={styles.content}>
        <div className={[styles.iconWrapper, styles[variant]].join(' ')}>
          <Icon size={24} />
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.message}>{message}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
