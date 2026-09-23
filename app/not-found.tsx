import { ArrowRight, Home, SearchX } from 'lucide-react'
import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { SiteChrome } from '@/components/layout/SiteChrome'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { getSiteSettings } from '@/lib/content'
import { mainNav } from '@/lib/nav'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
}

export default async function NotFound() {
  const sitio = await getSiteSettings()
  return (
    <SiteChrome>
      <Container className="py-16 text-center sm:py-24">
        <SearchX className="mx-auto size-16 text-primary-500" aria-hidden />
        <p className="mt-4 text-sm font-bold tracking-wider text-primary-600 uppercase">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-primary-900 sm:text-5xl">
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Es posible que el enlace haya cambiado con nuestro nuevo sitio. Pero tranquilo: seguimos
          aquí para conectarte.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="/planes-hogar" size="lg">
            Ver planes
            <ArrowRight className="size-5" aria-hidden />
          </ButtonLink>
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.general()}
            ubicacion="404"
            size="lg"
          >
            Escríbenos por WhatsApp
          </WhatsAppLink>
        </div>
        <nav aria-label="Páginas del sitio" className="mt-12">
          <ul className="flex flex-wrap justify-center gap-2">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 font-semibold text-primary-800 hover:bg-primary-50"
              >
                <Home className="size-4" aria-hidden /> Inicio
              </Link>
            </li>
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="inline-flex rounded-full border border-line px-4 py-2 font-semibold text-primary-800 hover:bg-primary-50"
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </SiteChrome>
  )
}
