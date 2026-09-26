import { KeyRound, MessageCircle, Tv } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getSiteSettings, getTv } from '@/lib/content'
import { cn } from '@/lib/cn'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import nuplin from '@/public/tv/nuplin-logo.png'

export const metadata: Metadata = pageMetadata({
  title: 'Planes de TV en vivo con NUPLIN',
  description:
    'TV en vivo en tu Smart TV con la aplicación NUPLIN: canales nacionales, deportes, cine, noticias e infantiles. Planes desde Free hasta Premium. Consulta precios por WhatsApp.',
  path: '/planes-tv',
})

const pasos = [
  {
    Icono: MessageCircle,
    titulo: 'Elige tu plan',
    texto: 'Escríbenos por WhatsApp y te contamos precios y canales de cada plan.',
  },
  {
    Icono: KeyRound,
    titulo: 'Recibe tus credenciales',
    texto: 'WIPLUS te entrega tu usuario y contraseña según el plan que adquieras.',
  },
  {
    Icono: Tv,
    titulo: 'Instala NUPLIN',
    texto: 'Descarga la aplicación en tu Smart TV, inicia sesión y disfruta.',
  },
]

export default async function PlanesTvPage() {
  const [sitio, tv] = await Promise.all([getSiteSettings(), getTv()])

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Planes TV', path: '/planes-tv' }]}
        title="TV en vivo con NUPLIN"
        description="Canales nacionales, deportes, cine, noticias e infantiles en tu Smart TV. Planes desde Free hasta Premium."
      >
        <WhatsAppLink
          numero={sitio.whatsapp}
          mensaje={mensajesWhatsApp.tv()}
          ubicacion="tv_hero"
          size="lg"
        >
          Consultar planes y precios
        </WhatsAppLink>
      </PageHero>

      <Section id="nuplin" align="left">
        <div className="grid items-center gap-8 lg:grid-cols-[18rem_1fr]">
          <Image
            src={nuplin}
            alt="Logo de NUPLIN, la aplicación de TV de WIPLUS"
            sizes="288px"
            className="mx-auto w-56 rounded-3xl shadow-card-hover lg:w-72"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-primary-900 sm:text-3xl">
              ¿Cómo funciona?
            </h2>
            <ol className="mt-6 grid gap-5 sm:grid-cols-3">
              {pasos.map(({ Icono, titulo, texto }, i) => (
                <li
                  key={titulo}
                  className="rounded-2xl border border-line bg-white p-5 shadow-card"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icono className="size-6" aria-hidden />
                  </span>
                  <p className="mt-3 text-sm font-bold text-primary-600">Paso {i + 1}</p>
                  <h3 className="text-lg font-bold text-primary-900">{titulo}</h3>
                  <p className="mt-1 text-muted">{texto}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section id="planes" title="Planes de TV" tone="surface">
        <ul className="grid gap-6 md:grid-cols-3">
          {tv.planes.map((p) => (
            <li
              key={p.id}
              id={`tv-${p.id}`}
              className="flex flex-col rounded-3xl border border-line bg-white p-6 text-center shadow-card"
            >
              <p className="text-sm font-bold tracking-wider text-primary-600 uppercase">Plan</p>
              <h3 className="text-3xl font-extrabold text-primary-900">{p.nombre}</h3>
              <p className="mt-3 flex-1 text-muted">{p.descripcion}</p>
              <p className="mt-5 text-xl font-extrabold text-primary-900">Consulta el precio</p>
              <WhatsAppLink
                numero={sitio.whatsapp}
                mensaje={mensajesWhatsApp.tv(p.nombre)}
                ubicacion={`tv_${p.id}`}
                className="mt-4 w-full"
              >
                Lo quiero
              </WhatsAppLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="canales"
        title="Canales"
        description="Consulta por WhatsApp qué canales incluye cada plan."
      >
        <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
          {tv.parrillas.map((g, i) => (
            <figure key={g.id} className={i === 0 ? 'lg:row-span-2' : undefined}>
              <figcaption className="mb-3 text-xl font-extrabold text-primary-900">
                {g.titulo}{' '}
                <span className="text-base font-semibold text-muted">
                  ({g.canales.length} canales)
                </span>
              </figcaption>
              <Image
                src={g.imagen.src}
                width={g.imagen.width}
                height={g.imagen.height}
                sizes="(max-width: 1024px) 100vw, 50vw"
                alt={`Canales: ${g.canales.join(', ')}.`}
                className={cn(
                  'mx-auto h-auto w-full rounded-3xl shadow-card',
                  g.imagen.width < 500 ? 'max-w-xs' : 'max-w-xl',
                )}
              />
            </figure>
          ))}
        </div>
      </Section>

      <FinalCta
        sitio={sitio}
        titulo="¿Listo para ver TV en vivo?"
        texto="Escríbenos por WhatsApp: te damos los precios, activamos tu plan y te enviamos tus credenciales de NUPLIN."
        mensaje={mensajesWhatsApp.tv()}
        ubicacion="tv_cta"
      />
    </>
  )
}
