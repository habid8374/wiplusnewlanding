import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

const rutas: {
  path: string
  priority: number
  changeFrequency: 'weekly' | 'monthly' | 'yearly'
}[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/planes-hogar', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/planes-empresas', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/cobertura', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/soporte', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/pagos', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/nosotros', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/contacto', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/usuario', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/politica-de-datos', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terminos', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return rutas.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))
}
