import { CalendarClock, CreditCard, Info, Sparkles, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { FaqList } from '@/components/sections/FaqList'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getFaqs, getInfoPagos, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Medios de pago y fechas de corte',
  description:
    'Conoce los medios de pago de tu servicio de internet WIPLUS, las fechas de corte y cómo enviar tu comprobante. Muy pronto podrás pagar en línea.',
  path: '/pagos',
})

export default async function PagosPage() {
  const [sitio, pagos, faqs] = await Promise.all([
    getSiteSettings(),
    getInfoPagos(),
    getFaqs('pagos'),
  ])
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Pagos', path: '/pagos' }]}
        title="Paga tu servicio"
        description="Medios de pago disponibles, fechas de corte y cómo reportar tu pago."
      />

      <Section id="medios" title="Medios de pago" align="left">
        {pagos.medios.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagos.medios.map((m) => (
              <li key={m.id} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <Wallet className="size-8 text-primary-600" aria-hidden />
                <h3 className="mt-3 text-lg font-bold text-primary-900">
                  {m.nombre} <ExampleBadge show={m.ejemplo} />
                </h3>
                <p className="mt-2 text-muted">{m.descripcion}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-muted">
            Consulta los medios de pago disponibles por WhatsApp.
          </p>
        )}
        <WhatsAppLink
          numero={sitio.whatsapp}
          mensaje={mensajesWhatsApp.pagos()}
          ubicacion="pagos"
          className="mt-8"
        >
          Pedir datos de pago por WhatsApp
        </WhatsAppLink>
      </Section>

      <Section id="fechas" title="Fechas de corte y recomendaciones" tone="surface" align="left">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <CalendarClock className="size-8 text-primary-600" aria-hidden />
            <h3 className="mt-3 text-lg font-bold text-primary-900">
              Fechas de corte <ExampleBadge show={pagos.fechasEjemplo} />
            </h3>
            <p className="mt-2 text-muted">{pagos.fechasCorte}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <Info className="size-8 text-primary-600" aria-hidden />
            <h3 className="mt-3 text-lg font-bold text-primary-900">Ten en cuenta</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-muted">
              {pagos.notas.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="pago-en-linea" align="left">
        <div className="flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-br from-primary-800 to-primary-950 p-8 text-white sm:flex-row sm:items-center">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <CreditCard className="size-8 text-accent-400" aria-hidden />
          </span>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-accent-300 uppercase">
              <Sparkles className="size-4" aria-hidden /> Próximamente
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">Paga en línea desde tu celular</h2>
            <p className="mt-2 text-primary-100">
              Estamos preparando el portal de clientes para que consultes y pagues tu factura con
              PSE y billeteras digitales, sin salir de casa.
            </p>
          </div>
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
