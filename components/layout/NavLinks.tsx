'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { MenuItem } from '@/lib/menu'

/**
 * Menú principal de escritorio. Cada opción despliega sus secciones al pasar el mouse o al
 * enfocarla con el teclado (Tab entra al submenú; Escape lo cierra). El enlace principal sigue
 * llevando a la página.
 */
export function NavLinks({ items }: { items: readonly MenuItem[] }) {
  const pathname = usePathname()
  const [cerrado, setCerrado] = useState<string | null>(null)
  return (
    <ul className="flex items-center gap-0.5 xl:gap-1">
      {items.map((item, i) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const conSub = item.hijos.length > 0
        const derecha = i >= items.length - 3
        return (
          <li
            key={item.href}
            className="group relative"
            onMouseLeave={() => setCerrado(null)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setCerrado(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && conSub) {
                setCerrado(item.href)
                e.currentTarget.querySelector<HTMLElement>('a')?.focus()
              }
            }}
          >
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              onClick={() => setCerrado(item.href)}
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-2 text-sm font-semibold whitespace-nowrap text-ink/80 transition-colors hover:bg-primary-50 hover:text-primary-800 xl:px-3',
                active && 'bg-primary-50 text-primary-800',
              )}
            >
              {item.label}
              {conSub && (
                <ChevronDown
                  className="hidden size-3.5 opacity-60 transition-transform group-focus-within:rotate-180 group-hover:rotate-180 motion-reduce:transition-none 2xl:inline"
                  aria-hidden
                />
              )}
            </Link>
            {conSub && (
              <div
                className={cn(
                  'invisible absolute top-full z-50 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none',
                  derecha ? 'right-0' : 'left-0',
                  cerrado === item.href && 'hidden',
                )}
              >
                <ul
                  aria-label={`Secciones de ${item.label}`}
                  className={cn(
                    'grid gap-0.5 rounded-2xl border border-line bg-white p-2 shadow-card-hover',
                    item.columnas === 2 ? 'w-[26rem] grid-cols-2' : 'w-72',
                  )}
                >
                  {item.hijos.map((h, j) => (
                    <li
                      key={h.href + h.label}
                      className={cn(item.columnas === 2 && j === 0 && 'col-span-2')}
                    >
                      <Link
                        href={h.href}
                        onClick={() => setCerrado(item.href)}
                        className="block rounded-xl px-3 py-2 hover:bg-primary-50 focus-visible:bg-primary-50"
                      >
                        <span className="block text-sm font-bold text-primary-900">{h.label}</span>
                        {h.descripcion && (
                          <span className="block text-xs text-muted">{h.descripcion}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
