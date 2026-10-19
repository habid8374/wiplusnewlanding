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
      className="fixed bottom-4 left-4 z-40 w-[min(19rem,calc(100vw-7rem))] origin-bottom-left animate-pop-entra rounded-2xl bg-gradient-to-br from-pink-700 to-pink-600 p-4 pr-10 text-white shadow-card-hover ring-1 ring-white/30 sm:bottom-6 sm:left-6"
    >
      <button
        type="button"
        onClick={cerrar}
        className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white"
      >
        <X className="size-4" aria-hidden />
        <span className="sr-only">Cerrar</span>
      </button>
      <p className="flex items-center gap-2 text-xs font-extrabold tracking-wide uppercase">
        <Ribbon className="size-5 shrink-0" aria-hidden />
        19 de octubre
      </p>
      <p className="mt-1.5 text-base leading-snug font-extrabold">
        Día Internacional de la Lucha contra el Cáncer de Mama
      </p>
      <p className="mt-1.5 text-sm leading-snug text-white">
        La detección temprana salva vidas. Hazte el autoexamen y consulta a tu médico. WIPLUS se une
        a esta causa. 💗
      </p>
    </aside>
  )
}
