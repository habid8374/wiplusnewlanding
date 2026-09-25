import { CircleCheck, CircleDashed, Clock, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { FaqList } from '@/components/sections/FaqList'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { VerificadorCobertura } from '@/components/sections/VerificadorCobertura'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getCobertura, getConfigCobertura, getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import type { Barrio, EstadoCobertura } from '@/lib/types'

export const metadata: Metadata = pageMetadata({
  title: 'Cobertura de internet en Sabanalarga y Luruaco',
  description:
    'Consulta si WIPLUS tiene cobertura de internet por fibra óptica en tu barrio de Sabanalarga o Luruaco, Atlántico. Verifica tu barrio en segundos.',
  path: '/cobertura',
})

/** Grupos que se listan por municipio (sin cobertura no se lista: se consulta en el verificador). */
const GRUPOS: {
  estado: EstadoCobertura
  titulo: string
  Icono: typeof CircleCheck
  clase: string
}[] = [
  { estado: 'cubierto', titulo: 'Con cobertura', Icono: CircleCheck, clase: 'text-green-800' },
  { estado: 'parcial', titulo: 'Cobertura parcial', Icono: CircleDashed, clase: 'text-amber-800' },
  { estado: 'proximamente', titulo: 'Próximamente', Icono: Clock, clase: 'text-primary-800' },
]

const CHIP: Record<EstadoCobertura, string> = {
  cubierto: 'bg-green-50 ring-green-200',
  parcial: 'bg-amber-50 ring-amber-200',
  proximamente: 'bg-primary-50 ring-primary-100',
  sin_cobertura: 'bg-slate-50 ring-slate-200',
}

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
        description={`Tenemos red de fibra óptica en ${municipios.map((m) => m.nombre).join(' y ')}, Atlántico, y seguimos creciendo.`}
      />

      <Section id="verificador" title="Verifica tu cobertura" align="left">
        <div className="max-w-3xl">
          <VerificadorCobertura municipios={municipios} config={config} whatsapp={sitio.whatsapp} />
        </div>
      </Section>

      <Section id="municipios" title="Municipios y barrios" tone="surface">
        <div className="grid gap-8 lg:grid-cols-2">
          {municipios.map((m) => {
            const grupos = GRUPOS.map((g) => ({
              ...g,
              barrios: m.barrios.filter((b: Barrio) => b.estado === g.estado),
            })).filter((g) => g.barrios.length > 0)
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
                  {m.nombre}
                </h3>
                {grupos.length === 0 ? (
                  <p className="mt-3 text-muted">
                    Tenemos servicio en {m.nombre}. Busca tu barrio en el verificador o escríbenos y
                    te confirmamos la cobertura.
                  </p>
                ) : (
                  grupos.map((g) => (
                    <div key={g.estado}>
                      <h4 className={`mt-5 flex items-center gap-2 font-bold ${g.clase}`}>
                        <g.Icono className="size-5" aria-hidden /> {g.titulo}
                      </h4>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {g.barrios.map((b) => (
                          <li
                            key={b.id}
                            className={`rounded-full px-3 py-1 text-sm ring-1 ${CHIP[b.estado]}`}
                          >
                            {b.nombre} <ExampleBadge show={b.demo} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
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
