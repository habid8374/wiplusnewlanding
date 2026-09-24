import * as z from 'zod/mini'
import { MUNICIPIOS, TIPOS_FALLA } from './constants'

export { MUNICIPIOS, TIPOS_FALLA }

/**
 * Esquemas de formularios compartidos entre cliente (validación inmediata) y servidor (route handlers).
 * Se usa `zod/mini` (API modular) para mantener liviano el Worker de Cloudflare y el JS del cliente.
 */

const texto = (min: number, max: number, campo: string) =>
  z
    .string({ error: `Escribe ${campo}.` })
    .check(
      z.trim(),
      z.minLength(min, `Escribe ${campo}.`),
      z.maxLength(max, `Máximo ${max} caracteres.`),
    )

const textoOpcional = (max: number) =>
  z._default(
    z.optional(z.string().check(z.trim(), z.maxLength(max, `Máximo ${max} caracteres.`))),
    '',
  )

export const celularSchema = z.pipe(
  z.pipe(
    z.string({ error: 'Escribe tu número de celular.' }),
    z.transform((v: string) => v.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '')),
  ),
  z
    .string()
    .check(z.regex(/^3\d{9}$/, 'Escribe un celular colombiano de 10 dígitos (ej. 3012133151).')),
)

const emailOpcional = z.pipe(
  z.optional(
    z.union([z.literal(''), z.email('Escribe un correo válido.').check(z.maxLength(120))]),
  ),
  z.transform((v: string | undefined) => (v ? v : undefined)),
)

/** Campos comunes: aceptación de política, honeypot y token de Turnstile. */
const comunes = {
  aceptaPolitica: z.literal(true, {
    error: 'Debes aceptar la política de tratamiento de datos para continuar.',
  }),
  // Honeypot: los humanos no lo ven; si trae texto, es un bot.
  sitioWeb: z._default(z.optional(z.string().check(z.maxLength(0))), ''),
  turnstileToken: z._default(z.optional(z.string()), ''),
}

export const solicitudSchema = z.object({
  nombre: texto(3, 80, 'tu nombre'),
  celular: celularSchema,
  email: emailOpcional,
  municipio: z.enum(MUNICIPIOS, { error: 'Elige tu municipio.' }),
  barrio: texto(2, 80, 'tu barrio o vereda'),
  direccion: texto(5, 120, 'tu dirección'),
  plan: texto(1, 40, 'el plan que te interesa'),
  ...comunes,
})

export const empresasSchema = z.object({
  empresa: texto(2, 100, 'el nombre de la empresa'),
  nit: textoOpcional(20),
  contacto: texto(3, 80, 'el nombre de contacto'),
  celular: celularSchema,
  email: z.email('Escribe un correo válido.').check(z.maxLength(120)),
  velocidad: texto(1, 40, 'la velocidad requerida'),
  mensaje: textoOpcional(1000),
  ...comunes,
})

export const coberturaSchema = z.object({
  nombre: texto(3, 80, 'tu nombre'),
  celular: celularSchema,
  email: emailOpcional,
  municipio: z.enum(MUNICIPIOS, { error: 'Elige tu municipio.' }),
  barrio: texto(2, 80, 'tu barrio o vereda'),
  direccion: texto(5, 120, 'tu dirección'),
  ...comunes,
})

export const fallaSchema = z.object({
  titular: texto(3, 80, 'el nombre del titular'),
  contrato: texto(3, 30, 'el número de contrato o documento'),
  celular: celularSchema,
  email: emailOpcional,
  tipo: z.enum(TIPOS_FALLA, { error: 'Elige el tipo de falla.' }),
  descripcion: texto(10, 1000, 'una breve descripción de la falla (mínimo 10 caracteres)'),
  ...comunes,
})

export const contactoSchema = z.object({
  nombre: texto(3, 80, 'tu nombre'),
  celular: celularSchema,
  email: emailOpcional,
  asunto: texto(3, 100, 'el asunto'),
  mensaje: texto(10, 2000, 'tu mensaje (mínimo 10 caracteres)'),
  ...comunes,
})

export const formSchemas = {
  solicitud: solicitudSchema,
  empresas: empresasSchema,
  cobertura: coberturaSchema,
  falla: fallaSchema,
  contacto: contactoSchema,
} as const

export type FormType = keyof typeof formSchemas
export type FormValues<T extends FormType> = z.output<(typeof formSchemas)[T]>

export const FORM_LABELS: Record<FormType, string> = {
  solicitud: 'Solicitud de servicio',
  empresas: 'Cotización empresarial',
  cobertura: 'Verificación de cobertura',
  falla: 'Reporte de falla',
  contacto: 'Contacto general',
}

/** Respuesta estándar de /api/formularios/* */
export type FormResponse =
  | { ok: true; ticket?: string; mensaje: string }
  | { ok: false; mensaje: string; errores?: Record<string, string[]> }

/** Convierte un ZodError en { campo: [mensajes] }. */
export function erroresPorCampo(error: {
  issues: readonly { path: readonly PropertyKey[]; message: string }[]
}): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_')
    ;(out[key] ??= []).push(issue.message)
  }
  return out
}
