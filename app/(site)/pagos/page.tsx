import { CalendarClock, FileSearch, Info, ReceiptText, ShieldCheck, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import { PortalClientesLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
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
    'Consulta y paga tu factura de internet WIPLUS en el portal de clientes. Medios de pago, fechas de corte y cómo enviar tu comprobante.',
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
        description="Consulta tu factura y paga en línea en nuestro portal de clientes, o usa los demás medios de pago."
      >
        {sitio.portalClientes && (
          <PortalClientesLink
            href={sitio.portalClientes}
            ubicacion="pagos_hero"
            className="min-h-14 px-8 text-lg"
          >
            <ReceiptText className="size-6 shrink-0" aria-hidden />
            Consultar y pagar mi factura
          </PortalClientesLink>
        )}
      </PageHero>

      {sitio.portalClientes && (
        <Section id="portal-clientes" align="left">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 p-8 text-white shadow-xl sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent-500/20 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold tracking-wider text-accent-300 uppercase">
                  Portal de clientes
                </p>
                <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  Tu factura y tus pagos, en un solo lugar
                </h2>
                <ul className="mt-6 grid gap-3 text-primary-100 sm:grid-cols-3">
                  <li className="flex items-start gap-2">
                    <FileSearch className="mt-0.5 size-5 shrink-0 text-accent-400" aria-hidden />
                    Consulta tu factura y tu saldo
                  </li>
                  <li className="flex items-start gap-2">
                    <Wallet className="mt-0.5 size-5 shrink-0 text-accent-400" aria-hidden />
                    Paga en línea sin filas
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent-400" aria-hidden />
                    Plataforma segura de WispHub
                  </li>
                </ul>
              </div>
              <PortalClientesLink
                href={sitio.portalClientes}
                ubicacion="pagos_portal"
                className="min-h-14 bg-white bg-none px-8 text-lg text-primary-900 hover:bg-primary-50"
              >
                <ReceiptText className="size-6 shrink-0" aria-hidden />
                Entrar al portal
              </PortalClientesLink>
            </div>
          </div>
        </Section>
      )}

      <Section id="medios" title="Otros medios de pago" tone="surface" align="left">
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

      <Section id="fechas" title="Fechas de corte y recomendaciones" align="left">
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

      {faqs.length > 0 && (
        <Section id="preguntas-frecuentes" title="Preguntas frecuentes" tone="surface">
          <FaqList faqs={faqs} />
        </Section>
      )}
    </>
  )
}
