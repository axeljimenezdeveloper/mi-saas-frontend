import {
  useCompanyStore,
  useProductsStore,
  useInvoicesStore,
} from '../../stores';
import type { Product } from '../../stores/productsStore';
import type { Invoice } from '../../stores/invoicesStore';
import type {
  CompanyData,
  CompanyPreferences,
} from '../../stores/companyStore';

export const DEMO_COMPANY: CompanyData = {
  name: 'Bodega El Sol, C.A.',
  rif: 'J-31245678-9',
  address: 'Av. Bolivar, Local 5, Porlamar, Nueva Esparta',
};

export const DEMO_PREFERENCES: CompanyPreferences = {
  currency: 'VES',
  defaultIva: '16',
  businessType: 'retail',
};

export const DEMO_PRODUCTS: Product[] = [
  { id: 1, name: 'Camisa azul talla M', sku: 'CAM-AZ-M-001', category: 'Ropa y accesorios', price: 25.0, stock: 42, status: 'in-stock', images: [] },
  { id: 2, name: 'Pantalon negro talla 32', sku: 'PAN-NE-32-002', category: 'Ropa y accesorios', price: 40.0, stock: 8, status: 'low-stock', images: [] },
  { id: 3, name: 'Zapatos deportivos', sku: 'ZAP-DEP-003', category: 'Otros', price: 60.0, stock: 0, status: 'out-of-stock', images: [] },
  { id: 4, name: 'Gorra bordada', sku: 'GOR-BOR-004', category: 'Otros', price: 15.0, stock: 120, status: 'in-stock', images: [] },
  { id: 5, name: 'Bufanda de lana', sku: 'BUF-LAN-005', category: 'Ropa y accesorios', price: 18.0, stock: 5, status: 'low-stock', images: [] },
  { id: 6, name: 'Chaqueta de cuero', sku: 'CHA-CUE-006', category: 'Ropa y accesorios', price: 95.0, stock: 15, status: 'in-stock', images: [] },
];

export const DEMO_INVOICES: Invoice[] = [
  { id: 1, number: 'FAC-2026-0001', client: 'Carlos Rodriguez', date: '2026-11-01', total: 1450.0, status: 'paid', items: [] },
  { id: 2, number: 'FAC-2026-0002', client: 'Maria Gonzalez', date: '2026-11-02', total: 840.5, status: 'pending', items: [] },
  { id: 3, number: 'FAC-2026-0003', client: 'Pedro Martinez', date: '2026-11-03', total: 3200.0, status: 'paid', items: [] },
  { id: 4, number: 'FAC-2026-0004', client: 'Ana Lopez', date: '2026-11-04', total: 450.0, status: 'overdue', items: [] },
  { id: 5, number: 'FAC-2026-0005', client: 'Luis Hernandez', date: '2026-11-05', total: 1890.75, status: 'pending', items: [] },
];

/**
 * Carga todos los datos de ejemplo y marca el onboarding como completo.
 * Los stores con persist sobreviven a la recarga del navegador.
 */
export function seedDemoData(): void {
  useCompanyStore.setState({
    company: DEMO_COMPANY,
    preferences: DEMO_PREFERENCES,
    isConfigured: true,
  });

  useProductsStore.setState({ products: DEMO_PRODUCTS });
  useInvoicesStore.setState({ invoices: DEMO_INVOICES });
}

/**
 * Limpia todos los datos de negocio (productos, facturas, empresa).
 * El usuario vuelve al estado de "recien registrado".
 */
export function clearAllData(): void {
  useProductsStore.setState({ products: [] });
  useInvoicesStore.setState({ invoices: [] });
  useCompanyStore.getState().reset();
}
