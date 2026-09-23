import { Clock, Phone } from 'lucide-react'
import { CallLink } from '@/components/analytics/TrackedLinks'
import { FacebookIcon } from '@/components/icons/brands'
import { Container } from '@/components/ui/Container'
import type { SiteSettings } from '@/lib/types'

export function TopBar({ sitio }: { sitio: SiteSettings }) {
  const tel = sitio.telefonos[0]
  return (
    <div className="bg-primary-950 text-primary-100 text-sm">
      <Container className="flex min-h-9 items-center justify-between gap-4 py-1">
        <p className="flex items-center gap-1.5">
          <Clock className="text-accent-400 size-4 shrink-0" aria-hidden />
          <span>
            <span className="hidden sm:inline">Atención: </span>
            {sitio.horario.texto}
          </span>
        </p>
        <div className="flex items-center gap-4">
          {tel && (
            <CallLink
              numero={tel.numero}
              ubicacion="barra_superior"
              className="flex items-center gap-1.5 font-semibold text-white hover:underline"
            >
              <Phone className="text-accent-400 size-4" aria-hidden />
              {tel.numero}
            </CallLink>
          )}
          {sitio.redes.facebook && (
            <a
              href={sitio.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white"
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
