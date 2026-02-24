import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos')
    .optional(),
  email: z.string().email('Email inválido'),
})

export const addressSchema = z.object({
  name: z.string().min(3, 'Nombre completo es requerido'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos'),
  address: z.string().min(10, 'Dirección completa requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  department: z.string().min(2, 'Departamento requerido'),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type AddressFormData = z.infer<typeof addressSchema>
