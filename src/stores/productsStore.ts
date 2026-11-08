// src/stores/productsStore.ts
// Feature flag: USE_BACKEND=false -> mock puro. USE_BACKEND=true -> optimistic + async.

import { create } from 'zustand';
import { USE_BACKEND } from '../config/backend';
import {
  listProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from '../api/inventory';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: number | string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
  images: string[];
}

export interface ProductsStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Product;
  removeProduct: (id: number | string) => void;
  updateProduct: (id: number | string, data: Partial<Omit<Product, 'id'>>) => void;
  decrementStock: (id: number | string, quantity: number) => void;
  clearAll: () => void;
  fetchProducts: () => Promise<void>;
  clearError: () => void;
}

function computeStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= 10) return 'low-stock';
  return 'in-stock';
}

let productCounter = 0;

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  addProduct: (product) => {
    if (!USE_BACKEND) {
      productCounter += 1;
      const newProduct: Product = {
        ...product,
        id: Date.now() + productCounter,
        status: computeStatus(product.stock),
      };
      set((state) => ({ products: [...state.products, newProduct] }));
      return newProduct;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: Product = {
      ...product,
      id: tempId,
      status: computeStatus(product.stock),
    };
    set((state) => ({ products: [...state.products, optimistic] }));

    void createProductRequest(product)
      .then((real) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === tempId ? real : p)),
        }));
      })
      .catch(() => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== tempId),
          error: 'No se pudo crear el producto en el servidor',
        }));
      });

    return optimistic;
  },

  removeProduct: (id) => {
    if (!USE_BACKEND) {
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      return;
    }

    const backup = get().products.find((p) => p.id === id);
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));

    void deleteProductRequest(id).catch(() => {
      if (backup) {
        set((state) => ({
          products: [...state.products, backup],
          error: 'No se pudo eliminar el producto en el servidor',
        }));
      } else {
        set({ error: 'No se pudo eliminar el producto en el servidor' });
      }
    });
  },

  updateProduct: (id, data) => {
    if (!USE_BACKEND) {
      set((state) => ({
        products: state.products.map((p) => {
          if (p.id !== id) return p;
          const next = { ...p, ...data };
          return { ...next, status: computeStatus(next.stock) };
        }),
      }));
      return;
    }

    const backup = get().products.find((p) => p.id === id);
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...data };
        return { ...next, status: computeStatus(next.stock ?? p.stock) };
      }),
    }));

    void updateProductRequest(id, data)
      .then((real) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? real : p)),
        }));
      })
      .catch(() => {
        if (backup) {
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? backup : p)),
            error: 'No se pudo actualizar el producto en el servidor',
          }));
        }
      });
  },

  decrementStock: (id, quantity) => {
    if (USE_BACKEND) return;
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const newStock = Math.max(0, p.stock - quantity);
        return { ...p, stock: newStock, status: computeStatus(newStock) };
      }),
    }));
  },

  clearAll: () => set({ products: [] }),

  fetchProducts: async () => {
    if (!USE_BACKEND) return;
    set({ isLoading: true, error: null });
    try {
      const items = await listProductsRequest();
      set({ products: items, isLoading: false });
    } catch {
      set({
        error: 'No se pudo cargar el inventario desde el servidor',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));