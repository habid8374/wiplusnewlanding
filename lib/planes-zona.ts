import { planesDeZona } from '@/content/planes-zonas'
import { formatCOP } from './phone'
import type { Plan } from './types'

/** Planes de una zona y su resumen en texto (páginas por zona, tarjetas para compartir). */
export function resumenPlanesZona(slug: string, generales: Plan[]) {
  const pz = planesDeZona(slug)
  if (pz.tipo === 'consulta') {
    return {
      tipo: pz.tipo,
      planes: [] as Plan[],
      desdeMb: pz.desdeMb,
      hastaMb: pz.hastaMb,
      desde: null,
      texto: `planes desde ${pz.desdeMb} hasta ${pz.hastaMb} Mb (consulta el precio)`,
    }
  }
  const planes = pz.tipo === 'propios' ? pz.planes : generales
  const mb = planes.map((p) => p.velocidadMb)
  const precios = planes.flatMap((p) => (p.precio != null ? [p.precio] : []))
  const desde = precios.length ? formatCOP(Math.min(...precios)) : null
  const desdeMb = Math.min(...mb)
  const hastaMb = Math.max(...mb)
  return {
    tipo: pz.tipo,
    planes,
    desdeMb,
    hastaMb,
    desde,
    texto: `planes de ${desdeMb} a ${hastaMb} Mb${desde ? ` desde ${desde} al mes` : ''}`,
  }
}

/** Agrupa las zonas según sus planes: generales, con planes propios y «consulta el precio». */
export function agruparZonas(municipios: { slug: string; nombre: string }[]) {
  const generales: string[] = []
  const propios: { slug: string; nombre: string; planes: Plan[] }[] = []
  const consulta: { nombres: string[]; desdeMb: number; hastaMb: number }[] = []
  for (const m of municipios) {
    const pz = planesDeZona(m.slug)
    if (pz.tipo === 'generales') generales.push(m.nombre)
    else if (pz.tipo === 'propios') propios.push({ ...m, planes: pz.planes })
    else {
      const g = consulta.find((c) => c.desdeMb === pz.desdeMb && c.hastaMb === pz.hastaMb)
      if (g) g.nombres.push(m.nombre)
      else consulta.push({ nombres: [m.nombre], desdeMb: pz.desdeMb, hastaMb: pz.hastaMb })
    }
  }
  return { generales, propios, consulta }
}
