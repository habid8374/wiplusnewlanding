'use client'

import { Heart, Ribbon, X } from 'lucide-react'
import { type CSSProperties, useEffect, useState } from 'react'

/**
 * Tarjeta de fecha especial: 19 de octubre, Día Internacional de la Lucha contra el Cáncer de
 * Mama. Solo se ve ese día (hora de Colombia) y se oculta sola a la medianoche, aunque la página
 * esté en caché: la fecha se revisa en el navegador. Fija en la esquina (no mueve el contenido).
 */
const INICIO = Date.parse('2026-10-19T00:00:00-05:00')
const FIN = Date.parse('2026-10-20T00:00:00-05:00')
const CLAVE = 'wiplus-tarjeta-cancer-mama-2026'

/** Corazones del mini reel: posición, tamaño, retraso, duración, desvío y giro. */
const CORAZONES = [
  { x: '8%', s: 14, d: '0s', t: '4.2s', dx: '10px', r: '-14deg', color: 'text-rose-300' },
  { x: '20%', s: 10, d: '1.6s', t: '3.6s', dx: '-8px', r: '10deg', color: 'text-pink-300' },
  { x: '32%', s: 16, d: '0.8s', t: '4.8s', dx: '14px', r: '18deg', color: 'text-rose-400' },
  { x: '62%', s: 12, d: '2.2s', t: '4s', dx: '-12px', r: '-10deg', color: 'text-pink-300' },
  { x: '74%', s: 18, d: '0.4s', t: '5s', dx: '8px', r: '14deg', color: 'text-rose-300' },
  { x: '86%', s: 11, d: '3s', t: '3.8s', dx: '-10px', r: '-18deg', color: 'text-rose-400' },
  { x: '46%', s: 9, d: '2.8s', t: '4.4s', dx: '6px', r: '8deg', color: 'text-pink-400' },
]

export function TarjetaFecha() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const ahora = Date.now()
    if (ahora < INICIO || ahora >= FIN) return
    try {
      if (sessionStorage.getItem(CLAVE) === '1') return
    } catch {
      // Almacenamiento bloqueado: se muestra igual.
    }
    // Se difiere para no actualizar el estado dentro del efecto de forma síncrona.
    queueMicrotask(() => setVisible(true))
    const t = setTimeout(() => setVisible(false), FIN - ahora)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  const cerrar = () => {
    setVisible(false)
    try {
      sessionStorage.setItem(CLAVE, '1')
    } catch {
      // Sin almacenamiento: solo se oculta en esta vista.
    }
  }

  return (
    <aside
      aria-label="Día Internacional de la Lucha contra el Cáncer de Mama"
      className="fixed bottom-4 left-4 z-40 w-[min(19rem,calc(100vw-7rem))] origin-bottom-left animate-pop-entra overflow-hidden rounded-2xl bg-gradient-to-br from-white via-rose-50 to-pink-100 text-rose-950 shadow-[0_10px_30px_-12px_rgb(190_18_60/0.35)] ring-1 ring-rose-200/80 sm:bottom-6 sm:left-6"
    >
      {/* Mini “reel” decorativo: corazones que suben y el lazo que late. */}
      <div
        aria-hidden
        className="relative h-24 overflow-hidden bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200"
      >
        <span className="absolute inset-x-3 top-2 h-0.5 overflow-hidden rounded-full bg-white/70 motion-reduce:hidden">
          <span className="reel-progreso block h-full w-full rounded-full bg-rose-400" />
        </span>
        {CORAZONES.map((c, i) => (
          <Heart
            key={i}
            fill="currentColor"
            strokeWidth={0}
            className={`corazon-sube absolute -bottom-3 ${c.color}`}
            style={
              {
                left: c.x,
                width: c.s,
                height: c.s,
                '--d': c.d,
                '--t': c.t,
                '--dx': c.dx,
                '--r': c.r,
              } as CSSProperties
            }
          />
        ))}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="lazo-late inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm ring-1 ring-rose-200">
            <Ribbon className="size-6" />
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={cerrar}
        className="absolute top-3.5 right-2 inline-flex size-8 items-center justify-center rounded-full bg-white/80 text-rose-600 transition-colors hover:bg-white hover:text-rose-800"
      >
        <X className="size-4" aria-hidden />
        <span className="sr-only">Cerrar</span>
      </button>
      <div className="p-4 pt-3">
        <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-rose-700 uppercase">
          19 de octubre
        </p>
        <p className="mt-1.5 text-[0.95rem] leading-snug font-bold text-rose-900">
          Día Internacional de la Lucha contra el Cáncer de Mama
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-rose-950/80">
          La detección temprana salva vidas. Hazte el autoexamen y consulta a tu médico. WIPLUS se
          une a esta causa.
        </p>
      </div>
    </aside>
  )
}
