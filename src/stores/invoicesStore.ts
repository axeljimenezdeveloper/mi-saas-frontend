// src/stores/invoicesStore.ts
// Feature flag: USE_BACKEND=false -> mock puro. USE_BACKEND=true -> optimistic + async.
// El adapter en api/billing.ts resuelve status/date/productId/productName.

import { create } from 'zustand';
import { USE_BACKEND } from '../config/backend';
import {
  listInvoicesRequest,
  createInvoiceRequest,
  updateInvoiceStatusRequest,
} from '../api/billing';
import { useProductsStore } from './productsStore';

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface InvoiceLine {
  productId: number | string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  id: number | string;
  number: string;
  client: string;
  date: string;
  total: number;
  status: InvoiceStatus;
  items: InvoiceLine[];
  pdfUrl?: string;
}

export interface InvoicesStore {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  addInvoice: (data: {
    client: string;
    items: InvoiceLine[];
    total: number;
  }) => Invoice;
  removeInvoice: (id: number | string) => void;
  updateStatus: (id: number | string, status: InvoiceStatus) => void;
  clearAll: () => void;
  fetchInvoices: () => Promise<void>;
  clearError: () => void;
}

let invoiceCounter = 0;

function generateInvoiceNumber(): string {
  invoiceCounter += 1;
  const year = new Date().getFullYear();
  const seq = String(invoiceCounter).padStart(4, '0');
  return `FAC-${year}-${seq}`;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const useInvoicesStore = create<InvoicesStore>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  addInvoice: ({ client, items, total }) => {
    // Mock: comportamiento original identico
    if (!USE_BACKEND) {
      const newInvoice: Invoice = {
        id: Date.now(),
        number: generateInvoiceNumber(),
        client,
        date: todayISO(),
        total,
        status: 'pending',
        items,
      };
      set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
      return newInvoice;
    }

    // Backend: optimistic
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: Invoice = {
      id: tempId,
      number: '...',
      client,
      date: todayISO(),
      total,
      status: 'pending',
      items,
    };
    set((state) => ({ invoices: [optimistic, ...state.invoices] }));

    const products = useProductsStore.getState().products;
    void createInvoiceRequest({ client, items, total }, products)
      .then((real) => {
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === tempId ? real : i)),
        }));
      })
      .catch(() => {
        set((state) => ({
          invoices: state.invoices.filter((i) => i.id !== tempId),
          error: 'No se pudo crear la factura en el servidor',
        }));
      });

    return optimistic;
  },

  removeInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    }));
  },

  updateStatus: (id, status) => {
    // Mock: comportamiento original
    if (!USE_BACKEND) {
      set((state) => ({
        invoices: state.invoices.map((i) =>
          i.id === id ? { ...i, status } : i,
        ),
      }));
      return;
    }

    // Backend: optimistic + rollback
    const backup = get().invoices.find((i) => i.id === id);
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, status } : i,
      ),
    }));

    const products = useProductsStore.getState().products;
    void updateInvoiceStatusRequest(id, status, products)
      .then((real) => {
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === id ? real : i)),
        }));
      })
      .catch(() => {
        if (backup) {
          set((state) => ({
            invoices: state.invoices.map((i) => (i.id === id ? backup : i)),
            error: 'No se pudo actualizar el estado en el servidor',
          }));
        }
      });
  },

  clearAll: () => set({ invoices: [] }),

  fetchInvoices: async () => {
    if (!USE_BACKEND) return;
    set({ isLoading: true, error: null });
    try {
      const products = useProductsStore.getState().products;
      const items = await listInvoicesRequest(products);
      set({ invoices: items, isLoading: false });
    } catch {
      set({
        error: 'No se pudieron cargar las facturas desde el servidor',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));