import {
  CalendarClock,
  FileSearch,
  Info,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import type { Metadata } from 'next'
import { PortalClientesLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { FaqList } from '@/components/sections/FaqList'
import { CopiarTexto } from '@/components/ui/CopiarTexto'
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
          <ul className="grid gap-5 lg:grid-cols-2">
            {pagos.medios.map((m) =>
              m.cuenta ? (
                <li
                  key={m.id}
                  className="rounded-3xl border-2 border-primary-200 bg-white p-6 shadow-card sm:p-8 lg:col-span-2"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-bold tracking-wider text-primary-600 uppercase">
                        <Landmark className="size-5" aria-hidden />
                        {m.nombre}
                      </p>
                      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm text-muted">Banco</dt>
                          <dd className="text-lg font-bold text-primary-900">{m.cuenta.banco}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">Tipo de cuenta</dt>
                          <dd className="text-lg font-bold text-primary-900">{m.cuenta.tipo}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">Número de cuenta</dt>
                          <dd
                            className="text-3xl font-extrabold tracking-wide text-primary-900 tabular-nums"
                            data-testid="numero-cuenta"
                          >
                            {m.cuenta.numero}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">Titular</dt>
                          <dd className="text-lg font-bold text-primary-900">{m.cuenta.titular}</dd>
                        </div>
                      </dl>
                      <p className="mt-4 text-muted">{m.descripcion}</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-3">
                      <CopiarTexto
                        texto={m.cuenta.numero}
                        etiqueta="Copiar número de cuenta"
                        banco={m.cuenta.banco}
                      />
                      <WhatsAppLink
                        numero={sitio.whatsapp}
                        mensaje={mensajesWhatsApp.comprobante()}
                        ubicacion="pagos_comprobante"
                      >
                        Enviar comprobante por WhatsApp
                      </WhatsAppLink>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={m.id} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                  <Wallet className="size-8 text-primary-600" aria-hidden />
                  <h3 className="mt-3 text-lg font-bold text-primary-900">
                    {m.nombre} <ExampleBadge show={m.ejemplo} />
                  </h3>
                  <p className="mt-2 text-muted">{m.descripcion}</p>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="text-lg text-muted">
            Consulta los medios de pago disponibles por WhatsApp.
          </p>
        )}
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
