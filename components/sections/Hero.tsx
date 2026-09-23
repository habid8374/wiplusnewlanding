import { ArrowRight, Gauge, Headset, MapPin } from 'lucide-react'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { formatCOP } from '@/lib/phone'
import type { Plan, SiteSettings } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import { FiberIllustration } from './FiberIllustration'

export function Hero({ sitio, planes }: { sitio: SiteSettings; planes: Plan[] }) {
  const maxMb = Math.max(...planes.map((p) => p.velocidadMb), 100)
  const precios = planes.map((p) => p.precio).filter((p): p is number => p != null)
  const desde = precios.length ? Math.min(...precios) : null

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 -z-10 size-[28rem] rounded-full bg-accent-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[26rem] rounded-full bg-primary-500/30 blur-3xl"
      />
      <Container className="grid items-center gap-10 py-8 sm:py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-accent-300 ring-1 ring-white/20">
            <MapPin className="size-4" aria-hidden />
            {sitio.municipiosCobertura.join(' y ')}, Atlántico
          </p>
          <h1
            id="hero-titulo"
            className="mt-4 text-[2.15rem] leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Internet por fibra óptica en <span className="text-accent-400">Sabanalarga</span> y{' '}
            <span className="text-accent-400">Luruaco</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-pretty text-primary-100 sm:mt-5 sm:text-xl">
            Conexión estable para tu casa o tu negocio, con soporte técnico local e instalación
            ágil. Más de {sitio.experienciaAnios} años conectando la región.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/planes-hogar" variant="light" size="lg">
              Ver planes
              <ArrowRight className="size-5" aria-hidden />
            </ButtonLink>
            <WhatsAppLink
              numero={sitio.whatsapp}
              mensaje={mensajesWhatsApp.contratar()}
              ubicacion="hero"
              size="lg"
            >
              Escríbenos por WhatsApp
            </WhatsAppLink>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <dt className="text-sm text-primary-200">Velocidad</dt>
              <dd className="text-3xl font-extrabold">
                hasta {maxMb} <span className="text-xl">Mb</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-primary-200">Precio</dt>
              <dd className="text-3xl font-extrabold">
                {desde != null ? (
                  <>
                    desde {formatCOP(desde)}
                    <span className="text-xl font-bold">/mes</span>
                  </>
                ) : (
                  <span className="text-2xl">Pregunta sin compromiso</span>
                )}
              </dd>
            </div>
          </dl>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-100">
            <li className="flex items-center gap-2">
              <Gauge className="size-4 text-accent-400" aria-hidden /> Fibra hasta tu hogar
            </li>
            <li className="flex items-center gap-2">
              <Headset className="size-4 text-accent-400" aria-hidden /> Soporte local
            </li>
          </ul>
        </div>
        <FiberIllustration className="mx-auto hidden w-full max-w-md sm:block" />
      </Container>
    </section>
  )
}
