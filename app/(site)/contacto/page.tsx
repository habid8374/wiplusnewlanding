import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { ContactoForm } from '@/components/forms/Forms'
import { FacebookIcon } from '@/components/icons/brands'
import { MapEmbed } from '@/components/sections/MapEmbed'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Contacto: teléfonos, WhatsApp y oficina en Sabanalarga',
  description:
    'Contacta a WIPLUS Comunicaciones: WhatsApp, teléfonos 301 213 3151 y 300 788 8808, correo y oficina en la Calle 13 #17-04, Sabanalarga, Atlántico.',
  path: '/contacto',
})

export default async function ContactoPage() {
  const sitio = await getSiteSettings()
  const direccion = `${sitio.direccion.calle}, ${sitio.direccion.municipio}, ${sitio.direccion.departamento}`
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Contacto', path: '/contacto' }]}
        title="Hablemos"
        description="Escríbenos por WhatsApp, llámanos o visítanos en nuestra oficina de Sabanalarga."
      />
      <Section id="canales" align="left">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold text-primary-900">Canales de atención</h2>
            <ul className="mt-6 space-y-5">
              <li>
                <WhatsAppLink
                  numero={sitio.whatsapp}
                  mensaje={mensajesWhatsApp.general()}
                  ubicacion="contacto"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Escríbenos por WhatsApp
                </WhatsAppLink>
              </li>
              {sitio.telefonos.map((t) => (
                <li key={t.numero} className="flex items-start gap-3">
                  <Phone className="mt-1 size-5 text-primary-600" aria-hidden />
                  <div>
                    <p className="text-sm text-muted">{t.etiqueta ?? 'Teléfono'}</p>
                    <CallLink
                      numero={t.numero}
                      ubicacion="contacto"
                      className="text-xl font-bold text-primary-900 hover:underline"
                    >
                      {t.numero}
                    </CallLink>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail className="mt-1 size-5 text-primary-600" aria-hidden />
                <div>
                  <p className="text-sm text-muted">Correo</p>
                  <a
                    href={`mailto:${sitio.correo}`}
                    className="text-lg font-bold [overflow-wrap:anywhere] text-primary-900 hover:underline"
                  >
                    {sitio.correo}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 text-primary-600" aria-hidden />
                <div>
                  <p className="text-sm text-muted">Oficina</p>
                  <p className="text-lg font-bold text-primary-900">{direccion}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-1 size-5 text-primary-600" aria-hidden />
                <div>
                  <p className="text-sm text-muted">Horario de atención</p>
                  <p className="text-lg font-bold text-primary-900">
                    {sitio.horario.dias}, {sitio.horario.texto}
                  </p>
                </div>
              </li>
              {sitio.redes.facebook && (
                <li>
                  <a
                    href={sitio.redes.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-2 font-bold [overflow-wrap:anywhere] text-primary-700 hover:underline"
                  >
                    <FacebookIcon className="size-5" />
                    facebook.com/wipluscomunicaciones
                    <span className="sr-only"> (abre en una nueva pestaña)</span>
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-8">
              <MapEmbed
                lat={sitio.geo.lat}
                lng={sitio.geo.lng}
                zoom={17}
                titulo="Ubicación de la oficina de WIPLUS en Sabanalarga"
                direccion={`${direccion}, Colombia`}
              />
            </div>
          </div>
          <ContactoForm />
        </div>
      </Section>
    </>
  )
}
