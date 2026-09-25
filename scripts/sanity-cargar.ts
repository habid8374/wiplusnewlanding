/**
 * Carga inicial del contenido local (content/) en Sanity, para que el panel /studio no empiece vacío.
 *
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-cargar.ts            # crea lo que falte
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-cargar.ts --reemplazar  # sobrescribe con content/
 *
 * Por defecto usa createIfNotExists: no toca documentos que ya existan (editados en el Studio).
 * Se ejecuta desde GitHub Actions › «Cargar contenido en Sanity» (.github/workflows/sanity-cargar.yml).
 */
import {
  avisos,
  clientes,
  cobertura,
  faqs,
  ofertaEmpresarial,
  pagos,
  planes,
  sitio,
  testimonios,
} from '../content'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
const reemplazar = process.argv.includes('--reemplazar')

if (!projectId || !token) {
  console.error('Faltan NEXT_PUBLIC_SANITY_PROJECT_ID y/o SANITY_WRITE_TOKEN.')
  process.exit(1)
}

type Doc = { _id: string; _type: string; [k: string]: unknown }

/** Quita null/undefined (Sanity no guarda campos vacíos). */
const limpio = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) as T

/** Los elementos de arrays de objetos necesitan _key. */
const conKeys = <T extends Record<string, unknown>>(items: T[], key: (i: T, n: number) => string) =>
  items.map((i, n) => ({ _key: key(i, n).replace(/[^a-zA-Z0-9_-]/g, '-'), ...limpio(i) }))

const docs: Doc[] = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    ...limpio({
      nombre: sitio.nombre,
      eslogan: sitio.eslogan,
      telefonos: conKeys(sitio.telefonos, (t) => t.numero),
      whatsapp: sitio.whatsapp,
      correo: sitio.correo,
      direccion: sitio.direccion,
      horario: {
        texto: sitio.horario.texto,
        dias: sitio.horario.dias,
        abre: sitio.horario.abre,
        cierra: sitio.horario.cierra,
      },
      redes: limpio(sitio.redes),
      experienciaAnios: sitio.experienciaAnios,
      mision: sitio.mision,
      vision: sitio.vision,
      razonSocial: sitio.razonSocial,
      nit: sitio.nit,
    }),
  },
  ...planes.map((p) => ({
    _id: `plan-${p.id}`,
    _type: 'plan',
    ...limpio({
      nombre: p.nombre,
      velocidadMb: p.velocidadMb,
      precio: p.precio,
      destacado: p.destacado,
      etiqueta: p.etiqueta,
      idealPara: p.idealPara,
      beneficios: p.beneficios,
      orden: p.orden,
      ejemplo: p.ejemplo,
    }),
  })),
  ...avisos.map((a) => ({
    _id: `aviso-${a.id}`,
    _type: 'aviso',
    ...limpio({ ...a, id: undefined }),
  })),
  {
    _id: 'ofertaEmpresarial',
    _type: 'ofertaEmpresarial',
    titulo: ofertaEmpresarial.titulo,
    descripcion: ofertaEmpresarial.descripcion,
    beneficios: conKeys(ofertaEmpresarial.beneficios, (b) => b.titulo),
    velocidades: ofertaEmpresarial.velocidades,
  },
  ...cobertura.map((m, n) => ({
    _id: m.id,
    _type: 'municipio',
    nombre: m.nombre,
    departamento: m.departamento,
    slug: { _type: 'slug', current: m.slug },
    activo: true,
    ...(m.geo ? { geo: { _type: 'geopoint', lat: m.geo.lat, lng: m.geo.lng } } : {}),
    // Los barrios son documentos aparte: se cargan con `npm run cobertura:importar`.
    orden: n + 1,
  })),
  ...faqs.map((f, n) => ({
    _id: `faq-${f.id}`,
    _type: 'faq',
    ...limpio({
      pregunta: f.pregunta,
      respuesta: f.respuesta,
      categorias: f.categorias,
      orden: n + 1,
      ejemplo: f.ejemplo,
    }),
  })),
  ...testimonios.map((t, n) => ({
    _id: `testimonio-${t.id}`,
    _type: 'testimonio',
    ...limpio({
      nombre: t.nombre,
      contexto: t.contexto,
      texto: t.texto,
      orden: n + 1,
      ejemplo: t.ejemplo,
    }),
  })),
  // Los logos se suben a mano en el Studio (imagen); aquí solo los datos.
  ...clientes.map((c, n) => ({
    _id: `cliente-${c.id}`,
    _type: 'clienteEmpresarial',
    ...limpio({ nombre: c.nombre, sector: c.sector, orden: n + 1, ejemplo: c.ejemplo }),
  })),
  {
    _id: 'infoPagos',
    _type: 'infoPagos',
    medios: pagos.medios.map(({ id, ...m }) => ({ _key: id, ...limpio(m) })),
    fechasCorte: pagos.fechasCorte,
    notas: pagos.notas,
  },
]

async function main() {
  const accion = reemplazar ? 'createOrReplace' : 'createIfNotExists'
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2025-10-01/data/mutate/${dataset}?returnIds=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations: docs.map((d) => ({ [accion]: d })) }),
    },
  )
  const cuerpo = await res.text()
  if (!res.ok) {
    console.error(`Sanity respondió ${res.status}: ${cuerpo.slice(0, 500)}`)
    process.exitCode = 1
    return
  }
  const { results = [] } = JSON.parse(cuerpo) as { results?: { id: string; operation: string }[] }
  const creados = results.filter((r) => r.operation !== 'none')
  console.log(
    `[sanity] ${docs.length} documentos procesados con ${accion} en ${projectId}/${dataset}: ` +
      `${creados.length} creados o actualizados, ${docs.length - creados.length} ya existían.`,
  )
  for (const d of docs) console.log(`  · ${d._type}: ${d._id}`)
}

void main()
