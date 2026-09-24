import { ChevronDown } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { faqJsonLd } from '@/lib/seo'
import type { Faq } from '@/lib/types'

/** Acordeón accesible nativo (details/summary) + JSON-LD FAQPage. */
export function FaqList({ faqs, withJsonLd = true }: { faqs: Faq[]; withJsonLd?: boolean }) {
  if (faqs.length === 0) return null
  return (
    <>
      {withJsonLd && <JsonLd data={faqJsonLd(faqs)} />}
      <div className="mx-auto max-w-3xl divide-y divide-line rounded-2xl border border-line bg-white shadow-card">
        {faqs.map((f) => (
          <details key={f.id} className="group px-5 sm:px-6">
            <summary className="flex min-h-14 items-center justify-between gap-4 py-4 text-left font-bold text-primary-900">
              <span>
                {f.pregunta}
                <ExampleBadge show={f.ejemplo} className="ml-2" />
              </span>
              <ChevronDown
                className="size-5 shrink-0 text-primary-600 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-5 text-muted">{f.respuesta}</p>
          </details>
        ))}
      </div>
    </>
  )
}
