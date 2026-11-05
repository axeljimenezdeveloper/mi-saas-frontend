import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import { useToastStore } from '../../../../stores/toastStore';
import styles from './ToastViewport.module.css';

/**
 * Renderiza la cola de toasts en un portal al document.body.
 * Se monta una vez en main.tsx como hermano de <App />.
 */
export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  const container = (
    <div className={styles.toastContainer} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={dismiss} />
      ))}
    </div>
  );

  if (typeof document === 'undefined') {
    return container;
  }

  return createPortal(container, document.body);
}

