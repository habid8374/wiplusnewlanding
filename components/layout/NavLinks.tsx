'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

type Item = { href: string; label: string }

export function NavLinks({ items }: { items: readonly Item[] }) {
  const pathname = usePathname()
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'text-ink/80 hover:bg-primary-50 hover:text-primary-800 rounded-full px-3 py-2 text-sm font-semibold transition-colors',
                active && 'bg-primary-50 text-primary-800',
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
