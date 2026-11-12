'use client'

import { useEffect, useState } from 'react'
import { esNavidad } from '@/lib/temporada'
import { NieveCanvas } from './NieveCanvas'

const CLAVE_VISTA_PREVIA = 'wiplus-navidad'

/**
 * Activa la temporada navideña en el navegador:
 * - marca <html data-navidad> para que el CSS muestre el saludo, la nieve del hero y el gorro;
 * - dibuja la nieve y la guirnalda de fibra (solo si la persona no pidió reducir el movimiento).
 * Fuera de las fechas de lib/temporada.ts no hace nada (salvo la vista previa con ?navidad=1).
 */
export function Navidad() {
  const [animar, setAnimar] = useState(false)

  useEffect(() => {
    let previa = false
    try {
      const q = new URLSearchParams(window.location.search).get('navidad')
      if (q === '1') sessionStorage.setItem(CLAVE_VISTA_PREVIA, '1')
      if (q === '0') sessionStorage.removeItem(CLAVE_VISTA_PREVIA)
      previa = sessionStorage.getItem(CLAVE_VISTA_PREVIA) === '1'
    } catch {
      // sin sessionStorage (modo privado estricto): solo cuenta la fecha
    }
    if (!esNavidad() && !previa) return
    document.documentElement.dataset.navidad = ''
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualizar = () => setAnimar(!quieto.matches)
    actualizar()
    quieto.addEventListener('change', actualizar)
    return () => {
      quieto.removeEventListener('change', actualizar)
      delete document.documentElement.dataset.navidad
    }
  }, [])

  return animar ? <NieveCanvas /> : null
}
