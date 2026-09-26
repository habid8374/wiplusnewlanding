import { ArrowRight, Gauge, Headset, MapPin } from 'lucide-react'
import Image from 'next/image'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { formatCOP } from '@/lib/phone'
import type { Plan, SiteSettings } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import { HeroBackground } from './HeroBackground'
import icono from '@/public/brand/wiplus-icono-app.png'

export function Hero({ sitio, planes }: { sitio: SiteSettings; planes: Plan[] }) {
  const maxMb = Math.max(...planes.map((p) => p.velocidadMb), 100)
  const precios = planes.map((p) => p.precio).filter((p): p is number => p != null)
  const desde = precios.length ? Math.min(...precios) : null

  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-primary-950 text-white"
    >
      {/* Fotos de fondo (decorativas, rotativas) */}
      <HeroBackground />
      {/* Capa de marca para contraste AA del texto: más densa a la izquierda, donde va el contenido */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-950/85 via-primary-900/55 to-primary-900/10 max-lg:from-primary-950/80 max-lg:via-primary-950/65 max-lg:to-primary-900/45"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-primary-950/60 to-transparent"
      />
      <Container className="relative pt-8 pb-20 sm:py-16 lg:py-24">
        {/* Logo arriba a la derecha */}
        <Image
          src={icono}
          alt="WIPLUS Comunicaciones"
          sizes="(min-width: 1024px) 128px, (min-width: 640px) 96px, 56px"
          className="absolute top-8 right-4 size-14 rounded-2xl shadow-2xl ring-1 ring-white/20 sm:top-16 sm:right-6 sm:size-24 lg:top-24 lg:right-8 lg:size-32"
        />
        <div className="max-w-2xl [text-shadow:0_1px_2px_rgb(8_22_60/0.7),0_2px_16px_rgb(8_22_60/0.55)] [&_a]:[text-shadow:none]">
          <p className="mr-16 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-accent-300 ring-1 ring-white/20">
            <MapPin className="size-4" aria-hidden />
            {sitio.municipiosCobertura.length > 2
              ? `${sitio.municipiosCobertura.slice(0, 2).join(', ')} y ${sitio.municipiosCobertura.length - 2} zonas más`
              : sitio.municipiosCobertura.join(' y ')}
            , Atlántico
          </p>
          <h1
            id="hero-titulo"
            className="mt-4 pr-14 text-[2.15rem] leading-[1.08] font-extrabold tracking-tight text-balance sm:pr-28 sm:text-5xl lg:pr-0 lg:text-6xl"
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
      </Container>
    </section>
  )
}
