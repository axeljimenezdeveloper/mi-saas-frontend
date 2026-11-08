// src/stores/invoicesStore.ts
// Solo cambian los tipos (id y productId aceptan number | string).
// La logica es identica; en 7.C se migrara el CRUD a la API.

import { create } from 'zustand';

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
  addInvoice: (data: {
    client: string;
    items: InvoiceLine[];
    total: number;
  }) => Invoice;
  removeInvoice: (id: number | string) => void;
  updateStatus: (id: number | string, status: InvoiceStatus) => void;
  clearAll: () => void;
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

export const useInvoicesStore = create<InvoicesStore>((set) => ({
  invoices: [],

  addInvoice: ({ client, items, total }) => {
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
  },

  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    })),

  updateStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, status } : i,
      ),
    })),

  clearAll: () => set({ invoices: [] }),
}));