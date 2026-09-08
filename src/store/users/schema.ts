import { z } from 'zod'

export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede superar los 80 caracteres'),
  email: z
    .string()
    .trim()
    .email('Introduce un email válido')
    .max(120, 'El email no puede superar los 120 caracteres'),
  github: z
    .string()
    .trim()
    .min(2, 'El usuario de GitHub debe tener al menos 2 caracteres')
    .max(39, 'El usuario de GitHub no puede superar los 39 caracteres')
    .regex(/^[a-zA-Z0-9-]+$/, 'Solo se permiten letras, números y guiones')
})

export type UserFormData = z.infer<typeof userFormSchema>
