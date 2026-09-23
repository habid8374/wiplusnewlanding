import { ArrowRight, MapPin } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import type { Municipio } from '@/lib/types'
import { CoverageChecker } from './CoverageChecker'

export function CoverageTeaser({
  municipios,
  whatsapp,
}: {
  municipios: Municipio[]
  whatsapp: string
}) {
  return (
    <Section id="cobertura" tone="navy" align="left">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold tracking-wider text-accent-300 uppercase">
            Cobertura
          </p>
          <h2 id="cobertura-titulo" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Estamos en {municipios.map((m) => m.nombre).join(' y ')}
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Seguimos ampliando nuestra red de fibra óptica. Verifica si ya llegamos a tu barrio o
            pregúntanos por WhatsApp.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {municipios.map((m) => (
              <li
                key={m.id}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/20"
              >
                <MapPin className="size-4 text-accent-400" aria-hidden />
                {m.nombre}, {m.departamento}
              </li>
            ))}
          </ul>
          <ButtonLink href="/cobertura" variant="outline-light" className="mt-8">
            Ver mapa de cobertura
            <ArrowRight className="size-5" aria-hidden />
          </ButtonLink>
        </div>
        <CoverageChecker municipios={municipios} whatsapp={whatsapp} />
      </div>
    </Section>
  )
}
