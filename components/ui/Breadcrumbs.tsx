import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Inicio', path: '/' }, ...items]
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Ruta de navegación" className="text-sm">
        <ol className="text-primary-100 flex flex-wrap items-center gap-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-4 opacity-70" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="font-semibold text-white">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-white hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
