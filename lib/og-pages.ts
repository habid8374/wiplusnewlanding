import { planes, sitio } from '@/content'
import type { OgIconName } from './og-icons'
import { formatCOP } from './phone'

/**
 * Contenido de la tarjeta para compartir de cada página (Open Graph / WhatsApp / Facebook / X).
 * La imagen se genera en /og/<slug> (app/og/[slug]/route.tsx). El inicio usa app/opengraph-image.tsx.
 */
export type OgPage = {
  seccion: string
  titulo: string
  subtitulo: string
  icono: OgIconName
  /** Foto opcional (assets/og/fotos/<nombre>.png, 48 colores para que la tarjeta pese poco). */
  foto?: 'equipo' | 'fibra-puntas' | 'fibra-rack' | 'fibra-luz'
  chips?: string[]
}

const velocidades = [...new Set(planes.map((p) => p.velocidadMb))].sort((a, b) => a - b)
const precios = planes.flatMap((p) => (p.precio != null ? [p.precio] : []))
const desde = precios.length ? ` Desde ${formatCOP(Math.min(...precios))} al mes.` : ''

export const OG_PAGES: Record<string, OgPage> = {
  'planes-hogar': {
    seccion: 'Planes hogar',
    titulo: `Internet por fibra de ${velocidades[0]} a ${velocidades.at(-1)} Mb`,
    subtitulo: `Elige tu velocidad y contrata por WhatsApp.${desde}`,
    icono: 'gauge',
    foto: 'fibra-puntas',
    chips: velocidades.map((v) => `${v} Mb`),
  },
  'planes-empresas': {
    seccion: 'Empresas',
    titulo: 'Internet para empresas en el Atlántico',
    subtitulo: 'Canal dedicado, IP fija y soporte prioritario.',
    icono: 'building',
    foto: 'fibra-rack',
  },
  cobertura: {
    seccion: 'Cobertura',
    titulo: '¿Llegamos a tu barrio?',
    subtitulo: `${sitio.municipiosCobertura.length} zonas del Atlántico: ${sitio.municipiosCobertura.slice(0, 2).join(', ')} y más. Verifica tu barrio.`,
    icono: 'mapPin',
    foto: 'fibra-luz',
  },
  soporte: {
    seccion: 'Soporte técnico',
    titulo: 'Estamos para ayudarte',
    subtitulo: 'Reporta una falla, recibe tu número de ticket y mide tu velocidad.',
    icono: 'wrench',
    foto: 'equipo',
  },
  pagos: {
    seccion: 'Pagos',
    titulo: 'Paga tu servicio de internet',
    subtitulo: 'Consulta y paga tu factura en línea en el portal de clientes.',
    icono: 'creditCard',
  },
  nosotros: {
    seccion: 'Nosotros',
    titulo: `Más de ${sitio.experienciaAnios} años conectando la región`,
    subtitulo: 'Conoce a nuestro equipo técnico en Sabanalarga.',
    icono: 'users',
    foto: 'equipo',
  },
  contacto: {
    seccion: 'Contacto',
    titulo: 'Hablemos',
    subtitulo: `${sitio.direccion.calle}, ${sitio.direccion.municipio}, ${sitio.direccion.departamento}.`,
    icono: 'phone',
    chips: sitio.telefonos.map((t) => t.numero),
  },
  'proteccion-infantil': {
    seccion: 'Protección infantil',
    titulo: 'Tolerancia cero con la explotación sexual infantil',
    subtitulo: 'Denuncia: Te Protejo, ICBF 141, Policía y Fiscalía. Ley 679 de 2001.',
    icono: 'shieldCheck',
  },
  pqr: {
    seccion: 'PQR',
    titulo: 'Radica tu PQR en línea',
    subtitulo: 'Peticiones, quejas, reclamos y recursos.',
    icono: 'messageSquareText',
    chips: ['Radicado al instante', 'Respuesta en 15 días hábiles'],
  },
  usuario: {
    seccion: 'Protección al usuario',
    titulo: 'Tus derechos y cómo radicar una PQR',
    subtitulo: 'Derechos, deberes y recursos según la CRC.',
    icono: 'shieldCheck',
  },
  'politica-de-datos': {
    seccion: 'Datos personales',
    titulo: 'Política de tratamiento de datos',
    subtitulo: 'Cómo protegemos tu información (Ley 1581 de 2012).',
    icono: 'fileText',
  },
  terminos: {
    seccion: 'Legal',
    titulo: 'Términos y condiciones',
    subtitulo: 'Condiciones de nuestros planes y promociones.',
    icono: 'fileText',
  },
  'mapa-del-sitio': {
    seccion: 'Mapa del sitio',
    titulo: 'Todas las páginas de WIPLUS',
    subtitulo: 'Planes, cobertura, soporte, pagos y más.',
    icono: 'map',
  },
}

/** URL relativa de la tarjeta para una ruta del sitio. */
export function ogImagePath(path: string) {
  const slug = path.replace(/^\//, '')
  return slug && slug in OG_PAGES ? `/og/${slug}` : '/opengraph-image'
}
