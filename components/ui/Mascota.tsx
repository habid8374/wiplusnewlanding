import Image from 'next/image'
import { cn } from '@/lib/cn'
import heroe from '@/public/mascota/wiplus-heroe.png'
import heroeNavidad from '@/public/mascota/wiplus-heroe-navidad.png'

/**
 * Superhéroe de WIPLUS (personaje de su publicidad). Decorativo: alt vacío.
 * Flota suavemente; quieto con prefers-reduced-motion.
 * En temporada navideña (<html data-navidad>) se muestra con gorro de Navidad.
 * `soloNavidad`: aparece únicamente en esa temporada (p. ej. en la portada).
 * `className` va en el contenedor: posición, ancho y visibilidad.
 */
export function Mascota({
  className,
  sizes,
  soloNavidad = false,
}: {
  className?: string
  sizes: string
  soloNavidad?: boolean
}) {
  const img = 'h-auto w-full select-none'
  return (
    <span
      aria-hidden
      className={cn('block motion-safe:animate-heroe', soloNavidad && 'hidden', className)}
    >
      {!soloNavidad && (
        <Image
          src={heroe}
          alt=""
          sizes={sizes}
          className={cn(img, 'navidad:hidden')}
          draggable={false}
        />
      )}
      <Image
        src={heroeNavidad}
        alt=""
        sizes={sizes}
        className={cn(img, soloNavidad ? 'block' : 'hidden navidad:block')}
        draggable={false}
      />
    </span>
  )
}
