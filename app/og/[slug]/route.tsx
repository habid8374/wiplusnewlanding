import { renderPageCard } from '@/lib/og-card'
import { OG_PAGES } from '@/lib/og-pages'

/** Tarjeta para compartir de cada sección: /og/nosotros, /og/planes-hogar, … (estáticas). */
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(OG_PAGES).map((slug) => ({ slug }))
}

export async function GET(_req: Request, ctx: RouteContext<'/og/[slug]'>) {
  const { slug } = await ctx.params
  const page = OG_PAGES[slug]
  if (!page) return new Response('No encontrada', { status: 404 })
  return renderPageCard(slug, page)
}
