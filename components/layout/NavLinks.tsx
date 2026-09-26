'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

type Item = { href: string; label: string }

export function NavLinks({ items }: { items: readonly Item[] }) {
  const pathname = usePathname()
  return (
    <ul className="flex items-center gap-0.5 xl:gap-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-full px-2 py-2 text-sm font-semibold whitespace-nowrap text-ink/80 transition-colors hover:bg-primary-50 hover:text-primary-800 xl:px-3',
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
