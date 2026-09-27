'use client'

import { Pause, Play } from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import rack from '@/public/hero/fibra-rack-conectores.jpg'
import luz from '@/public/hero/fibra-luz-azul.jpg'
import puntas from '@/public/hero/fibra-puntas-luz.jpg'

/**
 * Fondo del hero: 3 fotos de fibra óptica con fundido cruzado en CSS (sin librería de carrusel).
 * Solo la primera carga con prioridad (LCP); las otras dos se montan después de que la página
 * termina de cargar, para no competir con ella por la red. Con prefers-reduced-motion queda fija la primera.
 * Botón de pausa por WCAG 2.2.2 (contenido en movimiento de más de 5 s).
 */
const SLIDES: { src: StaticImageData; position: string }[] = [
  { src: puntas, position: 'object-[65%_center]' },
  { src: luz, position: 'object-[75%_center]' },
  { src: rack, position: 'object-[60%_center]' },
]

export function HeroBackground() {
  const [pausado, setPausado] = useState(false)
  // Segundos transcurridos desde el inicio del fundido cuando se montan las fotos 2 y 3 (null = aún no).
  const [desfase, setDesfase] = useState<number | null>(null)
  const inicio = useRef(0)
  useEffect(() => {
    inicio.current = performance.now()
    let t: ReturnType<typeof setTimeout>
    const montar = () => {
      t = setTimeout(() => setDesfase((performance.now() - inicio.current) / 1000), 1500)
    }
    if (document.readyState === 'complete') montar()
    else window.addEventListener('load', montar, { once: true })
    return () => {
      window.removeEventListener('load', montar)
      clearTimeout(t)
    }
  }, [])
  return (
    <>
      <div
        aria-hidden
        className="hero-slides absolute inset-0 -z-20"
        data-paused={pausado || undefined}
      >
        {SLIDES.map((s, i) =>
          i > 0 && desfase === null ? null : (
            <Image
              key={s.src.src}
              src={s.src}
              alt=""
              fill
              // Next 16: `priority` está obsoleto; la primera foto (LCP) se pide de inmediato y con prioridad alta.
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              placeholder={i === 0 ? 'blur' : 'empty'}
              // Va bajo una capa de color: en celular basta una imagen más liviana (mejor LCP).
              sizes="(max-width: 768px) 60vw, 100vw"
              quality={50}
              className={cn('hero-slide object-cover', s.position)}
              // Las fotos que se montan tarde se sincronizan con el ciclo que ya empezó.
              style={{ animationDelay: `${i * 6 - 1 - (i > 0 ? (desfase ?? 0) : 0)}s` }}
            />
          ),
        )}
      </div>
      <button
        type="button"
        onClick={() => setPausado((p) => !p)}
        aria-pressed={pausado}
        className="absolute bottom-4 left-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-primary-950/60 text-white ring-1 ring-white/30 backdrop-blur-sm hover:bg-primary-950/80 motion-reduce:hidden sm:left-6 lg:left-8"
      >
        {pausado ? (
          <Play className="size-4" aria-hidden />
        ) : (
          <Pause className="size-4" aria-hidden />
        )}
        <span className="sr-only">
          {pausado ? 'Reanudar la animación de fondo' : 'Pausar la animación de fondo'}
        </span>
      </button>
    </>
  )
}
