import type { FormType } from '@/lib/schemas/forms'

export const FORM_ENDPOINTS: Record<FormType, string> = {
  solicitud: '/api/solicitud',
  empresas: '/api/cotizacion',
  cobertura: '/api/cobertura',
  falla: '/api/falla',
  contacto: '/api/contacto',
}
