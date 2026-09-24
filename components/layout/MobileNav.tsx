'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { cn } from '@/lib/cn'
import { mensajesWhatsApp } from '@/lib/whatsapp'

type Item = { href: string; label: string }

/** Menú hamburguesa accesible: aria-expanded, Escape para cerrar, foco controlado. */
export function MobileNav({ items, whatsapp }: { items: readonly Item[]; whatsapp: string }) {
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const pathname = usePathname()
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Cierra el menú al navegar a otra ruta.
  const isOpen = open && openedAt === pathname

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          setOpen(!isOpen)
          setOpenedAt(pathname)
        }}
        className="inline-flex size-11 items-center justify-center rounded-full text-primary-900 hover:bg-primary-50"
      >
        {isOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        <span className="sr-only">{isOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white shadow-card sm:h-[calc(100dvh-4.5rem)]"
      >
        <nav aria-label="Menú móvil" className="px-4 py-4">
          <ul className="divide-y divide-line">
            {items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block px-2 py-4 text-lg font-semibold text-primary-900',
                      active && 'text-primary-600',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <WhatsAppLink
            numero={whatsapp}
            mensaje={mensajesWhatsApp.contratar()}
            ubicacion="menu_movil"
            size="lg"
            className="mt-6 w-full"
          >
            Contratar por WhatsApp
          </WhatsAppLink>
          <Link
            href="/pqr"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center font-semibold text-primary-700 underline underline-offset-2"
          >
            Radicar una PQR (petición, queja o recurso)
          </Link>
        </nav>
      </div>
    </div>
  )
}
