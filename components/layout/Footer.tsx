import { Clock, FileText, LockKeyhole, Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { FacebookIcon } from '@/components/icons/brands'
import { Container } from '@/components/ui/Container'
import { legalNav, mainNav } from '@/lib/nav'
import type { SiteSettings } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'
import axentia from '@/public/axentia/axentia-logo.png'
import icono from '@/public/brand/wiplus-icono-app.png'

export function Footer({ sitio }: { sitio: SiteSettings }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-primary-950 text-primary-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            aria-label="WIPLUS Comunicaciones, ir al inicio"
          >
            <Image src={icono} alt="" width={48} height={48} className="size-12 rounded-xl" />
            <span className="text-lg leading-tight font-extrabold text-white">
              WIPLUS
              <span className="block text-xs font-semibold tracking-[0.2em] text-primary-200">
                COMUNICACIONES
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            Internet por fibra óptica para hogares y empresas en Sabanalarga y Luruaco, Atlántico.
            Más de {sitio.experienciaAnios} años conectando la región.
          </p>
          {sitio.redes.facebook && (
            <a
              href={sitio.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-white hover:underline"
            >
              <FacebookIcon className="size-5" />
              Síguenos en Facebook
              <span className="sr-only"> (abre en una nueva pestaña)</span>
            </a>
          )}
        </div>

        <div>
          <h2 className="font-bold text-white">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {sitio.telefonos.map((t) => (
              <li key={t.numero}>
                <CallLink
                  numero={t.numero}
                  ubicacion="footer"
                  className="inline-flex items-center gap-2 hover:text-white hover:underline"
                >
                  <Phone className="size-4 text-accent-400" aria-hidden />
                  {t.numero}
                </CallLink>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${sitio.correo}`}
                className="inline-flex items-center gap-2 [overflow-wrap:anywhere] hover:text-white hover:underline"
              >
                <Mail className="size-4 shrink-0 text-accent-400" aria-hidden />
                {sitio.correo}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
              <span>
                {sitio.direccion.calle}, {sitio.direccion.municipio}, {sitio.direccion.departamento}
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
              <span>
                {sitio.horario.dias}: {sitio.horario.texto}
              </span>
            </li>
          </ul>
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.general()}
            ubicacion="footer"
            size="sm"
            className="mt-5"
          >
            WhatsApp
          </WhatsAppLink>
          <Link
            href="/pqr"
            className="mt-3 flex w-fit items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:border-white/50 hover:bg-white/10"
          >
            <FileText className="size-4 text-accent-400" aria-hidden />
            Radicar PQR
          </Link>
        </div>

        <nav aria-label="Secciones del sitio">
          <h2 className="font-bold text-white">El sitio</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Información legal">
          <h2 className="font-bold text-white">Legal</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {legalNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.sic.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                Superintendencia de Industria y Comercio
              </a>
            </li>
            <li>
              <a
                href="https://www.crcom.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                Comisión de Regulación de Comunicaciones
              </a>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 pt-6 pb-24 text-xs text-primary-200 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p>
              © {year} {sitio.razonSocial ?? sitio.nombre}
              {sitio.nit ? ` · NIT ${sitio.nit}` : ''}. Todos los derechos reservados.
            </p>
            {/* Panel de contenido (Sanity Studio). <a> y no <Link>: /studio es una SPA aparte. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/studio"
              rel="nofollow"
              className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/20 px-3 py-1 font-semibold text-primary-100 hover:border-white/40 hover:text-white"
            >
              <LockKeyhole className="size-3.5" aria-hidden />
              Administrar contenido
            </a>
          </div>
          <p className="inline-flex items-center gap-2">
            Powered by
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Image
                src={axentia}
                alt=""
                width={28}
                height={24}
                className="h-6 w-auto rounded bg-white p-0.5"
              />
              Axentia Technologies
            </span>
          </p>
        </Container>
      </div>
    </footer>
  )
}
