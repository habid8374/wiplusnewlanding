'use client'

import { Pause, Play } from 'lucide-react'
import Image, { getImageProps, type StaticImageData } from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import rack from '@/public/hero/fibra-rack-conectores.jpg'
import luz from '@/public/hero/fibra-luz-azul.jpg'
import puntas from '@/public/hero/fibra-puntas-luz.jpg'

/**
 * Fondo del hero: 3 fotos de fibra óptica con fundido cruzado en CSS (sin librería de carrusel).
 * En pantallas ≥ 768 px: la primera se pide con prioridad alta (LCP) y las otras dos se montan
 * cuando la página termina de cargar. En celular no se descargan fotos: se ve una versión muy
 * borrosa y liviana de la primera (su placeholder de ~1 KB) bajo la capa de color. Así el LCP del
 * celular es el título y no una foto de 40 KB en redes lentas.
 * Con prefers-reduced-motion queda fija la primera.
 * Botón de pausa por WCAG 2.2.2 (contenido en movimiento de más de 5 s).
 */
const SLIDES: { src: StaticImageData; position: string }[] = [
  { src: puntas, position: 'object-[65%_center]' },
  { src: luz, position: 'object-[75%_center]' },
  { src: rack, position: 'object-[60%_center]' },
]

/** GIF transparente de 1 × 1: en celular el <picture> no descarga la foto. */
const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const ESCRITORIO = '(min-width: 768px)'

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
    // En celular solo se ve el fondo borroso: no se montan más fotos.
    if (!window.matchMedia(ESCRITORIO).matches) return
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
        <Primera />
        {desfase !== null &&
          SLIDES.slice(1).map((s, n) => {
            const i = n + 1
            return (
              <Image
                key={s.src.src}
                src={s.src}
                alt=""
                fill
                loading="lazy"
                fetchPriority="low"
                sizes="100vw"
                quality={50}
                className={cn('hero-slide object-cover', s.position)}
                // Se montan tarde: se sincronizan con el ciclo del fundido que ya empezó.
                style={{ animationDelay: `${i * 6 - 1 - desfase}s` }}
              />
            )
          })}
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

/** Primera foto: <picture> con la foto real desde 768 px y un píxel transparente en celular. */
function Primera() {
  const { src, position } = SLIDES[0]
  const {
    props: { srcSet, sizes, style, ...img },
  } = getImageProps({
    src,
    alt: '',
    fill: true,
    sizes: '100vw',
    quality: 50,
    loading: 'eager',
    fetchPriority: 'high',
  })
  return (
    <picture>
      <source media={ESCRITORIO} srcSet={srcSet} sizes={sizes} />
      <img
        {...img}
        src={PIXEL}
        alt=""
        className={cn('hero-slide object-cover', position)}
        style={{
          ...style,
          animationDelay: '-1s',
          // Fondo borroso (placeholder de ~1 KB): es lo que se ve en celular.
          backgroundImage: `url("${src.blurDataURL}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  )
}
