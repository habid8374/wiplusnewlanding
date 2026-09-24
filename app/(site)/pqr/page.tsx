import { CalendarClock, FileCheck2, MapPin, Phone, Scale } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { PqrForm } from '@/components/forms/Forms'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Radica tu PQR en línea',
  description:
    'Presenta peticiones, quejas, reclamos y recursos ante WIPLUS Comunicaciones. Recibe al instante tu número de radicado y respuesta dentro de 15 días hábiles.',
  path: '/pqr',
})

export default async function PqrPage() {
  const sitio = await getSiteSettings()
  return (
    <>
      <PageHero
        crumbs={[{ name: 'PQR', path: '/pqr' }]}
        title="Radica tu PQR"
        description="Peticiones, quejas, reclamos y recursos. Recibe al instante tu número de radicado para hacer seguimiento."
      />
      <Section id="radicar-pqr" align="left">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <div className="min-w-0 space-y-6">
            <ul className="space-y-5">
              <li className="flex gap-3">
                <FileCheck2 className="mt-0.5 size-6 shrink-0 text-primary-600" aria-hidden />
                <p>
                  <strong className="block text-primary-900">Número de radicado al instante</strong>
                  <span className="text-muted">
                    Guárdalo para consultar el estado de tu PQR con nuestro equipo.
                  </span>
                </p>
              </li>
              <li className="flex gap-3">
                <CalendarClock className="mt-0.5 size-6 shrink-0 text-primary-600" aria-hidden />
                <p>
                  <strong className="block text-primary-900">Respuesta en 15 días hábiles</strong>
                  <span className="text-muted">
                    Como lo establece el Régimen de Protección de los Usuarios de la CRC.
                  </span>
                </p>
              </li>
              <li className="flex gap-3">
                <Scale className="mt-0.5 size-6 shrink-0 text-primary-600" aria-hidden />
                <p>
                  <strong className="block text-primary-900">Conoce tus derechos</strong>
                  <span className="text-muted">
                    Derechos, deberes, recursos y autoridades en{' '}
                    <Link
                      href="/usuario"
                      className="font-semibold text-primary-700 underline underline-offset-2"
                    >
                      Protección al usuario
                    </Link>
                    .
                  </span>
                </p>
              </li>
            </ul>
            <div className="rounded-3xl border border-line bg-surface p-5">
              <h2 className="font-bold text-primary-900">También puedes radicarla por</h2>
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <WhatsAppLink
                    numero={sitio.whatsapp}
                    mensaje={mensajesWhatsApp.pqr()}
                    ubicacion="pqr"
                    size="sm"
                  >
                    WhatsApp
                  </WhatsAppLink>
                </li>
                {sitio.telefonos.map((t) => (
                  <li key={t.numero} className="flex items-center gap-2">
                    <Phone className="size-4 shrink-0 text-primary-600" aria-hidden />
                    <CallLink
                      numero={t.numero}
                      ubicacion="pqr"
                      className="font-semibold text-primary-900 hover:underline"
                    />
                  </li>
                ))}
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary-600" aria-hidden />
                  <span>
                    Oficina: {sitio.direccion.calle}, {sitio.direccion.municipio} (
                    {sitio.horario.dias}, {sitio.horario.texto})
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="min-w-0">
            <PqrForm />
          </div>
        </div>
      </Section>
    </>
  )
}
