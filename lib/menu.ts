import { planesTv } from '@/content/tv'
import { mainNav } from './nav'
import { agruparZonas } from './planes-zona'
import { listaNatural } from './texto'

export type SubItem = { href: string; label: string; descripcion?: string }
export type MenuItem = { href: string; label: string; hijos: SubItem[]; columnas?: 1 | 2 }

/**
 * Menú principal con los submenús que se despliegan al pasar el mouse (escritorio). Solo enlaza
 * secciones que existen en cada página; los municipios y sus planes salen del contenido.
 */
export function construirMenu(municipios: { slug: string; nombre: string }[]): MenuItem[] {
  const zonas = agruparZonas(municipios)
  const hijos: Record<string, Omit<MenuItem, 'href' | 'label'>> = {
    '/planes-hogar': {
      hijos: [
        ...(zonas.generales.length
          ? [
              {
                href: '/planes-hogar#planes',
                label: `Planes en ${listaNatural(zonas.generales)}`,
                descripcion: 'Fibra óptica con precio mensual',
              },
            ]
          : []),
        ...zonas.propios.map((z) => ({
          href: `/planes-hogar#planes-${z.slug}`,
          label: `Planes en ${z.nombre}`,
          descripcion: `De ${Math.min(...z.planes.map((p) => p.velocidadMb))} a ${Math.max(...z.planes.map((p) => p.velocidadMb))} Mb`,
        })),
        ...zonas.consulta.map((c) => ({
          href: '/planes-hogar#otras-zonas',
          label: 'Otros municipios',
          descripcion: listaNatural(c.nombres),
        })),
        { href: '/planes-hogar#comparar', label: 'Compara los planes' },
        { href: '/planes-hogar#solicitud', label: '¿Prefieres que te llamemos?' },
      ],
    },
    '/planes-empresas': {
      hijos: [
        {
          href: '/planes-empresas#beneficios',
          label: 'Beneficios',
          descripcion: 'Canal dedicado, IP fija y soporte prioritario',
        },
        { href: '/planes-empresas#clientes', label: 'Empresas que confían en WIPLUS' },
        { href: '/planes-empresas#cotizacion', label: 'Solicita tu cotización' },
      ],
    },
    '/planes-tv': {
      hijos: [
        { href: '/planes-tv#nuplin', label: 'NUPLIN', descripcion: 'TV en vivo en tu Smart TV' },
        ...planesTv.map((p) => ({
          href: `/planes-tv#tv-${p.id}`,
          label: `Plan ${p.nombre}`,
          descripcion: p.incluye ? `Incluye ${p.incluye.nombre}` : undefined,
        })),
        { href: '/planes-tv#canales', label: 'Canales' },
      ],
    },
    '/cobertura': {
      columnas: 2,
      hijos: [
        {
          href: '/cobertura#verificador',
          label: 'Verifica tu barrio',
          descripcion: '¿Llegamos a tu casa?',
        },
        ...municipios.map((m) => ({ href: `/cobertura/${m.slug}`, label: m.nombre })),
      ],
    },
    '/soporte': {
      hijos: [
        {
          href: '/soporte#guia',
          label: 'Guía rápida',
          descripcion: 'Soluciona fallas comunes en minutos',
        },
        {
          href: '/soporte#reportar-falla',
          label: 'Reporta una falla',
          descripcion: 'Recibe tu número de ticket',
        },
        { href: '/soporte#test-de-velocidad', label: 'Test de velocidad' },
      ],
    },
    '/pagos': {
      hijos: [
        {
          href: '/pagos#portal-clientes',
          label: 'Paga tu factura',
          descripcion: 'Portal de clientes',
        },
        {
          href: '/pagos#medios',
          label: 'Otros medios de pago',
          descripcion: 'Transferencia o consignación',
        },
        { href: '/pagos#fechas', label: 'Fechas de corte' },
      ],
    },
    '/nosotros': {
      hijos: [
        { href: '/nosotros#historia', label: 'Nuestra historia' },
        { href: '/nosotros#mision-vision', label: 'Misión y visión' },
        { href: '/nosotros#equipo', label: 'Nuestro equipo' },
        { href: '/nosotros#clientes', label: 'Clientes empresariales' },
      ],
    },
    '/contacto': {
      hijos: [
        {
          href: '/contacto#canales',
          label: 'Teléfonos y WhatsApp',
          descripcion: 'Oficina y horario de atención',
        },
        { href: '/pqr', label: 'Radicar PQR', descripcion: 'Peticiones, quejas y reclamos' },
        { href: '/usuario', label: 'Protección al usuario' },
      ],
    },
  }
  return mainNav.map((item) => ({ ...item, ...(hijos[item.href] ?? { hijos: [] }) }))
}
