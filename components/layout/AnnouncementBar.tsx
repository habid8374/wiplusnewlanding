import { ArrowRight, Info, Sparkles, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { cn } from '@/lib/cn'
import { enlaceSeguro, esRutaInterna } from '@/lib/safe-url'
import type { Aviso } from '@/lib/types'

const TONOS = {
  promo: {
    etiqueta: '¡Promo!',
    Icono: Sparkles,
    franja:
      'bg-gradient-to-r from-primary-900 via-primary-600 to-primary-900 text-white shadow-[inset_0_-3px_0_var(--color-accent-400)]',
    chip: 'bg-accent-400 text-primary-950',
    boton: 'bg-white text-primary-800 hover:bg-accent-300',
  },
  info: {
    etiqueta: 'Aviso',
    Icono: Info,
    franja: 'bg-primary-50 text-primary-900',
    chip: 'bg-primary-700 text-white',
    boton: 'bg-primary-700 text-white hover:bg-primary-800',
  },
  alerta: {
    etiqueta: 'Importante',
    Icono: TriangleAlert,
    franja: 'bg-amber-400 text-amber-950',
    chip: 'bg-amber-950 text-amber-50',
    boton: 'bg-amber-950 text-white hover:bg-amber-900',
  },
} as const

export function AnnouncementBar({ aviso }: { aviso: Aviso | null }) {
  if (!aviso) return null
  const t = TONOS[aviso.tono] ?? TONOS.promo
  const href = enlaceSeguro(aviso.enlace?.href)
  return (
    <div
      role="region"
      aria-label="Aviso"
      className={cn('relative isolate overflow-hidden', t.franja)}
    >
      {/* Brillo que cruza la franja en las promociones (se desactiva con prefers-reduced-motion) */}
      {aviso.tono === 'promo' && <span aria-hidden className="aviso-brillo" />}
      <div
        className={cn(
          'mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-4 py-2.5 text-center text-sm font-bold sm:text-base',
          aviso.tono === 'promo' && 'py-3 sm:text-[1.0625rem]',
        )}
      >
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold tracking-wide uppercase',
            t.chip,
          )}
        >
          <t.Icono className="size-3.5" aria-hidden />
          {t.etiqueta}
        </span>
        <ExampleBadge show={aviso.ejemplo} />
        <span className="text-pretty">{aviso.texto}</span>
        {href && (
          <Link
            {...(esRutaInterna(href) ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            href={href}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold shadow-sm transition-colors',
              t.boton,
            )}
          >
            {aviso.enlace?.texto || 'Ver más'}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  )
}
