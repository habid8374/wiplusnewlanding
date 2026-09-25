import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { idBarrio, leerCobertura, slugify } from './csv'

describe('leerCobertura', () => {
  it('lee el CSV de muestra del proyecto sin errores', () => {
    const { filas, errores } = leerCobertura(readFileSync('data/barrios-cobertura.csv', 'utf8'))
    expect(errores).toEqual([])
    expect(filas.length).toBeGreaterThan(0)
    expect(filas[0]).toMatchObject({ municipio: 'Sabanalarga', barrio: 'Centro', demo: true })
    expect(filas[0].alias).toEqual(['Centro Histórico', 'El Centro'])
  })

  it('acepta filas pegadas desde Excel (tabuladores, sin encabezado, valores con tildes)', () => {
    const { filas } = leerCobertura('Luruaco\tLos Olivos\tUrbanización\tPróximamente\t\t\tSí')
    expect(filas).toEqual([
      {
        municipio: 'Luruaco',
        barrio: 'Los Olivos',
        tipo: 'urbanizacion',
        estado: 'proximamente',
        alias: [],
        notaPublica: null,
        demo: true,
      },
    ])
  })

  it('acepta punto y coma y comillas', () => {
    const { filas } = leerCobertura(
      'municipio;barrio;tipo;estado\nLuruaco;"Sector 2, norte";sector;Sin cobertura',
    )
    expect(filas[0]).toMatchObject({ barrio: 'Sector 2, norte', estado: 'sin_cobertura' })
  })

  it('reporta errores con número de fila sin detener el resto', () => {
    const texto = [
      'municipio,barrio,tipo,estado,alias,nota_publica,demo',
      'Sabanalarga,Centro,barrio,cubierto,,,no',
      'Sabanalarga,Centro,barrio,parcial,,,no',
      'Luruaco,Norte,barrio,listo,,,no',
      'Luruaco,Sur,barrio,parcial,,,no',
    ].join('\n')
    const { filas, errores } = leerCobertura(texto)
    expect(filas.map((f) => f.barrio)).toEqual(['Centro', 'Sur'])
    expect(errores.map((e) => e.fila)).toEqual([3, 4])
  })
})

describe('IDs', () => {
  it('son determinísticos, sin tildes y sin puntos (IDs con punto son privados en Sanity)', () => {
    expect(slugify('Urbanización La Paz')).toBe('urbanizacion-la-paz')
    expect(idBarrio('Sabanalarga', 'Villa Estadio')).toBe('barrio-sabanalarga-villa-estadio')
    expect(idBarrio('Sabanalarga', 'Villa Estadio')).not.toContain('.')
  })
})
