import { Building2, Gauge, Headset, Network, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { EmpresasForm } from '@/components/forms/Forms'
import { Clients } from '@/components/sections/Clients'
import { FaqList } from '@/components/sections/FaqList'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getClientes, getFaqs, getOfertaEmpresarial, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Internet para empresas en el Atlántico',
  description:
    'Internet por fibra óptica para empresas en Sabanalarga, Luruaco y el Atlántico: canal dedicado, IP fija, soporte prioritario y SLA. Pide tu cotización.',
  path: '/planes-empresas',
})

const iconos = [Network, ShieldCheck, Headset, Gauge]

export default async function PlanesEmpresasPage() {
  const [sitio, oferta, clientes, faqs] = await Promise.all([
    getSiteSettings(),
    getOfertaEmpresarial(),
    getClientes(),
    getFaqs('empresas'),
  ])

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Empresas', path: '/planes-empresas' }]}
        title={oferta.titulo}
        description={oferta.descripcion}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#cotizacion"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-bold text-primary-900 hover:bg-primary-50"
          >
            Solicitar cotización
          </a>
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.empresas()}
            ubicacion="empresas_hero"
          >
            Cotizar por WhatsApp
          </WhatsAppLink>
        </div>
      </PageHero>

      <Section
        id="beneficios"
        eyebrow="Soluciones corporativas"
        title="Conectividad a la medida de tu negocio"
      >
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {oferta.beneficios.map((b, i) => {
            const Icon = iconos[i % iconos.length]
            return (
              <li
                key={b.titulo}
                className="rounded-2xl border border-line bg-white p-6 shadow-card"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-bold text-primary-900">{b.titulo}</h3>
                <p className="mt-2 text-muted">{b.descripcion}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {clientes.length > 0 && (
        <Section
          id="clientes"
          eyebrow="Confían en nosotros"
          title="Empresas que ya trabajan con WIPLUS"
          tone="surface"
        >
          <Clients clientes={clientes} />
        </Section>
      )}

      <Section
        id="cotizacion"
        title="Cotiza el internet de tu empresa"
        description="Respondemos en horario de atención. Si es urgente, escríbenos por WhatsApp."
      >
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_18rem]">
          <EmpresasForm velocidades={oferta.velocidades} />
          <aside className="rounded-3xl bg-primary-900 p-6 text-white">
            <Building2 className="size-10 text-accent-400" aria-hidden />
            <h3 className="mt-3 text-xl font-bold">¿Prefieres hablar con un asesor?</h3>
            <p className="mt-2 text-primary-100">
              Te atendemos por WhatsApp de {sitio.horario.texto}.
            </p>
            <WhatsAppLink
              numero={sitio.whatsapp}
              mensaje={mensajesWhatsApp.empresas()}
              ubicacion="empresas_aside"
              className="mt-5 w-full"
            >
              WhatsApp empresas
            </WhatsAppLink>
          </aside>
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
