import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../../actions/Button';
import styles from './Modal.module.css';

export interface ModalProps {
  /** Controla la visibilidad. */
  isOpen: boolean;
  /** Callback al cerrar (Escape, click en overlay o boton X). */
  onClose: () => void;
  /** Titulo del modal. */
  title?: string;
  /** Contenido del modal. */
  children: React.ReactNode;
  /** Slot de acciones en el footer (usualmente botones). */
  footer?: React.ReactNode;
  /** Tamano del modal. */
  size?: 'sm' | 'md' | 'lg';
  /** Si es true, el modal no se cierra al hacer click fuera o presionar Escape. */
  preventClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  preventClose = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Bloquea el scroll del body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Foco inicial en el dialogo
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, preventClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !preventClose) onClose();
  };

  const modal = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={[styles.dialog, styles[size]].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        {title && (
          <header className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            {!preventClose && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Cerrar modal"
                onClick={onClose}
              >
                <X size={16} />
              </Button>
            )}
          </header>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
