import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { BarriosMunicipio } from '@/components/sections/BarriosMunicipio'
import { FaqList } from '@/components/sections/FaqList'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { VerificadorCobertura } from '@/components/sections/VerificadorCobertura'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getCobertura, getConfigCobertura, getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { listaNatural } from '@/lib/texto'

export const metadata: Metadata = pageMetadata({
  title: 'Cobertura de internet por fibra óptica en el Atlántico',
  description:
    'Consulta si WIPLUS tiene cobertura de internet por fibra óptica en tu barrio: Sabanalarga, Luruaco, La Peña, Aguada de Pablo, Hibácharo, Leña y Palmar de Candelaria (Atlántico).',
  path: '/cobertura',
})

export default async function CoberturaPage() {
  const [sitio, municipios, config, faqs] = await Promise.all([
    getSiteSettings(),
    getCobertura(),
    getConfigCobertura(),
    getFaqs('cobertura'),
  ])

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Cobertura', path: '/cobertura' }]}
        title="¿Llegamos a tu barrio?"
        description={`Tenemos red de fibra óptica en ${listaNatural(municipios.map((m) => m.nombre))} (Atlántico), y seguimos creciendo.`}
      />

      <Section id="verificador" title="Verifica tu cobertura" align="left">
        <div className="max-w-3xl">
          <VerificadorCobertura municipios={municipios} config={config} whatsapp={sitio.whatsapp} />
        </div>
      </Section>

      <Section id="municipios" title="Zonas y barrios" tone="surface">
        <div className="grid gap-8 lg:grid-cols-2">
          {municipios.map((m) => {
            return (
              <article
                key={m.id}
                aria-labelledby={`mun-${m.slug}`}
                className="rounded-3xl border border-line bg-white p-6 shadow-card"
              >
                <h3
                  id={`mun-${m.slug}`}
                  className="flex items-center gap-2 text-2xl font-extrabold text-primary-900"
                >
                  <MapPin className="size-6 text-primary-600" aria-hidden />
                  <Link href={`/cobertura/${m.slug}`} className="hover:underline">
                    {m.nombre}
                  </Link>
                </h3>
                <BarriosMunicipio municipio={m} />
                {m.geo && (
                  <div className="mt-6">
                    <MapEmbed
                      lat={m.geo.lat}
                      lng={m.geo.lng}
                      zoom={14}
                      titulo={`Mapa de cobertura en ${m.nombre}`}
                      direccion={`${m.nombre}, ${m.departamento}, Colombia`}
                    />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section id="preguntas-frecuentes" title="Preguntas frecuentes" tone="surface">
          <FaqList faqs={faqs} />
        </Section>
      )}
    </>
  )
}
