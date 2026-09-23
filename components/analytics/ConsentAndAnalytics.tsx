'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { Cookie } from 'lucide-react'
import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { buttonClasses } from '@/components/ui/button-styles'

/**
 * Aviso de cookies simple + carga condicional de GA4.
 * GA solo se carga si el visitante acepta. La decisión se guarda en localStorage.
 */
const KEY = 'wiplus-consentimiento-cookies'
type Consent = 'aceptado' | 'rechazado' | null

const listeners = new Set<() => void>()
function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}
function read(): Consent {
  try {
    return (localStorage.getItem(KEY) as Consent) ?? null
  } catch {
    return null
  }
}
function write(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    /* almacenamiento no disponible: la decisión dura solo esta visita */
  }
  listeners.forEach((l) => l())
}

export function ConsentAndAnalytics({ gaId }: { gaId: string }) {
  // "pendiente" en el servidor para no pintar el aviso durante la hidratación.
  const consent = useSyncExternalStore<Consent | 'pendiente'>(subscribe, read, () => 'pendiente')

  return (
    <>
      {consent === 'aceptado' && gaId && <GoogleAnalytics gaId={gaId} />}
      {consent === null && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed inset-x-2 bottom-2 z-[60] mx-auto max-w-xl rounded-2xl border border-line bg-white p-3 shadow-card-hover sm:bottom-6 sm:p-5"
        >
          <div className="flex gap-3">
            <Cookie
              className="mt-0.5 hidden size-6 shrink-0 text-primary-600 sm:block"
              aria-hidden
            />
            <p className="text-xs text-ink sm:text-sm">
              Usamos cookies de analítica para mejorar el sitio. Puedes aceptarlas o rechazarlas.
              Más información en nuestra{' '}
              <Link href="/politica-de-datos" className="font-semibold text-primary-700 underline">
                política de datos
              </Link>
              .
            </p>
          </div>
          <div className="mt-2 flex justify-end gap-2 sm:mt-4">
            <button
              type="button"
              onClick={() => write('rechazado')}
              className={buttonClasses('ghost', 'sm')}
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => write('aceptado')}
              className={buttonClasses('primary', 'sm')}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
