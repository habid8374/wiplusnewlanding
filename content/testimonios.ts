import type { Testimonio } from '@/lib/types'

/** TODO(WIPLUS): testimonios reales con autorización. Estos son de EJEMPLO y no se publican en producción. */
export const testimonios: Testimonio[] = [
  {
    id: 'ejemplo-1',
    nombre: 'Cliente de ejemplo',
    contexto: 'Hogar en Sabanalarga',
    texto:
      'Aquí irá un testimonio real de un cliente de WIPLUS contando su experiencia con el servicio.',
    ejemplo: true,
  },
  {
    id: 'ejemplo-2',
    nombre: 'Cliente de ejemplo',
    contexto: 'Hogar en Luruaco',
    texto: 'Aquí irá un testimonio real sobre la instalación y la atención del equipo técnico.',
    ejemplo: true,
  },
  {
    id: 'ejemplo-3',
    nombre: 'Empresa de ejemplo',
    contexto: 'Cliente empresarial',
    texto: 'Aquí irá un testimonio real de una empresa que confía en WIPLUS para su conectividad.',
    ejemplo: true,
  },
]
