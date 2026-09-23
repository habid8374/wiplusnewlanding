import type { MetadataRoute } from 'next'
import { IS_PRODUCTION_SITE, SITE_URL } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) {
    // Entornos de prueba: no indexar.
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
