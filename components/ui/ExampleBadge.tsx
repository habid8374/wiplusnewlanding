import { SHOW_EXAMPLES } from '@/lib/env'
import { cn } from '@/lib/cn'

/** Etiqueta visible para contenido de relleno pendiente de datos reales (nunca en producción). */
export function ExampleBadge({ show, className }: { show?: boolean; className?: string }) {
  if (!show || !SHOW_EXAMPLES) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 align-middle text-xs font-bold tracking-wide text-amber-900 ring-1 ring-amber-300',
        className,
      )}
      title="Contenido de ejemplo: pendiente de datos reales de WIPLUS"
    >
      [EJEMPLO]
    </span>
  )
}
