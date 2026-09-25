/**
 * Lectura y validación de la lista de barrios (CSV del proyecto o filas pegadas desde Excel).
 * La usan el script `npm run cobertura:importar`, la herramienta «Importar barrios» del Studio
 * y el respaldo local. Solo importaciones relativas: también se compila dentro del Studio.
 */
import * as z from 'zod/mini'

export const ESTADOS = ['cubierto', 'parcial', 'proximamente', 'sin_cobertura'] as const
export const TIPOS = ['barrio', 'urbanizacion', 'sector', 'vereda', 'corregimiento'] as const
export const COLUMNAS = [
  'municipio',
  'barrio',
  'tipo',
  'estado',
  'alias',
  'nota_publica',
  'demo',
] as const

export type FilaCobertura = {
  municipio: string
  barrio: string
  tipo: (typeof TIPOS)[number]
  estado: (typeof ESTADOS)[number]
  alias: string[]
  notaPublica: string | null
  demo: boolean
}

export type ErrorFila = { fila: number; mensaje: string }

/** "Villa Estadio" → "villa-estadio" (sin tildes ni signos). */
export function slugify(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * IDs determinísticos para poder importar varias veces sin duplicar. Van con guiones y no con
 * puntos: en Sanity un ID con punto es privado y no se puede leer desde el sitio.
 */
export const idMunicipio = (municipio: string) => `municipio-${slugify(municipio)}`
export const idBarrio = (municipio: string, barrio: string) =>
  `barrio-${slugify(municipio)}-${slugify(barrio)}`

/** Separa una tabla de texto: tabuladores (copiado de Excel/Sheets), punto y coma o comas. */
export function parseTabla(texto: string): string[][] {
  const limpio = texto.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
  const primera = limpio.split('\n', 1)[0] ?? ''
  const cuenta = (c: string) => primera.split(c).length - 1
  const sep = [
    ['\t', cuenta('\t')],
    [';', cuenta(';')],
    [',', cuenta(',')],
  ].sort((a, b) => (b[1] as number) - (a[1] as number))[0][0] as string

  const filas: string[][] = []
  let fila: string[] = []
  let celda = ''
  let comillas = false
  for (let i = 0; i < limpio.length; i++) {
    const c = limpio[i]
    if (comillas) {
      if (c === '"' && limpio[i + 1] === '"') {
        celda += '"'
        i++
      } else if (c === '"') comillas = false
      else celda += c
    } else if (c === '"' && celda === '') comillas = true
    else if (c === sep) {
      fila.push(celda)
      celda = ''
    } else if (c === '\n') {
      fila.push(celda)
      filas.push(fila)
      fila = []
      celda = ''
    } else celda += c
  }
  if (celda !== '' || fila.length) {
    fila.push(celda)
    filas.push(fila)
  }
  return filas
}

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()

/** "Sin cobertura" → "sin_cobertura", "Próximamente" → "proximamente". */
const valorLista = (s: string) => sinTildes(s).replace(/[\s-]+/g, '_')

const SI = new Set(['si', 'yes', 'true', '1', 'x', 'demo'])

const esquemaFila = z.object({
  municipio: z.string().check(z.trim(), z.minLength(2, 'falta el municipio'), z.maxLength(60)),
  barrio: z.string().check(z.trim(), z.minLength(1, 'falta el nombre del barrio'), z.maxLength(80)),
  tipo: z.enum(TIPOS, { error: `tipo inválido (use: ${TIPOS.join(', ')})` }),
  estado: z.enum(ESTADOS, { error: `estado inválido (use: ${ESTADOS.join(', ')})` }),
  alias: z.array(z.string().check(z.maxLength(80))),
  notaPublica: z.nullable(
    z.string().check(z.maxLength(300, 'nota pública de más de 300 caracteres')),
  ),
  demo: z.boolean(),
})

/**
 * Convierte el texto (con o sin fila de encabezado) en filas válidas y errores por número de fila.
 * Sin encabezado se asume el orden: municipio, barrio, tipo, estado, alias, nota_publica, demo.
 */
export function leerCobertura(texto: string): { filas: FilaCobertura[]; errores: ErrorFila[] } {
  const tabla = parseTabla(texto)
  const filas: FilaCobertura[] = []
  const errores: ErrorFila[] = []
  if (!tabla.length) return { filas, errores }

  const encabezado = tabla[0].map((c) => valorLista(c))
  const conEncabezado = encabezado.includes('municipio') && encabezado.includes('barrio')
  const indice = (col: string, pos: number) => (conEncabezado ? encabezado.indexOf(col) : pos)
  const col = Object.fromEntries(COLUMNAS.map((c, i) => [c, indice(c, i)])) as Record<
    (typeof COLUMNAS)[number],
    number
  >
  const vistos = new Set<string>()

  tabla.forEach((celdas, i) => {
    if (conEncabezado && i === 0) return
    if (celdas.every((c) => !c.trim())) return
    const fila = i + 1
    const leer = (c: (typeof COLUMNAS)[number]) =>
      col[c] >= 0 ? (celdas[col[c]] ?? '').trim() : ''
    const bruto = {
      municipio: leer('municipio'),
      barrio: leer('barrio'),
      tipo: valorLista(leer('tipo') || 'barrio'),
      estado: valorLista(leer('estado')),
      alias: leer('alias')
        .split('|')
        .map((a) => a.trim())
        .filter(Boolean),
      notaPublica: leer('nota_publica') || null,
      demo: SI.has(sinTildes(leer('demo'))),
    }
    const r = esquemaFila.safeParse(bruto)
    if (!r.success) {
      errores.push({ fila, mensaje: r.error.issues.map((x) => x.message).join('; ') })
      return
    }
    const clave = idBarrio(r.data.municipio, r.data.barrio)
    if (vistos.has(clave)) {
      errores.push({ fila, mensaje: `«${r.data.barrio}» está repetido en ${r.data.municipio}` })
      return
    }
    vistos.add(clave)
    filas.push(r.data)
  })
  return { filas, errores }
}
