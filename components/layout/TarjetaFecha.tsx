'use client'

import { Ribbon, X } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Tarjeta de fecha especial: 19 de octubre, Día Internacional de la Lucha contra el Cáncer de
 * Mama. Solo se ve ese día (hora de Colombia) y se oculta sola a la medianoche, aunque la página
 * esté en caché: la fecha se revisa en el navegador. Fija en la esquina (no mueve el contenido).
 */
const INICIO = Date.parse('2026-10-19T00:00:00-05:00')
const FIN = Date.parse('2026-10-20T00:00:00-05:00')
const CLAVE = 'wiplus-tarjeta-cancer-mama-2026'

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
      className="fixed bottom-4 left-4 z-40 w-[min(19rem,calc(100vw-7rem))] origin-bottom-left animate-pop-entra overflow-hidden rounded-2xl bg-gradient-to-br from-white via-rose-50 to-pink-100 p-4 pr-10 text-rose-950 shadow-[0_10px_30px_-12px_rgb(190_18_60/0.35)] ring-1 ring-rose-200/80 sm:bottom-6 sm:left-6"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-rose-300" />
      <button
        type="button"
        onClick={cerrar}
        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full text-rose-500 transition-colors hover:bg-rose-100 hover:text-rose-700"
      >
        <X className="size-4" aria-hidden />
        <span className="sr-only">Cerrar</span>
      </button>
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 ring-1 ring-rose-200"
        >
          <Ribbon className="size-4" />
        </span>
        <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-rose-700 uppercase">
          19 de octubre
        </p>
      </div>
      <p className="mt-2.5 text-[0.95rem] leading-snug font-bold text-rose-900">
        Día Internacional de la Lucha contra el Cáncer de Mama
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-rose-950/80">
        La detección temprana salva vidas. Hazte el autoexamen y consulta a tu médico. WIPLUS se une
        a esta causa.
      </p>
    </aside>
  )
}
