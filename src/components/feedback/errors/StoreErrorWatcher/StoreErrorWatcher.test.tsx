import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import {
  useProductsStore,
  useInvoicesStore,
  useCompanyStore,
  useNotificationsStore,
  useToastStore,
} from '../../../../stores';
import { StoreErrorWatcher } from './StoreErrorWatcher';

describe('StoreErrorWatcher', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    useNotificationsStore.setState({ notifications: [], error: null });
    useProductsStore.setState({ error: null });
    useInvoicesStore.setState({ error: null });
    useCompanyStore.setState({ error: null });
  });

  it('does not fire toasts when there are no errors', () => {
    render(<StoreErrorWatcher />);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('fires inventory toast and clears products error', async () => {
    useProductsStore.setState({ error: 'fallo de red' });
    render(<StoreErrorWatcher />);
    await waitFor(() => {
      expect(useToastStore.getState().toasts).toHaveLength(1);
    });
    expect(useToastStore.getState().toasts[0].title).toBe('Error de inventario');
    expect(useProductsStore.getState().error).toBeNull();
  });

  it('fires separate toasts for products and invoices errors', async () => {
    useProductsStore.setState({ error: 'err inventario' });
    useInvoicesStore.setState({ error: 'err facturacion' });
    render(<StoreErrorWatcher />);
    await waitFor(() => {
      expect(useToastStore.getState().toasts).toHaveLength(2);
    });
    expect(useProductsStore.getState().error).toBeNull();
    expect(useInvoicesStore.getState().error).toBeNull();
  });

  it('fires toasts for company and notifications errors', async () => {
    useCompanyStore.setState({ error: 'err empresa' });
    useNotificationsStore.setState({ error: 'err notifs' });
    render(<StoreErrorWatcher />);
    await waitFor(() => {
      expect(useToastStore.getState().toasts).toHaveLength(2);
    });
    expect(useCompanyStore.getState().error).toBeNull();
    expect(useNotificationsStore.getState().error).toBeNull();
  });
});