import type { Plan } from '@/lib/types'

/**
 * Planes hogar. Velocidades reales (brief del cliente).
 * TODO(WIPLUS): precios. Estaban solo en imágenes del sitio anterior (30.png … 100.png) y no fue posible
 * leerlos con certeza, así que precio = null ⇒ la UI muestra "Consulta el precio" + WhatsApp.
 * TODO(WIPLUS): confirmar qué incluye cada plan y el plan "Más elegido" (hoy: 100 Mb).
 */
const beneficiosBase = [
  'Conexión por fibra óptica',
  'Soporte técnico local en Sabanalarga',
  'Atención por WhatsApp y teléfono',
]

export const planes: Plan[] = [
  {
    id: 'hogar-30',
    nombre: 'Plan 30 Mb',
    velocidadMb: 30,
    precio: null,
    destacado: false,
    idealPara: 'Navegar, redes sociales y clases virtuales en 1 o 2 dispositivos.',
    beneficios: beneficiosBase,
    orden: 1,
  },
  {
    id: 'hogar-40',
    nombre: 'Plan 40 Mb',
    velocidadMb: 40,
    precio: null,
    destacado: false,
    idealPara: 'Hogares pequeños que ven videos y hacen videollamadas.',
    beneficios: beneficiosBase,
    orden: 2,
  },
  {
    id: 'hogar-50',
    nombre: 'Plan 50 Mb',
    velocidadMb: 50,
    precio: null,
    destacado: false,
    idealPara: 'Familias con varios celulares, TV inteligente y estudio en casa.',
    beneficios: beneficiosBase,
    orden: 3,
  },
  {
    id: 'hogar-80',
    nombre: 'Plan 80 Mb',
    velocidadMb: 80,
    precio: null,
    destacado: false,
    idealPara: 'Teletrabajo, streaming en alta definición y muchos dispositivos a la vez.',
    beneficios: beneficiosBase,
    orden: 4,
  },
  {
    id: 'hogar-100',
    nombre: 'Plan 100 Mb',
    velocidadMb: 100,
    precio: null,
    destacado: true,
    etiqueta: 'Más elegido',
    idealPara: 'Hogares conectados: juegos en línea, 4K y todos conectados sin esperas.',
    beneficios: beneficiosBase,
    orden: 5,
  },
]
