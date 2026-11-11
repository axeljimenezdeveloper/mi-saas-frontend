import { useEffect } from 'react';
import { useToast } from '../../alerts/Toast';
import {
  useProductsStore,
  useInvoicesStore,
  useCompanyStore,
  useNotificationsStore,
} from '../../../../stores';

export function StoreErrorWatcher() {
  const toast = useToast();
  const productsError = useProductsStore((s) => s.error);
  const invoicesError = useInvoicesStore((s) => s.error);
  const companyError = useCompanyStore((s) => s.error);
  const notificationsError = useNotificationsStore((s) => s.error);
  const clearProducts = useProductsStore((s) => s.clearError);
  const clearInvoices = useInvoicesStore((s) => s.clearError);
  const clearCompany = useCompanyStore((s) => s.clearError);
  const clearNotifications = useNotificationsStore((s) => s.clearError);

  useEffect(() => {
    if (productsError) {
      toast.error('Error de inventario', productsError, { category: 'inventory' });
      clearProducts();
    }
  }, [productsError, toast, clearProducts]);

  useEffect(() => {
    if (invoicesError) {
      toast.error('Error de facturacion', invoicesError, { category: 'billing' });
      clearInvoices();
    }
  }, [invoicesError, toast, clearInvoices]);

  useEffect(() => {
    if (companyError) {
      toast.error('Error de empresa', companyError, { category: 'system' });
      clearCompany();
    }
  }, [companyError, toast, clearCompany]);

  useEffect(() => {
    if (notificationsError) {
      toast.error('Error de notificaciones', notificationsError, { category: 'system' });
      clearNotifications();
    }
  }, [notificationsError, toast, clearNotifications]);

  return null;
}