import type { MetadataRoute } from 'next'
import { getCobertura } from '@/lib/content'
import { RUTAS } from '@/lib/rutas'
import { absoluteUrl } from '@/lib/seo'

/** /sitemap.xml — páginas de lib/rutas.ts y una página por zona de cobertura. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const zonas = (await getCobertura()).filter((m) => m.slug)
  return [
    ...RUTAS.map((r) => ({
      url: absoluteUrl(r.path),
      lastModified,
      changeFrequency: r.frecuencia,
      priority: r.prioridad,
    })),
    ...zonas.map((m) => ({
      url: absoluteUrl(`/cobertura/${m.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
