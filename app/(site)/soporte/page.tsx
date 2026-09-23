import { Cable, Clock, Lightbulb, Power, RefreshCw, Router, Wifi } from 'lucide-react'
import type { Metadata } from 'next'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { FallaForm } from '@/components/forms/Forms'
import { FaqList } from '@/components/sections/FaqList'
import { SpeedTest } from '@/components/sections/SpeedTest'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getFaqs, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Soporte técnico y reporte de fallas',
  description:
    'Soporte técnico de WIPLUS en Sabanalarga y Luruaco: reporta una falla y recibe tu ticket, haz un test de velocidad y sigue nuestra guía para resolver problemas.',
  path: '/soporte',
})

const pasos = [
  {
    icon: Power,
    titulo: 'Reinicia el equipo',
    texto:
      'Desconecta la ONT/router de la corriente, espera 30 segundos y vuelve a conectarlo. Espera 2 o 3 minutos a que encienda por completo.',
  },
  {
    icon: Cable,
    titulo: 'Revisa los cables',
    texto:
      'Verifica que el cable de fibra (delgado, normalmente verde o azul en la punta) no esté doblado ni desconectado, y que el cable de corriente esté firme.',
  },
  {
    icon: Lightbulb,
    titulo: 'Mira las luces',
    texto:
      'La luz PON debe estar fija. Si la luz LOS o “alarma” está en rojo, hay un problema en la fibra: repórtalo de inmediato.',
  },
  {
    icon: Wifi,
    titulo: 'Prueba cerca del router',
    texto:
      'Si solo falla el Wi-Fi, acércate al router o conéctate por cable para descartar interferencias o paredes.',
  },
  {
    icon: RefreshCw,
    titulo: 'Reinicia tu dispositivo',
    texto:
      'Apaga y enciende el celular, TV o computador. A veces el problema es del dispositivo y no de la conexión.',
  },
  {
    icon: Router,
    titulo: 'Mide tu velocidad',
    texto:
      'Haz el test de velocidad de esta página, preferiblemente por cable, y envíanos el resultado si es menor a lo contratado.',
  },
]

export default async function SoportePage() {
  const [sitio, faqs] = await Promise.all([getSiteSettings(), getFaqs('soporte')])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Soporte', path: '/soporte' }]}
        title="Soporte técnico"
        description="Reporta una falla, mide tu velocidad o sigue la guía rápida. Nuestro equipo técnico está en Sabanalarga."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.soporte()}
            ubicacion="soporte_hero"
          >
            Soporte por WhatsApp
          </WhatsAppLink>
          {sitio.telefonos[0] && (
            <CallLink
              numero={sitio.telefonos[0].numero}
              ubicacion="soporte_hero"
              variant="outline-light"
            >
              Llamar al {sitio.telefonos[0].numero}
            </CallLink>
          )}
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-primary-100">
          <Clock className="size-4 text-accent-400" aria-hidden />
          Horario de atención: {sitio.horario.dias}, {sitio.horario.texto}
          {/* TODO(WIPLUS): confirmar si hay horario extendido o de emergencia para soporte técnico. */}
        </p>
      </PageHero>

      <Section
        id="guia"
        title="Antes de reportar: guía rápida"
        description="La mayoría de las fallas se resuelven en minutos con estos pasos."
        tone="surface"
      >
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pasos.map(({ icon: Icon, titulo, texto }, i) => (
            <li key={titulo} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary-600 font-extrabold text-white">
                  {i + 1}
                </span>
                <Icon className="size-6 text-primary-600" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-primary-900">{titulo}</h3>
              <p className="mt-2 text-muted">{texto}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="reportar-falla"
        title="Reporta una falla"
        description="Si la falla continúa, cuéntanos. Te damos un número de ticket al instante."
      >
        <div className="mx-auto max-w-3xl">
          <FallaForm />
        </div>
      </Section>

      <Section id="test-de-velocidad" title="Test de velocidad" tone="surface">
        <div className="mx-auto max-w-4xl">
          <SpeedTest />
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section id="preguntas-frecuentes" title="Preguntas frecuentes de soporte">
          <FaqList faqs={faqs} />
        </Section>
      )}
    </>
  )
}
