'use client'

import { Gauge } from 'lucide-react'
import { useState } from 'react'
import { buttonClasses } from '@/components/ui/button-styles'

/** Test de velocidad embebido (OpenSpeedTest) que se carga solo al pulsar el botón. */
export function SpeedTest() {
  const [activo, setActivo] = useState(false)
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/10]">
        {activo ? (
          <iframe
            title="Test de velocidad de internet (OpenSpeedTest)"
            src="https://openspeedtest.com/speedtest"
            className="absolute inset-0 size-full border-0"
            allow="fullscreen"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary-900 to-primary-700 p-6 text-center text-white">
            <Gauge className="size-14 text-accent-400" aria-hidden />
            <p className="max-w-sm text-lg">
              Mide la velocidad de tu conexión. Para un resultado más preciso, conéctate por cable y
              cierra otras descargas.
            </p>
            <button
              type="button"
              onClick={() => setActivo(true)}
              className={buttonClasses('light', 'lg')}
            >
              Iniciar test de velocidad
            </button>
          </div>
        )}
      </div>
      <p className="px-4 py-3 text-sm text-muted">
        ¿No carga? Prueba en{' '}
        <a
          href="https://speed.cloudflare.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary-700 underline"
        >
          speed.cloudflare.com
        </a>{' '}
        o{' '}
        <a
          href="https://fast.com/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary-700 underline"
        >
          fast.com
        </a>
        .
      </p>
    </div>
  )
}
