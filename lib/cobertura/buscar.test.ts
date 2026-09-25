import { describe, expect, it } from 'vitest'
import type { Barrio } from '../types'
import { crearBuscador, normalizar } from './buscar'

const barrio = (nombre: string, alias: string[] = []): Barrio => ({
  id: nombre,
  slug: nombre,
  nombre,
  tipo: 'barrio',
  estado: 'cubierto',
  alias,
})

const sabanalarga = [
  barrio('Villa Estadio'),
  barrio('Centro', ['Centro Histórico', 'El Centro']),
  barrio('Los Olivos'),
  barrio('Urbanización La Paz'),
]
const luruaco = [barrio('San Juan de Tocagua'), barrio('Centro')]

describe('normalizar', () => {
  it('ignora mayúsculas, tildes, signos y prefijos', () => {
    expect(normalizar('Villa Estadio')).toBe('villa estadio')
    expect(normalizar('  villa   estadio ')).toBe('villa estadio')
    expect(normalizar('B. Villa Estadio')).toBe('villa estadio')
    expect(normalizar('Barrio Villa Estadio')).toBe('villa estadio')
    expect(normalizar('Urb. La Paz')).toBe('paz')
    expect(normalizar('Urbanización La Paz')).toBe('paz')
    expect(normalizar('Centro Histórico')).toBe('centro historico')
  })
  it('no deja vacío un nombre formado solo por un prefijo', () => {
    expect(normalizar('La')).toBe('la')
  })
})

describe('buscar', () => {
  const s = crearBuscador(sabanalarga)

  it('encuentra el mismo barrio escrito de varias formas', () => {
    for (const q of ['Villa Estadio', 'villa estadio', 'B. Villa Estadio', 'VILLA ESTADIO']) {
      expect(s.buscar(q)[0]?.nombre).toBe('Villa Estadio')
    }
  })

  it('tolera errores de tipeo (búsqueda difusa)', () => {
    expect(s.buscar('vila estadio')[0]?.nombre).toBe('Villa Estadio')
    expect(s.buscar('olibos')[0]?.nombre).toBe('Los Olivos')
  })

  it('busca también por alias', () => {
    expect(s.buscar('centro historico')[0]?.nombre).toBe('Centro')
    expect(s.exacto('El Centro')?.nombre).toBe('Centro')
  })

  it('«empieza por» sugiere mientras se escribe', () => {
    expect(s.buscar('vil').map((b) => b.nombre)).toContain('Villa Estadio')
  })

  it('no mezcla municipios', () => {
    const l = crearBuscador(luruaco)
    expect(l.buscar('villa estadio')).toEqual([])
    expect(s.buscar('tocagua')).toEqual([])
  })

  it('devuelve máximo 8 sugerencias', () => {
    const muchos = crearBuscador(Array.from({ length: 20 }, (_, i) => barrio(`Barrio Norte ${i}`)))
    expect(muchos.buscar('norte')).toHaveLength(8)
  })

  it('exacto no acepta coincidencias parciales', () => {
    expect(s.exacto('villa')).toBeUndefined()
  })
})
