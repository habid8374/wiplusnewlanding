/**
 * Borra de Sanity los barrios de muestra (demo = true o nombre «REEMPLAZAR…») y apaga en
 * Cobertura › Configuración «Mostrar barrios de muestra» y el aviso «Datos de muestra».
 * Los barrios reales (demo = false) no se tocan. Deja en el log la lista de lo borrado.
 *
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-limpiar-muestras.ts
 *
 * Se ejecuta desde GitHub Actions › «Cargar contenido en Sanity» con «limpiar_muestras».
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Faltan NEXT_PUBLIC_SANITY_PROJECT_ID y/o SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const api = `https://${projectId}.api.sanity.io/v2025-10-01/data`
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

type Barrio = { _id: string; nombre?: string; municipio?: string }

async function main() {
  const query = encodeURIComponent(
    '*[_type == "barrio" && (demo == true || nombre match "REEMPLAZAR*")]{_id, nombre, "municipio": municipio->nombre}',
  )
  const res = await fetch(`${api}/query/${dataset}?query=${query}`, { headers })
  if (!res.ok) throw new Error(`Sanity respondió ${res.status} al consultar`)
  const { result = [] } = (await res.json()) as { result?: Barrio[] }

  const mutations = [
    ...result.map((b) => ({ delete: { id: b._id } })),
    { createIfNotExists: { _id: 'configCobertura', _type: 'configCobertura' } },
    {
      patch: {
        id: 'configCobertura',
        set: { mostrarMuestras: false, mostrarAvisoDemo: false },
      },
    },
  ]
  const r = await fetch(`${api}/mutate/${dataset}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mutations }),
  })
  if (!r.ok) throw new Error(`Sanity respondió ${r.status}: ${(await r.text()).slice(0, 300)}`)

  console.log(`[sanity] ${result.length} barrios de muestra borrados:`)
  for (const b of result) console.log(`  · ${b.municipio ?? '?'} › ${b.nombre ?? b._id}`)
  console.log('[sanity] Configuración de cobertura: muestras y aviso de datos de muestra apagados.')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})

export {}
