import type { Foto } from '@/lib/types'

/**
 * Fotos reales del equipo de WIPLUS (enviadas por WIPLUS en noviembre de 2026), en public/equipo/.
 * TODO(WIPLUS): confirmar que todas las personas que aparecen autorizan la publicación.
 */
export const fotos: Foto[] = [
  {
    id: 'equipo-completo',
    src: '/equipo/equipo-completo-wiplus.jpg',
    alt: 'Todo el equipo de WIPLUS, técnicos y personal de oficina y atención, frente a la camioneta de la empresa con una escalera en el piso',
    width: 1200,
    height: 900,
  },
  {
    id: 'tecnicos-escalera',
    src: '/equipo/tecnicos-escalera-wiplus.jpg',
    alt: 'Siete técnicos de WIPLUS con uniforme gris y gorra sostienen juntos una escalera naranja frente a la camioneta',
    width: 1200,
    height: 900,
  },
  {
    id: 'tecnicos-oficina',
    src: '/equipo/tecnicos-oficina-wiplus.jpg',
    alt: 'Técnicos de WIPLUS uniformados y abrazados frente a la oficina de la Calle 13 en Sabanalarga',
    width: 1200,
    height: 900,
  },
]
