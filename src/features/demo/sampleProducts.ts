// src/features/demo/sampleProducts.ts
// Seeds de 16 productos para la demo del profesor.
// Cubren todos los estados visuales de la UI:
//   - 7 "En stock"   (verde, stock > 10)
//   - 5 "Stock bajo" (amarillo, 0 < stock <= 10)
//   - 2 "Agotado"    (rojo, stock === 0)
//   - 2 servicios    (sin stock, type: service)
//
// Imagenes: https://loremflickr.com/400/400/{keyword}?lock=N
//   - Devuelve fotos reales de Flickr por keyword
//   - Deterministas gracias a ?lock=N (misma imagen siempre)
//   - Sin API key, sin rate limit, sin descargas locales
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

interface SampleProductSeed {
  name: string;
  category: string; // label en espanol que mapea api/inventory.ts
  priceUsd: number;
  stock: number;
  imageKeyword: string;
  lock: number;
}

const SAMPLE_PRODUCT_SEEDS: SampleProductSeed[] = [
  // ── Electronica (4) ─────────────────────────────────────
  { name: 'Laptop Pro 14"', category: 'Electrónica', priceUsd: 899, stock: 42, imageKeyword: 'laptop', lock: 1 },
  { name: 'Audifonos Bluetooth', category: 'Electrónica', priceUsd: 89, stock: 120, imageKeyword: 'headphones', lock: 2 },
  { name: 'Smartwatch Deportivo', category: 'Electrónica', priceUsd: 199, stock: 8, imageKeyword: 'smartwatch', lock: 3 },
  { name: 'Camara Mirrorless', category: 'Electrónica', priceUsd: 650, stock: 0, imageKeyword: 'camera', lock: 4 },

  // ── Ropa y accesorios (3) ───────────────────────────────
  { name: 'Camisa Casual talla M', category: 'Ropa y accesorios', priceUsd: 35, stock: 5, imageKeyword: 'shirt', lock: 5 },
  { name: 'Zapatillas Running', category: 'Ropa y accesorios', priceUsd: 79, stock: 45, imageKeyword: 'sneakers', lock: 6 },
  { name: 'Chaqueta de Cuero', category: 'Ropa y accesorios', priceUsd: 249, stock: 15, imageKeyword: 'leather-jacket', lock: 7 },

  // ── Alimentos y bebidas (3) ─────────────────────────────
  { name: 'Cafe en Granos 1kg', category: 'Alimentos y bebidas', priceUsd: 24, stock: 3, imageKeyword: 'coffee-beans', lock: 8 },
  { name: 'Chocolate Premium 500g', category: 'Alimentos y bebidas', priceUsd: 12, stock: 80, imageKeyword: 'chocolate', lock: 9 },
  { name: 'Vino Tinto Reserva', category: 'Alimentos y bebidas', priceUsd: 45, stock: 0, imageKeyword: 'wine', lock: 10 },

  // ── Hogar (2) ───────────────────────────────────────────
  { name: 'Lampara de Escritorio', category: 'Hogar', priceUsd: 65, stock: 22, imageKeyword: 'desk-lamp', lock: 11 },
  { name: 'Juego de Sabanas Queen', category: 'Hogar', priceUsd: 55, stock: 7, imageKeyword: 'bedsheets', lock: 12 },

  // ── Belleza y cuidado personal (2) ──────────────────────
  { name: 'Crema Facial Hidratante', category: 'Belleza y cuidado personal', priceUsd: 28, stock: 60, imageKeyword: 'face-cream', lock: 13 },
  { name: 'Perfume Floral 50ml', category: 'Belleza y cuidado personal', priceUsd: 95, stock: 18, imageKeyword: 'perfume', lock: 14 },

  // ── Servicios (2) ───────────────────────────────────────
  // Nota: el backend los recibe como type:'physical' con stock 0.
  { name: 'Asesoria Contable', category: 'Otros', priceUsd: 150, stock: 0, imageKeyword: 'accounting', lock: 15 },
  { name: 'Soporte Tecnico Remoto', category: 'Otros', priceUsd: 80, stock: 0, imageKeyword: 'tech-support', lock: 16 },
];

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
      images: [
        `https://loremflickr.com/400/400/${seed.imageKeyword}?lock=${seed.lock}`,
      ],
    };
  });
}