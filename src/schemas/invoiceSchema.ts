import { z } from 'zod';

// productId acepta number (mock) o string (cuid del backend). Se alinea con
// Product.id: number | string del productsStore.
export const lineItemSchema = z.object({
  productId: z.union([
    z.number(),
    z.string().min(1, { error: 'El productId es obligatorio' }),
  ]),
  productName: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export type LineItemData = z.infer<typeof lineItemSchema>;

export const invoiceSchema = z.object({
  client: z
    .string()
    .trim()
    .min(1, { error: 'El nombre del cliente es obligatorio' })
    .min(3, { error: 'El nombre debe tener al menos 3 caracteres' })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/, {
      error: 'El nombre solo puede contener letras y espacios',
    }),
  items: z.array(lineItemSchema).min(1, {
    error: 'Agrega al menos un producto a la factura',
  }),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;