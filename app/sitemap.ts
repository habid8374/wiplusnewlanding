import type { MetadataRoute } from 'next'
import { RUTAS } from '@/lib/rutas'
import { absoluteUrl } from '@/lib/seo'

/** /sitemap.xml — se genera en el build a partir de lib/rutas.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return RUTAS.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified,
    changeFrequency: r.frecuencia,
    priority: r.prioridad,
  }))
}
