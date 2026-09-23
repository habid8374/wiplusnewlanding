import { Phone } from 'lucide-react'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { Container } from '@/components/ui/Container'
import type { SiteSettings } from '@/lib/types'

export function FinalCta({
  sitio,
  titulo = '¿Listo para navegar con fibra óptica?',
  texto = 'Escríbenos por WhatsApp y un asesor te ayuda a elegir el plan ideal y agenda tu instalación.',
  mensaje,
  ubicacion = 'cta_final',
}: {
  sitio: SiteSettings
  titulo?: string
  texto?: string
  mensaje: string
  ubicacion?: string
}) {
  const tel = sitio.telefonos[0]
  return (
    <section aria-labelledby={`${ubicacion}-titulo`} className="py-14 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 px-6 py-12 text-center text-white shadow-card-hover sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-accent-500/25 blur-3xl"
          />
          <h2
            id={`${ubicacion}-titulo`}
            className="relative text-3xl font-extrabold tracking-tight text-balance sm:text-4xl"
          >
            {titulo}
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-primary-100">{texto}</p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppLink numero={sitio.whatsapp} mensaje={mensaje} ubicacion={ubicacion} size="lg">
              Escríbenos por WhatsApp
            </WhatsAppLink>
            {tel && (
              <CallLink numero={tel.numero} ubicacion={ubicacion} variant="outline-light" size="lg">
                <Phone className="size-5" aria-hidden />
                Llamar al {tel.numero}
              </CallLink>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
