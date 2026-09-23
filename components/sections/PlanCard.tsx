import { Check, Star } from 'lucide-react'
import { TrackPlanView } from '@/components/analytics/TrackView'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { cn } from '@/lib/cn'
import { formatCOP } from '@/lib/phone'
import type { Plan } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export function PlanCard({
  plan,
  whatsapp,
  ubicacion,
  headingLevel = 'h3',
}: {
  plan: Plan
  whatsapp: string
  ubicacion: string
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const destacado = plan.destacado
  return (
    <TrackPlanView plan={`${plan.velocidadMb} Mb`} ubicacion={ubicacion} className="h-full">
      <article
        id={`plan-${plan.velocidadMb}`}
        aria-labelledby={`plan-${plan.velocidadMb}-${ubicacion}-titulo`}
        className={cn(
          'relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover',
          destacado ? 'border-primary-500 ring-2 ring-primary-500' : 'border-line',
        )}
      >
        {plan.etiqueta && (
          <p className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-xs font-extrabold tracking-wide whitespace-nowrap text-primary-950 uppercase shadow">
            <Star className="size-3.5 fill-current" aria-hidden />
            {plan.etiqueta}
          </p>
        )}
        <Heading
          id={`plan-${plan.velocidadMb}-${ubicacion}-titulo`}
          className="text-sm font-bold tracking-wider text-primary-600 uppercase"
        >
          <span className="sr-only">Plan de internet de </span>
          Fibra óptica
          <ExampleBadge show={plan.ejemplo} className="ml-2" />
        </Heading>
        <p className="mt-2 flex items-baseline gap-1 text-primary-900">
          <span className="text-6xl leading-none font-extrabold tracking-tight">
            {plan.velocidadMb}
          </span>
          <span className="text-2xl font-bold">Mb</span>
        </p>
        <div className="mt-4 min-h-16">
          {plan.precio != null ? (
            <p className="text-primary-900">
              <span className="text-3xl font-extrabold">{formatCOP(plan.precio)}</span>
              <span className="text-muted"> /mes</span>
            </p>
          ) : (
            <p className="text-primary-900">
              <span className="block text-xl font-extrabold">Consulta el precio</span>
              <span className="text-sm text-muted">Te lo damos al instante por WhatsApp</span>
            </p>
          )}
        </div>
        <p className="mt-3 text-sm text-muted">{plan.idealPara}</p>
        <ul className="mt-5 space-y-2.5 text-sm">
          {plan.beneficios.map((b) => (
            <li key={b} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-whatsapp-700" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <WhatsAppLink
            numero={whatsapp}
            mensaje={mensajesWhatsApp.plan(plan.velocidadMb)}
            ubicacion={ubicacion}
            plan={`${plan.velocidadMb} Mb`}
            className="w-full"
            data-plan={plan.velocidadMb}
            aria-label={`Lo quiero: plan de ${plan.velocidadMb} Mb por WhatsApp`}
          >
            Lo quiero
          </WhatsAppLink>
        </div>
      </article>
    </TrackPlanView>
  )
}
