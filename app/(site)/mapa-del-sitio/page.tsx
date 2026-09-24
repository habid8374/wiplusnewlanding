import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { RUTAS, type Ruta } from '@/lib/rutas'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Mapa del sitio',
  description:
    'Todas las páginas del sitio de WIPLUS Comunicaciones: planes de internet hogar y empresas, cobertura, soporte, pagos, contacto e información legal.',
  path: '/mapa-del-sitio',
})

const GRUPOS: Ruta['grupo'][] = ['Servicios', 'Clientes', 'Empresa', 'Legal']

export default function MapaDelSitioPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Mapa del sitio', path: '/mapa-del-sitio' }]}
        title="Mapa del sitio"
        description="Encuentra rápidamente cualquier página de WIPLUS Comunicaciones."
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          {GRUPOS.map((grupo) => (
            <section key={grupo} aria-labelledby={`grupo-${grupo}`}>
              <h2 id={`grupo-${grupo}`} className="text-xl font-extrabold text-primary-900">
                {grupo}
              </h2>
              <ul className="mt-4 space-y-4">
                {RUTAS.filter((r) => r.grupo === grupo && r.path !== '/mapa-del-sitio').map((r) => (
                  <li key={r.path}>
                    <Link href={r.path} className="font-bold text-primary-700 hover:underline">
                      {r.titulo}
                    </Link>
                    <p className="text-sm text-muted">{r.descripcion}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </>
  )
}
