import { createContext, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Toast, type ToastData, type ToastVariant } from './Toast';
import styles from './ToastProvider.module.css';

export interface ToastContextValue {
  /** Dispara un toast. Retorna el id generado. */
  show: (toast: Omit<ToastData, 'id'>) => string;
  /** Atajos por variante. */
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  /** Cierra un toast por id. */
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

let toastCounter = 0;

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<ToastData, 'id'>): string => {
    toastCounter += 1;
    const id = `toast-${Date.now()}-${toastCounter}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const success = useCallback(
    (title: string, description?: string) =>
      show({ variant: 'success', title, description }),
    [show]
  );

  const error = useCallback(
    (title: string, description?: string) =>
      show({ variant: 'error', title, description }),
    [show]
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      show({ variant: 'warning', title, description }),
    [show]
  );

  const info = useCallback(
    (title: string, description?: string) =>
      show({ variant: 'info', title, description }),
    [show]
  );

  const value: ToastContextValue = {
    show,
    success,
    error,
    warning,
    info,
    dismiss,
  };

  const container = (
    <div className={styles.toastContainer} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={dismiss} />
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(container, document.body)
        : container}
    </ToastContext.Provider>
  );
}
