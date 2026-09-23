import { Check, Minus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { SolicitudForm } from '@/components/forms/Forms'
import { JsonLd } from '@/components/seo/JsonLd'
import { FaqList } from '@/components/sections/FaqList'
import { FinalCta } from '@/components/sections/FinalCta'
import { PlanCard } from '@/components/sections/PlanCard'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getFaqs, getPlanes, getSiteSettings } from '@/lib/content'
import { formatCOP } from '@/lib/phone'
import { pageMetadata, planesJsonLd } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Planes de internet hogar en Sabanalarga y Luruaco',
  description:
    'Planes de internet por fibra óptica para el hogar de 30 a 100 Mb en Sabanalarga y Luruaco. Compara velocidades y contrata por WhatsApp en minutos.',
  path: '/planes-hogar',
})

export default async function PlanesHogarPage() {
  const [sitio, planes, faqs] = await Promise.all([
    getSiteSettings(),
    getPlanes(),
    getFaqs('planes'),
  ])
  const beneficios = Array.from(new Set(planes.flatMap((p) => p.beneficios)))

  return (
    <>
      <JsonLd data={planesJsonLd(planes)} />
      <PageHero
        crumbs={[{ name: 'Planes Hogar', path: '/planes-hogar' }]}
        title="Planes de internet para tu hogar"
        description="Fibra óptica en Sabanalarga y Luruaco. Elige tu velocidad, toca “Lo quiero” y te atendemos por WhatsApp."
      />

      <Section
        id="planes"
        title="Nuestros planes"
        description="Todos los planes incluyen conexión por fibra óptica y soporte técnico local."
      >
        <ul className="flex flex-wrap justify-center gap-6 pt-3">
          {planes.map((plan) => (
            <li key={plan.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <PlanCard plan={plan} whatsapp={sitio.whatsapp} ubicacion="planes_hogar" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="comparar" title="Compara los planes" tone="surface">
        <div className="relative overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Comparativo de planes de internet hogar de WIPLUS</caption>
            <thead className="bg-primary-900 text-white">
              <tr>
                <th scope="col" className="p-4 font-bold">
                  Característica
                </th>
                {planes.map((p) => (
                  <th key={p.id} scope="col" className="p-4 text-center font-bold">
                    {p.velocidadMb} Mb
                    {p.destacado && (
                      <span className="block text-xs font-semibold text-accent-300">
                        {p.etiqueta ?? 'Destacado'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <th scope="row" className="p-4 font-semibold">
                  Precio mensual
                </th>
                {planes.map((p) => (
                  <td key={p.id} className="p-4 text-center font-bold text-primary-900">
                    {p.precio != null ? formatCOP(p.precio) : 'Consultar'}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className="p-4 font-semibold">
                  Ideal para
                </th>
                {planes.map((p) => (
                  <td key={p.id} className="p-4 text-center text-muted">
                    {p.idealPara}
                  </td>
                ))}
              </tr>
              {beneficios.map((b) => (
                <tr key={b}>
                  <th scope="row" className="p-4 font-semibold">
                    {b}
                  </th>
                  {planes.map((p) => (
                    <td key={p.id} className="p-4 text-center">
                      {p.beneficios.includes(b) ? (
                        <Check className="mx-auto size-5 text-whatsapp-700" aria-label="Incluido" />
                      ) : (
                        <Minus className="mx-auto size-5 text-slate-400" aria-label="No incluido" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="p-4 font-semibold">
                  <span className="sr-only">Contratar</span>
                </th>
                {planes.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <WhatsAppLink
                      numero={sitio.whatsapp}
                      mensaje={mensajesWhatsApp.plan(p.velocidadMb)}
                      ubicacion="tabla_comparativa"
                      plan={`${p.velocidadMb} Mb`}
                      size="sm"
                      aria-label={`Lo quiero: plan de ${p.velocidadMb} Mb por WhatsApp`}
                    >
                      Lo quiero
                    </WhatsAppLink>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Las velocidades son de navegación máxima contratada. La velocidad por Wi-Fi puede variar
          según la distancia al router y los dispositivos conectados. Consulta los{' '}
          <Link href="/terminos" className="font-semibold text-primary-700 underline">
            términos y condiciones
          </Link>
          .
        </p>
      </Section>

      <Section
        id="solicitud"
        title="¿Prefieres que te llamemos?"
        description="Déjanos tus datos y te contactamos en horario de atención."
      >
        <div className="mx-auto max-w-3xl">
          <SolicitudForm planes={planes.map((p) => `${p.velocidadMb} Mb`)} />
        </div>
      </Section>

      <Section id="preguntas-frecuentes" title="Preguntas sobre los planes" tone="surface">
        <FaqList faqs={faqs} />
      </Section>

      <FinalCta sitio={sitio} mensaje={mensajesWhatsApp.contratar()} />
    </>
  )
}
