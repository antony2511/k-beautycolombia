import { z } from 'zod';

// Validation schema for products
export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  compareAtPrice: z.number().positive().optional(),
  image: z.string().url('Debe ser una URL válida'),
  images: z.array(z.string().url()).max(4, 'Máximo 4 imágenes adicionales').optional(),
  badge: z.string().optional(),
  badgeType: z.enum(['bestseller', 'new', 'discount']).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  howToUse: z.array(z.string()).optional(),
  skinType: z.array(z.string()).optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

// Validation schema for product updates
export const productUpdateSchema = productSchema.partial();

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

// Validation schema for order status updates
export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().default(false),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// Validation schema for user updates
export const userUpdateSchema = z.object({
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

// Validation schema for date range filters
export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// Validation schema for pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
