'use client'

import { RefreshCw, TriangleAlert } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { buttonClasses } from '@/components/ui/button-styles'
import { Container } from '@/components/ui/Container'

/**
 * Error inesperado al mostrar una página (OWASP A10): mensaje amable, sin detalles técnicos
 * (en producción Next solo entrega un código de referencia), y salidas claras.
 */
export default function ErrorPagina({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Container className="py-16 text-center sm:py-24">
      <TriangleAlert className="mx-auto size-16 text-amber-500" aria-hidden />
      <h1 className="mt-4 text-3xl font-extrabold text-primary-900 sm:text-4xl">
        Algo salió mal al cargar esta página
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
        Intenta de nuevo en unos segundos. Si continúa, escríbenos por WhatsApp desde el botón
        verde.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClasses('primary')}>
          <RefreshCw className="size-5" aria-hidden />
          Intentar de nuevo
        </button>
        <ButtonLink href="/" variant="outline">
          Ir al inicio
        </ButtonLink>
      </div>
    </Container>
  )
}
