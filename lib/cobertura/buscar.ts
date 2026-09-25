/**
 * Búsqueda de barrios para el verificador de cobertura (se ejecuta en el navegador).
 * Orden: coincidencia exacta normalizada → «empieza por» → «contiene» → difusa (Fuse.js),
 * sobre el nombre y los alias, solo dentro del municipio elegido.
 */
import Fuse from 'fuse.js'
import type { Barrio } from '../types'

// Prefijos que la gente escribe o no: «B. Villa Estadio», «Urb. Los Olivos», «El Centro»…
const PREFIJOS = /^(?:(?:barrio|b|urb|urbanizacion|sector|vereda|corregimiento|el|la|los|las)\s+)+/

/** Minúsculas, sin tildes ni signos, espacios colapsados y sin prefijos comunes al inicio. */
export function normalizar(texto: string) {
  const base = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return base.replace(PREFIJOS, '').trim() || base
}

type Indexado = { barrio: Barrio; nombre: string; alias: string[] }

export function crearBuscador(barrios: Barrio[]) {
  const indice: Indexado[] = barrios.map((b) => ({
    barrio: b,
    nombre: normalizar(b.nombre),
    alias: b.alias.map(normalizar),
  }))
  const fuse = new Fuse(indice, {
    keys: ['nombre', 'alias'],
    threshold: 0.3,
    ignoreLocation: true,
  })
  const claves = (x: Indexado) => [x.nombre, ...x.alias]

  return {
    /** Hasta `max` sugerencias, las mejores primero. */
    buscar(consulta: string, max = 8): Barrio[] {
      const q = normalizar(consulta)
      if (!q) return []
      const resultado: Barrio[] = []
      const agregar = (lista: Indexado[]) => {
        for (const x of lista) if (!resultado.includes(x.barrio)) resultado.push(x.barrio)
      }
      agregar(indice.filter((x) => claves(x).some((k) => k === q)))
      agregar(indice.filter((x) => claves(x).some((k) => k.startsWith(q))))
      agregar(indice.filter((x) => claves(x).some((k) => k.includes(q))))
      if (q.length >= 3) agregar(fuse.search(q).map((r) => r.item))
      return resultado.slice(0, max)
    },
    /** El barrio cuyo nombre o alias coincide exactamente (tras normalizar), si existe. */
    exacto(consulta: string): Barrio | undefined {
      const q = normalizar(consulta)
      return indice.find((x) => claves(x).includes(q))?.barrio
    },
  }
}
