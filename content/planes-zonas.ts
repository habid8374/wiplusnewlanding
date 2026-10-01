import type { Plan, PlanesZona } from '@/lib/types'
import { beneficiosBase } from './planes'

/**
 * Planes por zona (información de WIPLUS). Las zonas que no aparecen aquí usan los planes generales
 * (content/planes.ts o el CMS), que son los de Sabanalarga.
 *  - Luruaco: volante «Planes Hogar» de Luruaco (50, 100, 150 y 200 Mb).
 *  - La Peña, Aguada de Pablo, Hibácharo, Leña y Palmar de Candelaria: planes de 20 a 100 Mb; el
 *    precio se consulta en las líneas de atención (indicado por WIPLUS).
 */
const luruaco = (velocidadMb: number, precio: number, orden: number): Plan => ({
  id: `luruaco-${velocidadMb}`,
  nombre: `Plan ${velocidadMb} Mb`,
  velocidadMb,
  precio,
  destacado: false,
  idealPara: '',
  beneficios: beneficiosBase,
  orden,
})

const consulta: PlanesZona = { tipo: 'consulta', desdeMb: 20, hastaMb: 100 }

export const planesPorZona: Record<string, PlanesZona> = {
  luruaco: {
    tipo: 'propios',
    planes: [
      luruaco(50, 60000, 1),
      luruaco(100, 80000, 2),
      luruaco(150, 100000, 3),
      luruaco(200, 120000, 4),
    ],
  },
  'la-pena': consulta,
  'aguada-de-pablo': consulta,
  hibacharo: consulta,
  lena: consulta,
  'palmar-de-candelaria': consulta,
}

/** Planes de una zona por su slug; sin entrada ⇒ planes generales. */
export const planesDeZona = (slug: string): PlanesZona =>
  planesPorZona[slug] ?? { tipo: 'generales' }
