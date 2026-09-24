import Link from 'next/link'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { cn } from '@/lib/cn'
import type { Aviso } from '@/lib/types'

export function AnnouncementBar({ aviso }: { aviso: Aviso | null }) {
  if (!aviso) return null
  return (
    <div
      role="region"
      aria-label="Aviso"
      className={cn(
        'px-4 py-2 text-center text-sm font-semibold',
        aviso.tono === 'promo' && 'bg-accent-500 text-primary-950',
        aviso.tono === 'info' && 'bg-primary-100 text-primary-900',
        aviso.tono === 'alerta' && 'bg-amber-100 text-amber-950',
      )}
    >
      <ExampleBadge show={aviso.ejemplo} className="mr-2" />
      {aviso.texto}
      {aviso.enlace?.href && (
        <Link href={aviso.enlace.href} className="ml-2 underline underline-offset-2">
          {aviso.enlace.texto || 'Ver más'}
        </Link>
      )}
    </div>
  )
}
