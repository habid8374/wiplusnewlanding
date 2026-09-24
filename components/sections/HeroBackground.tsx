'use client'

import { Pause, Play } from 'lucide-react'
import Image, { type StaticImageData } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import rack from '@/public/hero/fibra-rack-conectores.jpg'
import luz from '@/public/hero/fibra-luz-azul.jpg'
import puntas from '@/public/hero/fibra-puntas-luz.jpg'

/**
 * Fondo del hero: 3 fotos de fibra óptica con fundido cruzado en CSS (sin librería de carrusel).
 * Solo la primera carga con prioridad (LCP). Con prefers-reduced-motion queda fija la primera.
 * Botón de pausa por WCAG 2.2.2 (contenido en movimiento de más de 5 s).
 */
const SLIDES: { src: StaticImageData; position: string }[] = [
  { src: puntas, position: 'object-[65%_center]' },
  { src: luz, position: 'object-[75%_center]' },
  { src: rack, position: 'object-[60%_center]' },
]

export function HeroBackground() {
  const [pausado, setPausado] = useState(false)
  return (
    <>
      <div
        aria-hidden
        className="hero-slides absolute inset-0 -z-20"
        data-paused={pausado || undefined}
      >
        {SLIDES.map((s, i) => (
          <Image
            key={s.src.src}
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            placeholder={i === 0 ? 'blur' : 'empty'}
            sizes="100vw"
            quality={50}
            className={cn('hero-slide object-cover', s.position)}
            style={{ animationDelay: `${i * 6 - 1}s` }}
          />
        ))}
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
