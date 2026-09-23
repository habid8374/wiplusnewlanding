import { Building2 } from 'lucide-react'
import Image from 'next/image'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import type { ClienteEmpresarial } from '@/lib/types'

function Tile({ c }: { c: ClienteEmpresarial }) {
  return (
    <li className="flex h-24 w-44 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-line bg-white px-4 text-center shadow-card">
      {c.logo ? (
        <Image
          src={c.logo.src}
          alt={c.logo.alt}
          width={c.logo.width ?? 160}
          height={c.logo.height ?? 80}
          sizes="160px"
          className="max-h-16 w-auto object-contain"
        />
      ) : (
        <>
          <Building2 className="size-6 text-primary-400" aria-hidden />
          <span className="text-sm font-semibold text-primary-900">{c.nombre}</span>
        </>
      )}
      <ExampleBadge show={c.ejemplo} />
    </li>
  )
}

/** Grilla (pocos logos) o marquee CSS (muchos), sin librerías de carrusel. */
export function Clients({ clientes }: { clientes: ClienteEmpresarial[] }) {
  if (clientes.length === 0) return null
  if (clientes.length <= 6) {
    return (
      <ul className="flex flex-wrap justify-center gap-4" aria-label="Clientes empresariales">
        {clientes.map((c) => (
          <Tile key={c.id} c={c} />
        ))}
      </ul>
    )
  }
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:[mask-image:none]">
      <div className="flex w-max group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-safe:animate-marquee motion-reduce:w-full">
        <ul
          aria-label="Clientes empresariales"
          className="flex gap-4 py-2 pr-4 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0"
        >
          {clientes.map((c) => (
            <Tile key={c.id} c={c} />
          ))}
        </ul>
        {/* Copia decorativa para el bucle continuo (translateX -50 %) */}
        <ul aria-hidden className="flex gap-4 py-2 pr-4 motion-reduce:hidden">
          {clientes.map((c) => (
            <Tile key={`copia-${c.id}`} c={c} />
          ))}
        </ul>
      </div>
    </div>
  )
}
