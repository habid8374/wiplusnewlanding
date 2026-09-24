/**
 * Enlaces que vienen del CMS (OWASP A05 Inyección): solo rutas internas ("/planes-hogar")
 * o URLs http(s). Descarta "javascript:", "data:", "//otro-sitio" y demás esquemas.
 */
export function enlaceSeguro(href: string | null | undefined): string | null {
  const v = href?.trim()
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
