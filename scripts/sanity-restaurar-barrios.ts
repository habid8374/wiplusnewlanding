/**
 * Restaura barrios borrados, tomando su última versión del historial de Sanity antes de una fecha,
 * y los deja como reales (demo = false).
 *
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-restaurar-barrios.ts \
 *     "Sabanalarga:1ro de Diciembre|Sabanalarga:Santander" 2026-09-26T21:27:00Z
 *
 * Se ejecuta desde GitHub Actions › «Cargar contenido en Sanity» con «restaurar_barrios».
 * Solo encuentra barrios con ID determinístico (los creados con «Importar barrios» o el script).
 */
// Mismo ID que lib/cobertura/csv.ts › idBarrio (copiado: el workflow corre sin instalar dependencias).
const slugify = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const idBarrio = (m: string, b: string) => `barrio-${slugify(m)}-${slugify(b)}`

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
const [lista = '', hasta = ''] = process.argv.slice(2)

if (!projectId || !token || !lista || !hasta) {
  console.error(
    'Uso: SANITY_WRITE_TOKEN=… tsx scripts/sanity-restaurar-barrios.ts "Mun:Barrio|…" <fecha ISO>',
  )
  process.exit(1)
}

const api = `https://${projectId}.api.sanity.io/v2025-10-01/data`
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

async function main() {
  const pares = lista
    .split('|')
    .map((p) => p.split(':').map((s) => s.trim()))
    .filter(([m, b]) => m && b)
  const docs: Record<string, unknown>[] = []
  for (const [municipio, barrio] of pares) {
    const id = idBarrio(municipio, barrio)
    const res = await fetch(
      `${api}/history/${dataset}/documents/${id}?time=${encodeURIComponent(hasta)}`,
      { headers },
    )
    const json = (await res.json().catch(() => ({}))) as { documents?: Record<string, unknown>[] }
    const doc = json.documents?.[0]
    if (!res.ok || !doc) {
      console.log(`  ✗ ${municipio} › ${barrio} (${id}): no está en el historial`)
      continue
    }
    const { _rev, _updatedAt, _createdAt, ...resto } = doc
    void _rev
    void _updatedAt
    void _createdAt
    docs.push({ ...resto, demo: false })
    console.log(`  ✓ ${municipio} › ${barrio} (${id})`)
  }
  if (!docs.length) return
  const r = await fetch(`${api}/mutate/${dataset}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ mutations: docs.map((d) => ({ createOrReplace: d })) }),
  })
  if (!r.ok) throw new Error(`Sanity respondió ${r.status}: ${(await r.text()).slice(0, 300)}`)
  console.log(`[sanity] ${docs.length} barrios restaurados como reales (demo = false).`)
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
