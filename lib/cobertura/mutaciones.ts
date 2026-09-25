/**
 * Mutaciones de Sanity para importar barrios. Las comparten el script (API HTTP) y la
 * herramienta «Importar barrios» del Studio (cliente con la sesión del editor).
 */
import { municipiosBase } from '../../content/municipios'
import { idBarrio, idMunicipio, slugify, type FilaCobertura } from './csv'

export type Mutacion = Record<string, unknown>

const base = (nombre: string) => municipiosBase.find((m) => slugify(m.nombre) === slugify(nombre))

/** Crea los municipios que falten (no modifica los existentes). */
export function mutacionesMunicipios(filas: FilaCobertura[]): Mutacion[] {
  const nombres = [...new Set(filas.map((f) => f.municipio))]
  return nombres.map((nombre, i) => {
    const b = base(nombre)
    return {
      createIfNotExists: {
        _id: idMunicipio(nombre),
        _type: 'municipio',
        nombre: b?.nombre ?? nombre,
        slug: { _type: 'slug', current: slugify(nombre) },
        departamento: b?.departamento ?? 'Atlántico',
        activo: true,
        orden: i + 1,
        ...(b?.geo ? { geo: { _type: 'geopoint', ...b.geo } } : {}),
      },
    }
  })
}

/**
 * Upsert de un barrio con ID determinístico: se crea si no existe y luego se actualizan sus campos
 * con `set` (no `replace`), para conservar la nota interna escrita en el Studio.
 */
export function mutacionesBarrio(f: FilaCobertura): Mutacion[] {
  const _id = idBarrio(f.municipio, f.barrio)
  const campos = {
    nombre: f.barrio,
    slug: { _type: 'slug', current: slugify(f.barrio) },
    municipio: { _type: 'reference', _ref: idMunicipio(f.municipio) },
    tipo: f.tipo,
    estado: f.estado,
    alias: f.alias,
    demo: f.demo,
    ...(f.notaPublica ? { notaPublica: f.notaPublica } : {}),
  }
  return [
    { createIfNotExists: { _id, _type: 'barrio', ...campos } },
    { patch: { id: _id, set: campos, ...(f.notaPublica ? {} : { unset: ['notaPublica'] }) } },
  ]
}

/** Divide una lista de mutaciones en lotes (Sanity recomienda transacciones moderadas). */
export function enLotes<T>(lista: T[], tamano = 150): T[][] {
  const lotes: T[][] = []
  for (let i = 0; i < lista.length; i += tamano) lotes.push(lista.slice(i, i + tamano))
  return lotes
}
