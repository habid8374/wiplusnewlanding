import type { Plan } from '@/lib/types'

/**
 * Planes hogar. Velocidades y precios mensuales del volante oficial de WIPLUS («La mejor fibra óptica»).
 * TODO(WIPLUS): valor de la suscripción (instalación): en el volante está en blanco.
 * TODO(WIPLUS): confirmar qué incluye cada plan y cuál destacar (hoy: 200 Mb como «Recomendado»).
 */
const beneficiosBase = [
  'Conexión por fibra óptica',
  'Soporte técnico local en Sabanalarga',
  'Atención por WhatsApp y teléfono',
]

export const planes: Plan[] = [
  {
    id: 'hogar-100',
    nombre: 'Plan 100 Mb',
    velocidadMb: 100,
    precio: 60000,
    destacado: false,
    idealPara: 'Navegar, redes sociales, clases virtuales y series en varios dispositivos.',
    beneficios: beneficiosBase,
    orden: 1,
  },
  {
    id: 'hogar-150',
    nombre: 'Plan 150 Mb',
    velocidadMb: 150,
    precio: 70000,
    destacado: false,
    idealPara: 'Familias con varios celulares, TV inteligente y estudio en casa.',
    beneficios: beneficiosBase,
    orden: 2,
  },
  {
    id: 'hogar-200',
    nombre: 'Plan 200 Mb',
    velocidadMb: 200,
    precio: 90000,
    destacado: true,
    etiqueta: 'Recomendado',
    idealPara: 'Teletrabajo, videollamadas y streaming en alta definición al mismo tiempo.',
    beneficios: beneficiosBase,
    orden: 3,
  },
  {
    id: 'hogar-250',
    nombre: 'Plan 250 Mb',
    velocidadMb: 250,
    precio: 120000,
    destacado: false,
    idealPara: 'Hogares muy conectados: juegos en línea, 4K y muchos dispositivos a la vez.',
    beneficios: beneficiosBase,
    orden: 4,
  },
  {
    id: 'hogar-300',
    nombre: 'Plan 300 Mb',
    velocidadMb: 300,
    precio: 140000,
    destacado: false,
    idealPara: 'La máxima velocidad: todos conectados sin esperas, descargas pesadas y 4K.',
    beneficios: beneficiosBase,
    orden: 5,
  },
]
