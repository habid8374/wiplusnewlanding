import { CircleCheck, CircleDashed, Clock } from 'lucide-react'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import type { Barrio, EstadoCobertura, Municipio } from '@/lib/types'

/** Grupos que se listan por municipio (sin cobertura no se lista: se consulta en el verificador). */
const GRUPOS: {
  estado: EstadoCobertura
  titulo: string
  Icono: typeof CircleCheck
  clase: string
}[] = [
  { estado: 'cubierto', titulo: 'Con cobertura', Icono: CircleCheck, clase: 'text-green-800' },
  { estado: 'parcial', titulo: 'Cobertura parcial', Icono: CircleDashed, clase: 'text-amber-800' },
  { estado: 'proximamente', titulo: 'Próximamente', Icono: Clock, clase: 'text-primary-800' },
]

const CHIP: Record<EstadoCobertura, string> = {
  cubierto: 'bg-green-50 ring-green-200',
  parcial: 'bg-amber-50 ring-amber-200',
  proximamente: 'bg-primary-50 ring-primary-100',
  sin_cobertura: 'bg-slate-50 ring-slate-200',
}

/** Barrios de un municipio agrupados por estado de cobertura. */
export function BarriosMunicipio({ municipio: m }: { municipio: Municipio }) {
  const grupos = GRUPOS.map((g) => ({
    ...g,
    barrios: m.barrios.filter((b: Barrio) => b.estado === g.estado),
  })).filter((g) => g.barrios.length > 0)
  if (grupos.length === 0) {
    return (
      <p className="mt-3 text-muted">
        Tenemos servicio en {m.nombre}. Busca tu barrio en el verificador o escríbenos y te
        confirmamos la cobertura.
      </p>
    )
  }
  return grupos.map((g) => (
    <div key={g.estado}>
      <h4 className={`mt-5 flex items-center gap-2 font-bold ${g.clase}`}>
        <g.Icono className="size-5" aria-hidden /> {g.titulo}
      </h4>
      <ul className="mt-2 flex flex-wrap gap-2">
        {g.barrios.map((b) => (
          <li key={b.id} className={`rounded-full px-3 py-1 text-sm ring-1 ${CHIP[b.estado]}`}>
            {b.nombre} <ExampleBadge show={b.demo} />
          </li>
        ))}
      </ul>
    </div>
  ))
}
