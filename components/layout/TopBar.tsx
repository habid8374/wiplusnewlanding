import { Clock, FileText, Phone } from 'lucide-react'
import Link from 'next/link'
import { CallLink } from '@/components/analytics/TrackedLinks'
import { FacebookIcon } from '@/components/icons/brands'
import { Container } from '@/components/ui/Container'
import type { SiteSettings } from '@/lib/types'

export function TopBar({ sitio }: { sitio: SiteSettings }) {
  const tel = sitio.telefonos[0]
  return (
    <div className="bg-primary-950 text-xs text-primary-100 sm:text-sm">
      <Container className="flex min-h-9 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 py-1 whitespace-nowrap sm:gap-x-4">
        <p className="flex items-center gap-1.5">
          <Clock className="size-4 shrink-0 text-accent-400" aria-hidden />
          <span>
            <span className="hidden sm:inline">Atención: </span>
            {sitio.horario.texto}
          </span>
        </p>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/usuario#radicar-pqr"
            className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white hover:bg-white/20 sm:gap-1.5 sm:px-2.5"
          >
            <FileText className="size-4 text-accent-400" aria-hidden />
            <span className="sm:hidden">PQR</span>
            <span className="hidden sm:inline">Radicar PQR</span>
          </Link>
          {tel && (
            <CallLink
              numero={tel.numero}
              ubicacion="barra_superior"
              className="flex items-center gap-1.5 font-semibold text-white hover:underline"
            >
              <Phone className="size-4 text-accent-400" aria-hidden />
              {tel.numero}
            </CallLink>
          )}
          {sitio.redes.facebook && (
            <a
              href={sitio.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <FacebookIcon className="size-4" />
              <span className="sr-only">Facebook de WIPLUS (abre en una nueva pestaña)</span>
            </a>
          )}
        </div>
      </Container>
    </div>
  )
}
