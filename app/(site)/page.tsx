import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { Benefits } from '@/components/sections/Benefits'
import { Clients } from '@/components/sections/Clients'
import { CoverageTeaser } from '@/components/sections/CoverageTeaser'
import { FaqList } from '@/components/sections/FaqList'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { PlanCard } from '@/components/sections/PlanCard'
import { Testimonials } from '@/components/sections/Testimonials'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import {
  getClientes,
  getCobertura,
  getFaqs,
  getPlanes,
  getSiteSettings,
  getTestimonios,
} from '@/lib/content'
import { pageMetadata, planesJsonLd } from '@/lib/seo'
import type { Plan } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Internet por fibra óptica en Sabanalarga y Luruaco | WIPLUS Comunicaciones',
  description:
    'Internet por fibra óptica en Sabanalarga y Luruaco, Atlántico. Planes hogar hasta 100 Mb, soporte técnico local y contratación inmediata por WhatsApp.',
  path: '/',
  absoluteTitle: true,
})

/** 3–4 planes para el inicio: los destacados más los de mayor velocidad. */
function planesDestacados(planes: Plan[], n = 4) {
  const elegidos = [
    ...planes.filter((p) => p.destacado),
    ...[...planes].filter((p) => !p.destacado).sort((a, b) => b.velocidadMb - a.velocidadMb),
  ].slice(0, n)
  return elegidos.sort((a, b) => a.velocidadMb - b.velocidadMb)
}

export default async function HomePage() {
  const [sitio, planes, municipios, clientes, testimonios, faqs] = await Promise.all([
    getSiteSettings(),
    getPlanes(),
    getCobertura(),
    getClientes(),
    getTestimonios(),
    getFaqs('general'),
  ])
  const destacados = planesDestacados(planes)

  return (
    <>
      <JsonLd data={planesJsonLd(planes)} />
      <Hero sitio={sitio} planes={planes} />

      <Section
        id="planes"
        eyebrow="Planes hogar"
        title="Elige la velocidad para tu casa"
        description="Todos nuestros planes son por fibra óptica. Toca “Lo quiero” y te atendemos por WhatsApp."
      >
        <ul className="grid gap-6 pt-3 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((plan) => (
            <li key={plan.id}>
              <PlanCard plan={plan} whatsapp={sitio.whatsapp} ubicacion="inicio_planes" />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href="/planes-hogar" variant="outline">
            Ver todos los planes y comparar
            <ArrowRight className="size-5" aria-hidden />
          </ButtonLink>
        </div>
      </Section>

      <Benefits anios={sitio.experienciaAnios} />

      <CoverageTeaser municipios={municipios} whatsapp={sitio.whatsapp} />

      {(clientes.length > 0 || testimonios.length > 0) && (
        <Section
          id="confian-en-nosotros"
          eyebrow="Confían en nosotros"
          title="Hogares y empresas conectados con WIPLUS"
          description="Comercios, instituciones y familias de la región confían su conectividad a nuestro equipo."
        >
          <Clients clientes={clientes} />
          {testimonios.length > 0 && (
            <div className="mt-12">
              <Testimonials testimonios={testimonios} />
            </div>
          )}
        </Section>
      )}

      <Section
        id="preguntas-frecuentes"
        eyebrow="Preguntas frecuentes"
        title="Resolvemos tus dudas"
        tone="surface"
      >
        <FaqList faqs={faqs} />
      </Section>

      <FinalCta sitio={sitio} mensaje={mensajesWhatsApp.contratar()} />
    </>
  )
}
