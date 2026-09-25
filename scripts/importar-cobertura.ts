/**
 * Importa la cobertura por barrio desde data/barrios-cobertura.csv.
 *
 *   npm run cobertura:importar -- --local            # regenera content/cobertura.ts (sin Sanity)
 *   npm run cobertura:importar                       # crea/actualiza en Sanity (SANITY_WRITE_TOKEN)
 *   npm run cobertura:importar -- --reemplazar-demo  # borra antes los barrios de muestra en Sanity
 *   npm run cobertura:importar -- --archivo=otro.csv
 *
 * Upsert con ID determinístico (barrio-<municipio>-<barrio>): se puede correr varias veces sin
 * duplicar, y no toca la «nota interna» que el equipo escriba en el Studio.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { municipiosBase } from '../content/municipios'
import {
  idBarrio,
  idMunicipio,
  leerCobertura,
  slugify,
  type FilaCobertura,
} from '../lib/cobertura/csv'

const args = process.argv.slice(2)
const local = args.includes('--local')
const reemplazarDemo = args.includes('--reemplazar-demo')
const archivo =
  args.find((a) => a.startsWith('--archivo='))?.split('=')[1] ?? 'data/barrios-cobertura.csv'

const { filas, errores } = leerCobertura(readFileSync(join(process.cwd(), archivo), 'utf8'))
for (const e of errores) console.error(`  ✗ fila ${e.fila}: ${e.mensaje}`)

const municipios = [...new Set(filas.map((f) => f.municipio))]
const base = (nombre: string) => municipiosBase.find((m) => slugify(m.nombre) === slugify(nombre))

async function generarLocal() {
  const nombres = [...new Set([...municipiosBase.map((m) => m.nombre), ...municipios])]
  const datos = nombres.map((nombre) => {
    const b = base(nombre)
    return {
      id: idMunicipio(nombre),
      slug: slugify(nombre),
      nombre: b?.nombre ?? nombre,
      departamento: b?.departamento ?? 'Atlántico',
      geo: b?.geo ?? null,
      whatsapp: b?.whatsapp ?? null,
      barrios: filas
        .filter((f) => slugify(f.municipio) === slugify(nombre))
        .map((f) => ({
          id: idBarrio(f.municipio, f.barrio),
          slug: slugify(f.barrio),
          nombre: f.barrio,
          tipo: f.tipo,
          estado: f.estado,
          alias: f.alias,
          notaPublica: f.notaPublica,
          demo: f.demo,
        })),
    }
  })
  const ts = `// ARCHIVO GENERADO por \`npm run cobertura:importar -- --local\` desde ${archivo}. No editar a mano.
// TODO(WIPLUS): la lista real de barrios reemplaza los datos de muestra (demo: true).
import type { Municipio } from '@/lib/types'

export const cobertura: Municipio[] = ${JSON.stringify(datos, null, 2)}
`
  const destino = join(process.cwd(), 'content/cobertura.ts')
  const prettier = await import('prettier')
  const opciones = (await prettier.resolveConfig(destino)) ?? {}
  writeFileSync(destino, await prettier.format(ts, { ...opciones, filepath: destino }))
  console.log(
    `[cobertura] content/cobertura.ts: ${datos.length} municipios, ${filas.length} barrios.`,
  )
}

async function importarSanity() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !token) {
    console.error('Faltan NEXT_PUBLIC_SANITY_PROJECT_ID y/o SANITY_WRITE_TOKEN (o usa --local).')
    process.exitCode = 1
    return
  }
  const api = `https://${projectId}.api.sanity.io/v2025-10-01/data`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const q = async <T>(query: string, params: Record<string, unknown> = {}) => {
    const url = new URL(`${api}/query/${dataset}`)
    url.searchParams.set('query', query)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
    const r = await fetch(url, { headers })
    if (!r.ok) throw new Error(`Sanity ${r.status}`)
    return ((await r.json()) as { result: T }).result
  }
  const mutar = async (mutations: unknown[]) => {
    const r = await fetch(`${api}/mutate/${dataset}?returnIds=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mutations }),
    })
    if (!r.ok) throw new Error(`Sanity ${r.status}: ${(await r.text()).slice(0, 300)}`)
  }

  if (reemplazarDemo) {
    const demos = await q<string[]>('*[_type == "barrio" && demo == true]._id')
    if (demos.length) await mutar(demos.map((id) => ({ delete: { id } })))
    console.log(`[cobertura] Borrados ${demos.length} barrios de muestra.`)
  }

  const existentes = new Set(await q<string[]>('*[_type == "barrio"]._id'))
  const mutations: unknown[] = []
  municipios.forEach((nombre, i) => {
    const b = base(nombre)
    mutations.push({
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
    })
  })
  for (const f of filas) mutations.push(...upsertBarrio(f))
  await mutar(mutations)

  const creados = filas.filter((f) => !existentes.has(idBarrio(f.municipio, f.barrio))).length
  console.log(
    `[cobertura] Sanity ${projectId}/${dataset}: ${creados} creados, ${filas.length - creados} actualizados, ${errores.length} con error.`,
  )
}

function upsertBarrio(f: FilaCobertura) {
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
    // set y no replace: conserva la nota interna escrita en el Studio.
    { patch: { id: _id, set: campos, ...(f.notaPublica ? {} : { unset: ['notaPublica'] }) } },
  ]
}

async function main() {
  console.log(`[cobertura] ${archivo}: ${filas.length} filas válidas, ${errores.length} con error.`)
  if (local) await generarLocal()
  else await importarSanity()
}

void main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
