import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './ToastProvider';

/**
 * Hook para disparar toasts desde cualquier componente.
 * Debe usarse dentro de un <ToastProvider>.
 *
 * Ejemplo:
 *   const toast = useToast();
 *   toast.success('Producto guardado');
 *   toast.error('No se pudo guardar', 'Revisa los campos');
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}
