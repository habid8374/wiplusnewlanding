/** Configuración pública derivada de variables de entorno (con valores por defecto seguros). */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wiplus.com.co').replace(
  /\/$/,
  '',
)

/**
 * Entorno del sitio. En el despliegue real se define NEXT_PUBLIC_SITE_ENV=production:
 * el contenido de ejemplo se oculta y el sitio se puede indexar.
 */
export const IS_PRODUCTION_SITE = process.env.NEXT_PUBLIC_SITE_ENV === 'production'

/** Mostrar contenido marcado `ejemplo` (con etiqueta [EJEMPLO]). Nunca en producción. */
export const SHOW_EXAMPLES = !IS_PRODUCTION_SITE

export const WHATSAPP_OVERRIDE = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '')

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
