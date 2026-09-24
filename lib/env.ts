/** Configuración pública derivada de variables de entorno (con valores por defecto seguros). */

/** Dominio definitivo del sitio. */
const DOMINIO_FINAL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wiplus.com.co').replace(
  /\/$/,
  '',
)

/**
 * URL pública del despliegue: la usan canónicas, og:url, sitemap y la tarjeta para compartir.
 *  - Vercel producción aún en *.vercel.app → ese dominio. Mientras www.wiplus.com.co siga en
 *    WordPress, WhatsApp/Facebook leerían la tarjeta del sitio viejo si apuntáramos allá.
 *  - Vercel preview → URL de la rama.
 *  - Con el dominio propio conectado en Vercel, o fuera de Vercel → dominio definitivo.
 */
function siteUrl() {
  const env = process.env.VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV
  const prod =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  const branch = process.env.VERCEL_BRANCH_URL || process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  if (env === 'production' && prod?.endsWith('.vercel.app')) return `https://${prod}`
  if (env === 'preview' && branch) return `https://${branch}`
  return DOMINIO_FINAL
}
export const SITE_URL = siteUrl()

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
