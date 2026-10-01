import {
  getCobertura,
  getInfoPagos,
  getOfertaEmpresarial,
  getPlanes,
  getSiteSettings,
  getTv,
} from '@/lib/content'
import { IS_PRODUCTION_SITE, SITE_URL } from '@/lib/env'
import { formatCOP, telefonoEmpresas } from '@/lib/phone'
import { agruparZonas } from '@/lib/planes-zona'
import { RUTAS } from '@/lib/rutas'
import { listaNatural } from '@/lib/texto'
import type { Plan } from '@/lib/types'

/**
 * /llms.txt (propuesta llmstxt.org): resumen en Markdown del negocio para asistentes de IA
 * (ChatGPT, Claude, Perplexity, Gemini…). Se arma con el mismo contenido del sitio, así que se
 * actualiza solo; nunca incluye datos marcados como ejemplo.
 */
export const dynamic = 'force-static'

const url = (path: string) => `${SITE_URL}${path}`
const plan = (p: Plan) =>
  `- ${p.velocidadMb} Mb: ${p.precio != null ? `${formatCOP(p.precio)} al mes` : 'consulta el precio'}${p.destacado && p.etiqueta ? ` (${p.etiqueta.toLowerCase()})` : ''}`

export async function GET() {
  const [sitio, planes, municipios, pagos, empresas, tv] = await Promise.all([
    getSiteSettings(),
    getPlanes(),
    getCobertura(),
    getInfoPagos(),
    getOfertaEmpresarial(),
    getTv(),
  ])
  const zonas = agruparZonas(municipios)
  const nombres = listaNatural(municipios.map((m) => m.nombre))
  const wa = (n: string) => `https://wa.me/${n.replace(/\D/g, '')}`
  const tel = sitio.telefonos.map((t) => `${t.numero}${t.etiqueta ? ` (${t.etiqueta})` : ''}`)
  const empresasTel = telefonoEmpresas(sitio)
  const total = municipios.filter((m) => m.coberturaTotal).map((m) => m.nombre)
  const medios = pagos.medios.filter((m) => !m.ejemplo)

  const lineas = [
    `# ${sitio.nombre}`,
    '',
    `> Proveedor de internet por fibra óptica para hogares y empresas en ${nombres} (${sitio.direccion.departamento}, Colombia). También ofrece TV en vivo con la aplicación NUPLIN. Contratación y atención por WhatsApp.`,
    '',
    '## Datos de contacto',
    '',
    `- Razón social: ${sitio.razonSocial ?? sitio.nombre}${sitio.nit ? `, NIT ${sitio.nit}` : ''}`,
    `- Oficina: ${sitio.direccion.calle}, ${sitio.direccion.municipio}, ${sitio.direccion.departamento}`,
    `- Horario: ${sitio.horario.dias}, ${sitio.horario.texto}`,
    `- Teléfonos: ${tel.join('; ')}`,
    `- WhatsApp (ventas, soporte y pagos): ${wa(sitio.whatsapp)}`,
    ...(sitio.whatsappEmpresas ? [`- WhatsApp para empresas: ${wa(sitio.whatsappEmpresas)}`] : []),
    `- Correo: ${sitio.correo}`,
    ...Object.entries(sitio.redes)
      .filter(([, v]) => v)
      .map(([red, v]) => `- ${red.charAt(0).toUpperCase() + red.slice(1)}: ${v}`),
    `- Sitio web: ${SITE_URL}`,
    '',
    '## Cobertura',
    '',
    `Municipios con servicio: ${nombres}.`,
    ...(total.length ? [`Hay cobertura en todos los barrios de ${listaNatural(total)}.`] : []),
    `Verificador de cobertura por barrio: ${url('/cobertura')}`,
    '',
    ...municipios.map((m) => `- [Internet en ${m.nombre}](${url(`/cobertura/${m.slug}`)})`),
    '',
    '## Planes de internet hogar por municipio',
    '',
    'Todos los planes son por fibra óptica, con soporte técnico local. Se contratan por WhatsApp.',
    '',
    ...(zonas.generales.length
      ? [`### ${listaNatural(zonas.generales)}`, '', ...planes.map(plan), '']
      : []),
    ...zonas.propios.flatMap((z) => [`### ${z.nombre}`, '', ...z.planes.map(plan), '']),
    ...zonas.consulta.flatMap((c) => [
      `### ${listaNatural(c.nombres)}`,
      '',
      `- Planes desde ${c.desdeMb} hasta ${c.hastaMb} Mb. El precio se consulta por WhatsApp o en las líneas de atención.`,
      '',
    ]),
    `Más detalles: ${url('/planes-hogar')}`,
    '',
    '## TV en vivo (aplicación NUPLIN)',
    '',
    'La aplicación NUPLIN se instala en el Smart TV y WIPLUS entrega las credenciales según el plan. Los precios se consultan por WhatsApp.',
    '',
    ...tv.planes.map(
      (p) => `- ${p.nombre}: ${p.descripcion}${p.incluye ? ` Incluye ${p.incluye.nombre}.` : ''}`,
    ),
    '',
    `Más detalles: ${url('/planes-tv')}`,
    '',
    '## Empresas',
    '',
    empresas.descripcion,
    '',
    ...empresas.beneficios.map((b) => `- ${b.titulo}: ${b.descripcion}`),
    '',
    `Cotización a la medida${empresasTel ? ` (WhatsApp ${empresasTel.numero})` : ''}: ${url('/planes-empresas')}`,
    '',
    '## Pagos',
    '',
    ...(sitio.portalClientes ? [`- Portal de facturación y pagos: ${sitio.portalClientes}`] : []),
    ...medios.map(
      (m) =>
        `- ${m.nombre}: ${m.descripcion}${m.cuenta ? ` (${m.cuenta.banco}, cuenta de ${m.cuenta.tipo.toLowerCase()} ${m.cuenta.numero}, a nombre de ${m.cuenta.titular})` : ''}`,
    ),
    `Más detalles: ${url('/pagos')}`,
    '',
    '## Páginas del sitio',
    '',
    ...RUTAS.map((r) => `- [${r.titulo}](${url(r.path === '/' ? '' : r.path)}): ${r.descripcion}`),
    '',
  ]

  return new Response(IS_PRODUCTION_SITE ? lineas.join('\n') : '# Entorno de prueba\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
