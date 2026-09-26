import Image from 'next/image'
import { cn } from '@/lib/cn'
import heroe from '@/public/mascota/wiplus-heroe.png'

/**
 * Superhéroe de WIPLUS (personaje de su publicidad). Decorativo: alt vacío.
 * Flota suavemente; quieto con prefers-reduced-motion.
 */
export function Mascota({ className, sizes }: { className?: string; sizes: string }) {
  return (
    <Image
      src={heroe}
      alt=""
      aria-hidden
      sizes={sizes}
      className={cn('h-auto select-none motion-safe:animate-heroe', className)}
      draggable={false}
    />
  )
}
