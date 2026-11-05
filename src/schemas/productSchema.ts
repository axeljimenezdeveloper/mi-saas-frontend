import { z } from 'zod';

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: 'El nombre del producto es obligatorio' })
      .min(3, { error: 'Debe tener al menos 3 caracteres' }),
    sku: z.string().optional(),
    category: z.enum(
      ['electronics', 'clothing', 'food', 'home', 'beauty', 'other'],
      { error: 'Debes seleccionar una categoria' }
    ),
    type: z.enum(['physical', 'digital', 'service']),
    price: z
      .number({ error: 'El precio unitario es obligatorio' })
      .positive({ error: 'El precio debe ser mayor a cero' }),
    stock: z.string(),
    description: z.string().optional(),
    images: z.array(z.string()).default([]),
    active: z.boolean(),
    taxable: z.boolean(),
    featured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'service') return;

    if (!data.stock || data.stock.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        message: 'El stock inicial es obligatorio',
        path: ['stock'],
      });
      return;
    }

    const n = Number(data.stock);
    if (!Number.isFinite(n) || n < 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'El stock no puede ser negativo',
        path: ['stock'],
      });
    }
  });

export type ProductFormData = z.infer<typeof productSchema>;
