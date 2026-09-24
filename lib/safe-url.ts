/**
 * Enlaces que vienen del CMS (OWASP A05 Inyección): solo rutas internas ("/planes-hogar")
 * o URLs http(s). Descarta "javascript:", "data:", "//otro-sitio" y demás esquemas.
 */
export function enlaceSeguro(href: string | null | undefined): string | null {
  // Limpia lo que se cuela al escribir en el panel: espacios, caracteres invisibles y signos de
  // puntuación al final ("/planes-hogar." → "/planes-hogar").
  const v = href
    ?.replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/[.,;:]+$/, '')
  if (!v) return null
  if (v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/\\')) return v
  try {
    const url = new URL(v)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export const esRutaInterna = (href: string) => href.startsWith('/') && !href.startsWith('//')
