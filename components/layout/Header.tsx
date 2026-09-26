import { PortalClientesLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { Container } from '@/components/ui/Container'
import { mainNav } from '@/lib/nav'
import type { SiteSettings } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavLinks } from './NavLinks'

export function Header({ sitio }: { sitio: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Logo className="shrink-0" />
        <nav aria-label="Principal" className="hidden lg:block">
          <NavLinks items={mainNav} />
        </nav>
        <div className="flex items-center gap-2">
          {sitio.portalClientes && (
            <PortalClientesLink
              href={sitio.portalClientes}
              ubicacion="header"
              className="hidden min-h-10 px-4 text-sm whitespace-nowrap 2xl:inline-flex"
            />
          )}
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.contratar()}
            ubicacion="header"
            size="sm"
            className="px-3 sm:px-4"
          >
            Contratar
          </WhatsAppLink>
          <MobileNav
            items={mainNav}
            whatsapp={sitio.whatsapp}
            portalClientes={sitio.portalClientes}
          />
        </div>
      </Container>
    </header>
  )
}
