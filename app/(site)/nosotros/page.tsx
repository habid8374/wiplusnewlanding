import { Compass, Eye, MapPin, Target, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Clients } from '@/components/sections/Clients'
import { FinalCta } from '@/components/sections/FinalCta'
import { Testimonials } from '@/components/sections/Testimonials'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getClientes, getFotos, getSiteSettings, getTestimonios } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Nosotros: proveedor de internet en Sabanalarga',
  description:
    'WIPLUS Comunicaciones: más de 7 años llevando internet por fibra óptica a hogares y empresas de Sabanalarga, Luruaco y el Atlántico. Conoce nuestra historia.',
  path: '/nosotros',
})

export default async function NosotrosPage() {
  const [sitio, clientes, testimonios, fotos] = await Promise.all([
    getSiteSettings(),
    getClientes(),
    getTestimonios(),
    getFotos(),
  ])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Nosotros', path: '/nosotros' }]}
        title="Conectamos a Sabanalarga y la región"
        description={`Somos una empresa de telecomunicaciones del Atlántico con más de ${sitio.experienciaAnios} años de experiencia llevando internet a hogares y empresas.`}
      />

      <Section id="historia" title="Nuestra historia" align="left">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-lg text-muted">
            {/* TODO(WIPLUS): completar la historia real (año de fundación, fundadores, hitos). */}
            <p>
              WIPLUS Comunicaciones nació en Sabanalarga con un propósito claro: que las familias y
              los negocios de la región tengan una conexión a internet estable, con atención cercana
              y a precios justos.
            </p>
            <p>
              Hoy llevamos más de {sitio.experienciaAnios} años en el sector y nuestra red de fibra
              óptica llega a {sitio.municipiosCobertura.join(' y ')}. Nuestro equipo técnico es de
              la región: conocemos las calles, los barrios y a nuestros clientes.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-4 self-start">
            <div className="rounded-2xl bg-primary-900 p-5 text-white">
              <dt className="text-sm text-primary-200">Experiencia</dt>
              <dd className="mt-1 text-3xl font-extrabold">+{sitio.experienciaAnios} años</dd>
            </div>
            <div className="rounded-2xl bg-primary-900 p-5 text-white">
              <dt className="text-sm text-primary-200">Municipios</dt>
              <dd className="mt-1 text-3xl font-extrabold">{sitio.municipiosCobertura.length}</dd>
            </div>
            <div className="col-span-2 rounded-2xl border border-line p-5">
              <dt className="flex items-center gap-2 font-bold text-primary-900">
                <MapPin className="size-5 shrink-0 text-primary-600" aria-hidden />
                Oficina principal
              </dt>
              <dd className="mt-1 pl-7 text-muted">
                {sitio.direccion.calle}, {sitio.direccion.municipio}, {sitio.direccion.departamento}
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section id="mision-vision" title="Misión y visión" tone="surface">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <Target className="size-10 text-primary-600" aria-hidden />
            <h3 className="mt-4 text-2xl font-extrabold text-primary-900">Misión</h3>
            <p className="mt-3 text-lg text-muted">{sitio.mision}</p>
          </article>
          <article className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <Eye className="size-10 text-primary-600" aria-hidden />
            <h3 className="mt-4 text-2xl font-extrabold text-primary-900">Visión</h3>
            <p className="mt-3 text-lg text-muted">{sitio.vision}</p>
          </article>
        </div>
      </Section>

      <Section id="equipo" title="Nuestro equipo" align="left">
        <div className="flex flex-col gap-6 rounded-3xl border border-line p-8 sm:flex-row sm:items-center">
          <Users className="size-12 shrink-0 text-primary-600" aria-hidden />
          <p className="text-lg text-muted">
            {/* TODO(WIPLUS): fotos y presentación del equipo. */}
            Técnicos, asesores comerciales y personal de atención al cliente de la región,
            comprometidos con que tu conexión funcione bien todos los días.
          </p>
          <Compass className="hidden size-12 shrink-0 text-accent-500 sm:block" aria-hidden />
        </div>
      </Section>

      {fotos.length > 0 && (
        <Section id="trabajos" title="Nuestro trabajo en campo" tone="surface">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((f) => (
              <li key={f.id} className="overflow-hidden rounded-2xl">
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={f.width ?? 1024}
                  height={f.height ?? 473}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(clientes.length > 0 || testimonios.length > 0) && (
        <Section id="clientes" eyebrow="Confían en nosotros" title="Clientes empresariales">
          <Clients clientes={clientes} />
          {testimonios.length > 0 && (
            <div className="mt-12">
              <Testimonials testimonios={testimonios} />
            </div>
          )}
        </Section>
      )}

      <FinalCta
        sitio={sitio}
        mensaje={mensajesWhatsApp.general()}
        titulo="¿Quieres ser parte de la familia WIPLUS?"
      />
    </>
  )
}
