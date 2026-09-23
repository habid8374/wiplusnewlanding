/** Configuración pública derivada de variables de entorno (con valores por defecto seguros). */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wiplus.com.co').replace(
  /\/$/,
  '',
)

/**
 * Entorno del sitio. Producción = el contenido de ejemplo se oculta y el sitio se puede indexar.
 *  - NEXT_PUBLIC_SITE_ENV=production lo fuerza (Cloudflare u otro hosting).
 *  - En Vercel, si NEXT_PUBLIC_SITE_ENV no está definido, se usa NEXT_PUBLIC_VERCEL_ENV:
 *    solo el despliegue de producción se indexa; las previews quedan con noindex.
 */
const SITE_ENV = process.env.NEXT_PUBLIC_SITE_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV || ''
export const IS_PRODUCTION_SITE = SITE_ENV === 'production'

/** Mostrar contenido marcado `ejemplo` (con etiqueta [EJEMPLO]). Nunca en producción. */
export const SHOW_EXAMPLES = !IS_PRODUCTION_SITE

export const WHATSAPP_OVERRIDE = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '')

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

/** Verificación de propiedad (método "etiqueta HTML") de Google Search Console y Bing Webmaster Tools. */
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ''
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ''
