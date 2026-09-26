import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { JsonLd } from '@/components/seo/JsonLd'
import { BarriosMunicipio } from '@/components/sections/BarriosMunicipio'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { PlanCard } from '@/components/sections/PlanCard'
import { VerificadorCobertura } from '@/components/sections/VerificadorCobertura'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getCobertura, getConfigCobertura, getPlanes, getSiteSettings } from '@/lib/content'
import { formatCOP } from '@/lib/phone'
import { pageMetadata, servicioZonaJsonLd } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

/**
 * Página por zona de cobertura (/cobertura/sabanalarga, /cobertura/la-pena, …): contenido local
 * propio para que Google muestre a WIPLUS cuando alguien busca «internet en <zona>».
 */
export async function generateStaticParams() {
  const municipios = await getCobertura()
  return municipios.filter((m) => m.slug).map((m) => ({ municipio: m.slug }))
}

async function datos(slug: string) {
  const [municipios, planes] = await Promise.all([getCobertura(), getPlanes()])
  const municipio = municipios.find((m) => m.slug === slug)
  const precios = planes.flatMap((p) => (p.precio != null ? [p.precio] : []))
  const desde = precios.length ? formatCOP(Math.min(...precios)) : null
  const maxMb = Math.max(...planes.map((p) => p.velocidadMb))
  return { municipios, planes, municipio, desde, maxMb }
}

export async function generateMetadata({
  params,
}: PageProps<'/cobertura/[municipio]'>): Promise<Metadata> {
  const { municipio: slug } = await params
  const { municipio: m, desde, maxMb } = await datos(slug)
  if (!m) return {}
  return pageMetadata({
    title: `Internet por fibra óptica en ${m.nombre}, ${m.departamento}`,
    description:
      `WIPLUS lleva internet por fibra óptica a hogares y empresas de ${m.nombre} (${m.departamento}): ` +
      `planes hasta ${maxMb} Mb${desde ? ` desde ${desde} al mes` : ''}, soporte técnico local y ` +
      `contratación por WhatsApp. Verifica la cobertura en tu barrio.`,
    path: `/cobertura/${m.slug}`,
  })
}

export default async function MunicipioPage({ params }: PageProps<'/cobertura/[municipio]'>) {
  const { municipio: slug } = await params
  const [{ municipios, planes, municipio: m, desde, maxMb }, sitio, config] = await Promise.all([
    datos(slug),
    getSiteSettings(),
    getConfigCobertura(),
  ])
  if (!m) notFound()
  const otras = municipios.filter((o) => o.id !== m.id && o.slug)
  const crumbs = [
    { name: 'Cobertura', path: '/cobertura' },
    { name: m.nombre, path: `/cobertura/${m.slug}` },
  ]

  return (
    <>
      <JsonLd data={servicioZonaJsonLd(m.nombre, m.slug)} />
      <PageHero
        crumbs={crumbs}
        title={`Internet por fibra óptica en ${m.nombre}`}
        description={`Planes para tu hogar y tu empresa en ${m.nombre}, ${m.departamento}: hasta ${maxMb} Mb${desde ? ` desde ${desde} al mes` : ''}, con soporte técnico local de nuestro equipo en Sabanalarga.`}
      >
        <WhatsAppLink
          numero={m.whatsapp || sitio.whatsapp}
          mensaje={mensajesWhatsApp.coberturaZona(m.nombre)}
          ubicacion={`zona_${m.slug}`}
          size="lg"
        >
          Consultar cobertura en {m.nombre}
        </WhatsAppLink>
      </PageHero>

      <Section id="verificador" title={`Verifica tu barrio en ${m.nombre}`} align="left">
        <div className="max-w-3xl">
          <VerificadorCobertura
            municipios={[m]}
            config={config}
            whatsapp={sitio.whatsapp}
            variante="compacto"
          />
        </div>
      </Section>

      <Section id="barrios" title={`Barrios y sectores de ${m.nombre}`} tone="surface" align="left">
        <div className="max-w-4xl">
          <BarriosMunicipio municipio={m} />
          {m.geo && (
            <div className="mt-8">
              <MapEmbed
                lat={m.geo.lat}
                lng={m.geo.lng}
                zoom={14}
                titulo={`Mapa de cobertura en ${m.nombre}`}
                direccion={`${m.nombre}, ${m.departamento}, Colombia`}
              />
            </div>
          )}
        </div>
      </Section>

      <Section id="planes" title={`Planes de internet en ${m.nombre}`}>
        <ul className="flex flex-wrap justify-center gap-6 pt-3">
          {planes.map((plan) => (
            <li key={plan.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <PlanCard
                plan={plan}
                whatsapp={m.whatsapp || sitio.whatsapp}
                ubicacion={`zona_${m.slug}`}
              />
            </li>
          ))}
        </ul>
      </Section>

      {otras.length > 0 && (
        <Section id="otras-zonas" title="Otras zonas con cobertura" tone="surface">
          <ul className="flex flex-wrap justify-center gap-3">
            {otras.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/cobertura/${o.slug}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-primary-800 shadow-card hover:border-primary-300"
                >
                  <MapPin className="size-4 text-primary-600" aria-hidden />
                  Internet en {o.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
