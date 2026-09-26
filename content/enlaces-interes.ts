import type { EnlaceInteres } from '@/lib/types'

/**
 * Enlaces de interés (entidades y programas del Gobierno) que se muestran con su logo en el pie de
 * página. Logos en public/enlaces/ (cuadrados, 224 × 224 px).
 * TODO(WIPLUS): WIPLUS enviará el resto de enlaces y logos.
 */
export const enlacesInteres: EnlaceInteres[] = [
  {
    id: 'ciberpaz',
    nombre: 'CiberPaz — MinTIC',
    url: 'https://ciberpaz.gov.co/portal/',
    logo: { src: '/enlaces/ciberpaz.png', alt: 'Logo de CiberPaz, programa del Ministerio TIC' },
  },
]
