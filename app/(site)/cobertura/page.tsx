import { CircleCheck, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { CoberturaForm } from '@/components/forms/Forms'
import { CoverageChecker } from '@/components/sections/CoverageChecker'
import { FaqList } from '@/components/sections/FaqList'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getCobertura, getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Cobertura de internet en Sabanalarga y Luruaco',
  description:
    'Consulta si WIPLUS tiene cobertura de internet por fibra óptica en tu barrio de Sabanalarga o Luruaco, Atlántico. Verifica tu dirección en segundos.',
  path: '/cobertura',
})

export default async function CoberturaPage() {
  const [sitio, municipios, faqs] = await Promise.all([
    getSiteSettings(),
    getCobertura(),
    getFaqs('cobertura'),
  ])

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Cobertura', path: '/cobertura' }]}
        title="¿Llegamos a tu barrio?"
        description={`Tenemos red de fibra óptica en ${municipios.map((m) => m.nombre).join(' y ')}, Atlántico, y seguimos creciendo.`}
      />

      <Section id="verificador" title="Verifica tu cobertura" align="left">
        <div className="max-w-3xl">
          <CoverageChecker municipios={municipios} whatsapp={sitio.whatsapp} />
        </div>
      </Section>

      <Section id="municipios" title="Municipios y barrios con servicio" tone="surface">
        <div className="grid gap-8 lg:grid-cols-2">
          {municipios.map((m) => {
            const disponibles = m.barrios.filter((b) => b.estado === 'disponible')
            const pronto = m.barrios.filter((b) => b.estado === 'proximamente')
            return (
              <article
                key={m.id}
                aria-labelledby={`mun-${m.id}`}
                className="rounded-3xl border border-line bg-white p-6 shadow-card"
              >
                <h3
                  id={`mun-${m.id}`}
                  className="flex items-center gap-2 text-2xl font-extrabold text-primary-900"
                >
                  <MapPin className="size-6 text-primary-600" aria-hidden />
                  {m.nombre}
                </h3>
                {m.barrios.length === 0 ? (
                  <p className="mt-3 text-muted">
                    Tenemos servicio en {m.nombre}. Escríbenos tu dirección y te confirmamos la
                    cobertura.
                  </p>
                ) : (
                  <>
                    {disponibles.length > 0 && (
                      <>
                        <h4 className="mt-5 flex items-center gap-2 font-bold text-green-800">
                          <CircleCheck className="size-5" aria-hidden /> Con servicio
                        </h4>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {disponibles.map((b) => (
                            <li
                              key={b.nombre}
                              className="rounded-full bg-green-50 px-3 py-1 text-sm ring-1 ring-green-200"
                            >
                              {b.nombre} <ExampleBadge show={b.ejemplo} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {pronto.length > 0 && (
                      <>
                        <h4 className="mt-5 flex items-center gap-2 font-bold text-amber-800">
                          <Clock className="size-5" aria-hidden /> Próximamente
                        </h4>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {pronto.map((b) => (
                            <li
                              key={b.nombre}
                              className="rounded-full bg-amber-50 px-3 py-1 text-sm ring-1 ring-amber-200"
                            >
                              {b.nombre} <ExampleBadge show={b.ejemplo} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
                <div className="mt-6">
                  <MapEmbed
                    lat={m.geo.lat}
                    lng={m.geo.lng}
                    zoom={14}
                    titulo={`Mapa de cobertura en ${m.nombre}`}
                    direccion={`${m.nombre}, ${m.departamento}, Colombia`}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </Section>

      <Section
        id="llegamos-a-tu-casa"
        title="¿No encontraste tu barrio?"
        description="Déjanos tu dirección y te confirmamos si podemos instalarte."
      >
        <div className="mx-auto max-w-3xl">
          <CoberturaForm />
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
