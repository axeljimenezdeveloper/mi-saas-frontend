// src/api/inventory.ts
// Capa API para /api/products. Adapter entre ProductPublic (backend) y Product (frontend).

import { axiosClient } from './axiosClient';
import type { Product, StockStatus } from '../stores/productsStore';

interface BackendProduct {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  type: string;
  price: number | string;
  stock: number;
  description: string | null;
  images: string[];
  active: boolean;
  taxable: boolean;
  featured: boolean;
  companyId: string;
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

const BACKEND_TO_LABEL: Record<string, string> = {
  electronics: 'Electrónica',
  clothing: 'Ropa y accesorios',
  food: 'Alimentos y bebidas',
  home: 'Hogar',
  beauty: 'Belleza y cuidado personal',
  other: 'Otros',
};

const LABEL_TO_BACKEND: Record<string, string> = {
  'Electrónica': 'electronics',
  'Ropa y accesorios': 'clothing',
  'Alimentos y bebidas': 'food',
  'Hogar': 'home',
  'Belleza y cuidado personal': 'beauty',
  'Otros': 'other',
};

function toBackendCategory(labelOrValue: string): string {
  if (LABEL_TO_BACKEND[labelOrValue]) return LABEL_TO_BACKEND[labelOrValue];
  if (BACKEND_TO_LABEL[labelOrValue]) return labelOrValue;
  return 'other';
}

function toFrontendCategory(enumValue: string): string {
  return BACKEND_TO_LABEL[enumValue] ?? enumValue;
}

function computeStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= 10) return 'low-stock';
  return 'in-stock';
}

function toNumber(v: number | string): number {
  return typeof v === 'number' ? v : Number(v);
}

function toFrontendProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku ?? '',
    category: toFrontendCategory(p.category),
    price: toNumber(p.price),
    stock: p.stock,
    status: computeStatus(p.stock),
    images: p.images,
  };
}

function toBackendCreateBody(p: Omit<Product, 'id' | 'status'>): Record<string, unknown> {
  return {
    name: p.name,
    sku: p.sku,
    category: toBackendCategory(p.category),
    type: 'physical',
    price: p.price,
    stock: String(p.stock),
    description: '',
    images: p.images,
    active: true,
    taxable: true,
    featured: false,
  };
}

function toBackendUpdateBody(p: Partial<Omit<Product, 'id' | 'status'>>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (p.name !== undefined) body.name = p.name;
  if (p.sku !== undefined) body.sku = p.sku;
  if (p.category !== undefined) body.category = toBackendCategory(p.category);
  if (p.price !== undefined) body.price = p.price;
  if (p.stock !== undefined) body.stock = String(p.stock);
  if (p.images !== undefined) body.images = p.images;
  return body;
}

export async function listProductsRequest(): Promise<Product[]> {
  const res = await axiosClient.get<ApiResponse<PaginatedResponse<BackendProduct>>>(
    '/api/products?page=1&pageSize=100',
  );
  return res.data.data.items.map(toFrontendProduct);
}

export async function createProductRequest(
  p: Omit<Product, 'id' | 'status'>,
): Promise<Product> {
  const res = await axiosClient.post<ApiResponse<BackendProduct>>(
    '/api/products',
    toBackendCreateBody(p),
  );
  return toFrontendProduct(res.data.data);
}

export async function updateProductRequest(
  id: string | number,
  data: Partial<Omit<Product, 'id' | 'status'>>,
): Promise<Product> {
  const res = await axiosClient.put<ApiResponse<BackendProduct>>(
    `/api/products/${id}`,
    toBackendUpdateBody(data),
  );
  return toFrontendProduct(res.data.data);
}

export async function deleteProductRequest(id: string | number): Promise<void> {
  await axiosClient.delete(`/api/products/${id}`);
}