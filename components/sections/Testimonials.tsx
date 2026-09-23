import { Quote } from 'lucide-react'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import type { Testimonio } from '@/lib/types'

export function Testimonials({ testimonios }: { testimonios: Testimonio[] }) {
  if (testimonios.length === 0) return null
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {testimonios.map((t) => (
        <li key={t.id}>
          <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
            <Quote className="size-8 text-accent-500" aria-hidden />
            <blockquote className="mt-3 flex-1 text-ink">“{t.texto}”</blockquote>
            <figcaption className="mt-5">
              <span className="block font-bold text-primary-900">
                {t.nombre} <ExampleBadge show={t.ejemplo} />
              </span>
              <span className="text-sm text-muted">{t.contexto}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
