// src/features/demo/sampleProducts.ts
// Seeds de 16 productos para la demo del profesor.
// Cubren todos los estados visuales de la UI:
//   - 7 "En stock"   (verde, stock > 10)
//   - 5 "Stock bajo" (amarillo, 0 < stock <= 10)
//   - 2 "Agotado"    (rojo, stock === 0)
//   - 2 servicios    (sin stock, type: service)
//
// Imagenes: data URLs generadas localmente (SVG inline).
//   - No dependen de red externa (funciona offline)
//   - Deterministicas: mismo nombre + categoria -> misma imagen
//   - Color por categoria (paleta Apple del design system)
//
// Nota: los 2 "service" se crean como "physical" con stock 0 en el backend
// porque el adapter api/inventory.ts hardcodea type:'physical' (el Product
// del frontend no tiene campo type). Funcionalmente equivalente para el MVP.

import type { Product } from '../../stores/productsStore';
import type { CompanyCurrency } from '../../stores/companyStore';

/**
 * Tasa referencial VES/USD para mostrar precios realistas cuando la empresa
 * esta configurada en bolivares. No es una tasa oficial, es solo para la demo.
 */
const VES_PER_USD = 40;

/**
 * Color de fondo por categoria. Usa la paleta Apple del design system.
 * El texto del SVG es blanco puro para maximo contraste.
 */
const CATEGORY_COLORS: Record<string, string> = {
  'Electrónica': '#0A84FF',
  'Ropa y accesorios': '#FF9F0A',
  'Alimentos y bebidas': '#30D158',
  'Hogar': '#BF5AF2',
  'Belleza y cuidado personal': '#FF375F',
  'Otros': '#64D2FF',
};

const FALLBACK_COLOR = '#6E6E73';

interface SampleProductSeed {
  name: string;
  category: string; // label en espanol que mapea api/inventory.ts
  priceUsd: number;
  stock: number;
}

const SAMPLE_PRODUCT_SEEDS: SampleProductSeed[] = [
  // Electronica (4)
  { name: 'Laptop Pro 14"', category: 'Electrónica', priceUsd: 899, stock: 42 },
  { name: 'Audifonos Bluetooth', category: 'Electrónica', priceUsd: 89, stock: 120 },
  { name: 'Smartwatch Deportivo', category: 'Electrónica', priceUsd: 199, stock: 8 },
  { name: 'Camara Mirrorless', category: 'Electrónica', priceUsd: 650, stock: 0 },

  // Ropa y accesorios (3)
  { name: 'Camisa Casual talla M', category: 'Ropa y accesorios', priceUsd: 35, stock: 5 },
  { name: 'Zapatillas Running', category: 'Ropa y accesorios', priceUsd: 79, stock: 45 },
  { name: 'Chaqueta de Cuero', category: 'Ropa y accesorios', priceUsd: 249, stock: 15 },

  // Alimentos y bebidas (3)
  { name: 'Cafe en Granos 1kg', category: 'Alimentos y bebidas', priceUsd: 24, stock: 3 },
  { name: 'Chocolate Premium 500g', category: 'Alimentos y bebidas', priceUsd: 12, stock: 80 },
  { name: 'Vino Tinto Reserva', category: 'Alimentos y bebidas', priceUsd: 45, stock: 0 },

  // Hogar (2)
  { name: 'Lampara de Escritorio', category: 'Hogar', priceUsd: 65, stock: 22 },
  { name: 'Juego de Sabanas Queen', category: 'Hogar', priceUsd: 55, stock: 7 },

  // Belleza y cuidado personal (2)
  { name: 'Crema Facial Hidratante', category: 'Belleza y cuidado personal', priceUsd: 28, stock: 60 },
  { name: 'Perfume Floral 50ml', category: 'Belleza y cuidado personal', priceUsd: 95, stock: 18 },

  // Servicios (2)
  // Nota: el backend los recibe como type:'physical' con stock 0.
  { name: 'Asesoria Contable', category: 'Otros', priceUsd: 150, stock: 0 },
  { name: 'Soporte Tecnico Remoto', category: 'Otros', priceUsd: 80, stock: 0 },
];

/**
 * Extrae hasta 2 iniciales del nombre. Misma logica que Avatar.tsx.
 * "Laptop Pro 14"" -> "LP"
 * "Cafe en Granos 1kg" -> "CG"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Genera una imagen SVG inline como data URL. Fondo del color de la
 * categoria + iniciales del producto al centro. No depende de red externa.
 */
function generateProductSvg(name: string, category: string): string {
  const bg = CATEGORY_COLORS[category] ?? FALLBACK_COLOR;
  const initials = getInitials(name);
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">' +
    '<rect width="400" height="400" fill="' + bg + '"/>' +
    '<text x="50%" y="50%" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif" font-size="120" font-weight="600" fill="#ffffff" text-anchor="middle" dominant-baseline="central">' + initials + '</text>' +
    '</svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Genera 16 productos listos para `addProduct()`.
 * Los SKUs son unicos por invocacion (timestamp) para evitar colisiones
 * si el usuario pulsa el boton mas de una vez.
 */
export function generateSampleProducts(
  currency: CompanyCurrency,
): Array<Omit<Product, 'id' | 'status'>> {
  const timestamp = Date.now();

  return SAMPLE_PRODUCT_SEEDS.map((seed, index) => {
    const price =
      currency === 'VES'
        ? Math.round(seed.priceUsd * VES_PER_USD)
        : seed.priceUsd;

    return {
      name: seed.name,
      sku: `SMPL-${timestamp}-${String(index + 1).padStart(2, '0')}`,
      category: seed.category,
      price,
      stock: seed.stock,
      images: [generateProductSvg(seed.name, seed.category)],
    };
  });
}