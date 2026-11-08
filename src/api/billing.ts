// src/api/billing.ts
// Capa API para /api/invoices. Adapter entre el contrato HTTP del backend y
// los tipos del frontend (Invoice, InvoiceLine, InvoiceStatus).
//
// Mapeos:
//   - status: PENDING|PAID|OVERDUE (backend) <-> pending|paid|overdue (frontend)
//   - date: ISO completo -> YYYY-MM-DD
//   - productId: cuid string -> number | string (frontend)
//   - productName: se resuelve con lookup en products[] (backend no lo guarda)

import { axiosClient } from './axiosClient';
import type { Invoice, InvoiceStatus } from '../stores/invoicesStore';
import type { Product } from '../stores/productsStore';

interface BackendInvoiceItem {
  id: string;
  productId: string;
  price: number | string;
  quantity: number;
  subtotal: number;
}

interface BackendInvoice {
  id: string;
  number: string;
  client: string;
  date: string;
  total: number | string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  pdfUrl: string | null;
  companyId: string;
  items: BackendInvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  error: null;
}

const BACKEND_TO_FRONTEND_STATUS: Record<string, InvoiceStatus> = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
};

const FRONTEND_TO_BACKEND_STATUS: Record<InvoiceStatus, string> = {
  pending: 'PENDING',
  paid: 'PAID',
  overdue: 'OVERDUE',
};

function toNumber(v: number | string): number {
  return typeof v === 'number' ? v : Number(v);
}

function toFrontendInvoice(inv: BackendInvoice, products: Product[]): Invoice {
  return {
    id: inv.id,
    number: inv.number,
    client: inv.client,
    date: inv.date.split('T')[0],
    total: toNumber(inv.total),
    status: BACKEND_TO_FRONTEND_STATUS[inv.status] ?? 'pending',
    items: inv.items.map((it) => {
      const prod = products.find((p) => String(p.id) === String(it.productId));
      return {
        productId: it.productId,
        productName: prod?.name ?? `[Producto ${it.productId}]`,
        price: toNumber(it.price),
        quantity: it.quantity,
      };
    }),
    pdfUrl: inv.pdfUrl ?? undefined,
  };
}

export async function listInvoicesRequest(products: Product[]): Promise<Invoice[]> {
  const res = await axiosClient.get<ApiResponse<PaginatedResponse<BackendInvoice>>>(
    '/api/invoices?page=1&pageSize=100',
  );
  return res.data.data.items.map((inv) => toFrontendInvoice(inv, products));
}

export async function createInvoiceRequest(
  data: { client: string; items: Array<{ productId: number | string; productName: string; price: number; quantity: number }>; total: number },
  products: Product[],
): Promise<Invoice> {
  const body = {
    client: data.client,
    items: data.items.map((i) => ({
      productId: String(i.productId),
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
    })),
  };
  const res = await axiosClient.post<ApiResponse<BackendInvoice>>('/api/invoices', body);
  return toFrontendInvoice(res.data.data, products);
}

export async function updateInvoiceStatusRequest(
  id: string | number,
  status: InvoiceStatus,
  products: Product[],
): Promise<Invoice> {
  const res = await axiosClient.patch<ApiResponse<BackendInvoice>>(
    `/api/invoices/${id}/status`,
    { status: FRONTEND_TO_BACKEND_STATUS[status] },
  );
  return toFrontendInvoice(res.data.data, products);
}

export async function deleteInvoiceRequest(id: string | number): Promise<void> {
  await axiosClient.delete(`/api/invoices/${id}`);
}

export async function downloadInvoicePdfRequest(id: string | number): Promise<Blob> {
  const res = await axiosClient.get(`/api/invoices/${id}/pdf`, {
    responseType: 'blob',
  });
  return res.data as Blob;
}