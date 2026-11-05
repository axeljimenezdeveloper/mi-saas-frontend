import { create } from 'zustand';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Product {
  id: number;
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
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Product;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, data: Partial<Omit<Product, 'id'>>) => void;
  clearAll: () => void;
}

function computeStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= 10) return 'low-stock';
  return 'in-stock';
}

let productCounter = 0;

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [],

  addProduct: (product) => {
    productCounter += 1;
    const newProduct: Product = {
      ...product,
      id: Date.now() + productCounter,
      status: computeStatus(product.stock),
    };
    set((state) => ({ products: [...state.products, newProduct] }));
    return newProduct;
  },

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...data };
        return {
          ...next,
          status: computeStatus(next.stock),
        };
      }),
    })),

  clearAll: () => set({ products: [] }),
}));
