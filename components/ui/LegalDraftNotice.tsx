import { TriangleAlert } from 'lucide-react'
import { SHOW_EXAMPLES } from '@/lib/env'

export function LegalDraftNotice() {
  if (!SHOW_EXAMPLES) return null
  return (
    <div
      role="note"
      className="mb-8 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900"
    >
      <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
      <p className="font-semibold">Plantilla pendiente de revisión legal por WIPLUS.</p>
    </div>
  )
}
