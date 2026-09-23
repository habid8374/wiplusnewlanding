import { ConsentAndAnalytics } from '@/components/analytics/ConsentAndAnalytics'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TopBar } from '@/components/layout/TopBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { getAvisoActivo, getSiteSettings } from '@/lib/content'
import { GA_ID } from '@/lib/env'
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [sitio, aviso] = await Promise.all([getSiteSettings(), getAvisoActivo()])
  return (
    <>
      <a
        href="#contenido"
        className="text-primary-900 sr-only z-[70] rounded-md bg-white px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
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
      <Footer sitio={sitio} />
      <FloatingWhatsApp numero={sitio.whatsapp} />
      <ConsentAndAnalytics gaId={GA_ID} />
    </>
  )
}
