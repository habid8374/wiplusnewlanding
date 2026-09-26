/**
 * Actualización dirigida de Sanity con los datos reales enviados por WIPLUS (volante oficial):
 * planes y precios, clientes corporativos, cuentas de pago y datos de la empresa (WhatsApp, correo, NIT, redes).
 *
 *   SANITY_WRITE_TOKEN=… npx tsx scripts/sanity-datos-reales.ts
 *
 * No toca nada más: avisos, FAQ, cobertura, barrios, etc. quedan como estén en el panel.
 * Borra solo los documentos sembrados de relleno que estos datos reemplazan
 * (planes de 30–80 Mb y «Empresa cliente 1…9»).
 * Se ejecuta desde GitHub Actions › «Cargar contenido en Sanity» con «datos_reales».
 */
import { clientes, pagos, planes, sitio } from '../content'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Faltan NEXT_PUBLIC_SANITY_PROJECT_ID y/o SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const planesViejos = ['plan-hogar-30', 'plan-hogar-40', 'plan-hogar-50', 'plan-hogar-80']
const clientesDeEjemplo = Array.from({ length: 9 }, (_, i) => `cliente-cliente-${i + 1}`)

const cuentas = pagos.medios.filter((m) => m.cuenta)

const mutations = [
  ...[...planesViejos, ...clientesDeEjemplo].map((id) => ({ delete: { id } })),
  ...planes.map((p) => ({
    createOrReplace: {
      _id: `plan-${p.id}`,
      _type: 'plan',
      nombre: p.nombre,
      velocidadMb: p.velocidadMb,
      ...(p.precio != null ? { precio: p.precio } : {}),
      destacado: p.destacado,
      ...(p.etiqueta ? { etiqueta: p.etiqueta } : {}),
      idealPara: p.idealPara,
      beneficios: p.beneficios,
      orden: p.orden,
    },
  })),
  ...clientes.map((c) => ({
    createIfNotExists: { _id: `cliente-${c.id}`, _type: 'clienteEmpresarial', nombre: c.nombre },
  })),
  ...clientes.map((c, n) => ({
    patch: { id: `cliente-${c.id}`, set: { nombre: c.nombre, orden: n + 1 } },
  })),
  { createIfNotExists: { _id: 'siteSettings', _type: 'siteSettings', nombre: sitio.nombre } },
  { patch: { id: 'siteSettings', setIfMissing: { redes: {} } } },
  {
    patch: {
      id: 'siteSettings',
      set: {
        whatsapp: sitio.whatsapp,
        whatsappEmpresas: sitio.whatsappEmpresas,
        correo: sitio.correo,
        telefonos: sitio.telefonos.map((t) => ({
          _key: t.numero.replace(/\D/g, ''),
          _type: 'telefono',
          ...t,
        })),
        'redes.instagram': sitio.redes.instagram,
        razonSocial: sitio.razonSocial,
        nit: sitio.nit,
      },
    },
  },
  // Pagos: reemplaza el medio de ejemplo «transferencia» por las cuentas bancarias reales.
  { createIfNotExists: { _id: 'infoPagos', _type: 'infoPagos' } },
  { patch: { id: 'infoPagos', setIfMissing: { medios: [] } } },
  {
    patch: {
      id: 'infoPagos',
      unset: ['medios[_key=="transferencia"]', ...cuentas.map((m) => `medios[_key=="${m.id}"]`)],
    },
  },
  {
    patch: {
      id: 'infoPagos',
      insert: {
        after: 'medios[-1]',
        items: cuentas.map(({ id, cuenta, ...m }) => ({
          _key: id,
          _type: 'medioPago',
          nombre: m.nombre,
          descripcion: m.descripcion,
          cuenta: { ...cuenta },
        })),
      },
    },
  },
]

async function main() {
  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2025-10-01/data/mutate/${dataset}?returnIds=true`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations }),
    },
  )
  const cuerpo = await res.text()
  if (!res.ok) {
    console.error(`Sanity respondió ${res.status}: ${cuerpo.slice(0, 500)}`)
    process.exitCode = 1
    return
  }
  console.log(
    `[sanity] Datos reales aplicados en ${projectId}/${dataset}: ${planes.length} planes, ` +
      `${clientes.length} clientes, ${cuentas.length} cuenta(s) de pago y datos de la empresa.`,
  )
}

void main()
