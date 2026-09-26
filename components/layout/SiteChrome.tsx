import { ConsentAndAnalytics } from '@/components/analytics/ConsentAndAnalytics'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  getAvisoActivo,
  getEnlacesInteres,
  getOfertaFlotante,
  getSiteSettings,
} from '@/lib/content'
import { GA_ID } from '@/lib/env'
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo'
import { AnnouncementBar } from './AnnouncementBar'
import { FloatingWhatsApp } from './FloatingWhatsApp'
import { Footer } from './Footer'
import { Header } from './Header'
import { OfertaFlotante } from './OfertaFlotante'
import { TopBar } from './TopBar'

/** Estructura común de las páginas públicas (también la usa la página 404). */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [sitio, aviso, oferta, enlaces] = await Promise.all([
    getSiteSettings(),
    getAvisoActivo(),
    getOfertaFlotante(),
    getEnlacesInteres(),
  ])
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[70] rounded-md bg-white px-4 py-2 font-semibold text-primary-900 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <JsonLd data={[localBusinessJsonLd(sitio), websiteJsonLd()]} />
      <AnnouncementBar aviso={aviso} />
      <TopBar sitio={sitio} />
      <Header sitio={sitio} />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer sitio={sitio} enlacesInteres={enlaces} />
      {oferta && <OfertaFlotante oferta={oferta} whatsapp={sitio.whatsapp} />}
      <FloatingWhatsApp numero={sitio.whatsapp} numeroEmpresas={sitio.whatsappEmpresas} />
      <ConsentAndAnalytics gaId={GA_ID} />
    </>
  )
}
