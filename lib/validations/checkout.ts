import { z } from 'zod';

export const checkoutSchema = z.object({
  // Información personal
  fullName: z.string().min(3, 'Nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos'),

  // Documento
  documentType: z.enum(['CC', 'CE', 'NIT', 'Pasaporte'], {
    required_error: 'Tipo de documento es requerido',
  }),
  documentNumber: z.string().min(5, 'Número de documento requerido'),

  // Dirección
  address: z.string().min(10, 'Dirección completa requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  department: z.string().min(2, 'Departamento requerido'),
  postalCode: z.string().optional(),

  // Opcional
  deliveryInstructions: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
