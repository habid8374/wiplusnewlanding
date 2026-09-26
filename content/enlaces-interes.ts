import type { EnlaceInteres } from '@/lib/types'

/**
 * Enlaces de interés y canales de denuncia (Ley 679 de 2001: los ISP deben publicar enlaces para
 * denunciar pornografía infantil ante las autoridades). Se muestran en el pie de página y en
 * /proteccion-infantil. Logos en public/enlaces/ (cuadrados, 224 × 224 px); sin logo se muestra
 * el nombre.
 * TODO(WIPLUS): logos oficiales de los enlaces que aún no tienen.
 */
export const enlacesInteres: EnlaceInteres[] = [
  {
    id: 'teprotejo',
    nombre: 'Te Protejo',
    descripcion:
      'Canal de denuncia virtual de material de abuso sexual infantil y otras situaciones que afectan a niños, niñas y adolescentes.',
    url: 'https://www.teprotejo.org',
    denuncia: true,
  },
  {
    id: 'icbf',
    nombre: 'ICBF — Bienestar Familiar',
    descripcion: 'Instituto Colombiano de Bienestar Familiar. Línea gratuita nacional 141.',
    url: 'https://www.icbf.gov.co',
    linea: '141',
    denuncia: true,
  },
  {
    id: 'cai-virtual',
    nombre: 'Centro Cibernético Policial',
    descripcion: 'CAI Virtual de la Policía Nacional: denuncia de delitos informáticos.',
    url: 'https://caivirtual.policia.gov.co',
    linea: '123',
    denuncia: true,
  },
  {
    id: 'fiscalia',
    nombre: 'Fiscalía General de la Nación',
    descripcion: 'Denuncia penal en línea o en la línea 122.',
    url: 'https://www.fiscalia.gov.co',
    linea: '122',
    denuncia: true,
  },
  {
    id: 'enticconfio',
    nombre: 'En TIC Confío+',
    descripcion: 'Estrategia del MinTIC para el uso seguro y responsable de internet.',
    url: 'https://www.enticconfio.gov.co',
  },
  {
    id: 'ciberpaz',
    nombre: 'CiberPaz — MinTIC',
    descripcion: 'Programa del Ministerio TIC para una convivencia digital segura.',
    url: 'https://ciberpaz.gov.co/portal/',
    logo: { src: '/enlaces/ciberpaz.png', alt: 'Logo de CiberPaz, programa del Ministerio TIC' },
  },
]
