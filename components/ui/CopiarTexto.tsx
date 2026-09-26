'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { track } from '@/lib/analytics'

/** Botón para copiar un dato (p. ej. el número de cuenta) con aviso accesible. */
export function CopiarTexto({
  texto,
  etiqueta,
  banco,
}: {
  texto: string
  etiqueta: string
  banco: string
}) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto)
          setCopiado(true)
          track('copiar_cuenta', { banco })
          setTimeout(() => setCopiado(false), 2500)
        } catch {
          setCopiado(false)
        }
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary-600 px-4 font-bold text-primary-700 hover:bg-primary-50"
    >
      {copiado ? <Check className="size-5" aria-hidden /> : <Copy className="size-5" aria-hidden />}
      <span aria-live="polite">{copiado ? '¡Copiado!' : etiqueta}</span>
    </button>
  )
}
