/**
 * Planes de TV con la aplicación NUPLIN (información de WIPLUS).
 * Precios: se consultan por WhatsApp (indicado por WIPLUS) ⇒ la UI muestra «Consulta el precio».
 * NUPLIN se instala en el Smart TV; WIPLUS entrega las credenciales según el plan que se adquiera.
 * TODO(WIPLUS): nombre del paquete de cada imagen de canales (hoy solo se sabe que una es «Flex»),
 * qué incluye el plan Free y si los planes se suman.
 */
export type ParrillaTv = {
  id: string
  titulo: string
  imagen: { src: string; width: number; height: number }
  /** Nombres de los canales (texto alternativo de la imagen y para buscadores). */
  canales: string[]
}

export type PlanTv = {
  id: string
  nombre: string
  descripcion: string
  parrilla?: string
  /** Canal o servicio destacado del plan (logo + texto). */
  incluye?: { nombre: string; logo: { src: string; width: number; height: number } }
}

const flex = [
  'City TV',
  'MC HD',
  'A3S Series',
  'Multipremier',
  'DHE',
  'Cine Latino',
  'Teleantioquia',
  'Plim Plim',
  'Caracol',
  'Canal RCN',
  'Señal Colombia',
  'Canal Capital',
  'Telecaribe',
  'Zoom TV',
  'Canal Trece',
  'Canal Institucional',
  'Telepacífico',
  'Canal Congreso',
  'Venevisión',
  'Telecafé',
  'Canal TRO',
  'Libre como tú',
  'TV Agro',
  'Telemedellín',
  'EWTN',
  'France 24',
  'Euronews',
  'Teleislas',
  'Canal N',
  'Kanal D Drama',
  'Film & Arts',
  'Ve Plus',
  'Cristovisión',
  'El Tiempo Televisión',
  'NTN24',
  'El Gourmet',
  'DW',
  'TeleVID',
  '¡HOLA! TV',
  'Pasiones',
  'Love Nature',
  'Curiosity Channel',
  'Sun Channel',
  'RCN Novelas',
  'Rumba TV',
  'Ranchenato',
]

const canales1 = [
  'ESPN',
  'ESPN 2',
  'ESPN 3',
  'ESPN 4',
  'ESPN 5',
  'ESPN 6',
  'ESPN 7',
  'Disney Channel',
  'Disney Junior',
  'Baby TV',
  'National Geographic',
  'Star Channel',
  'FX',
  'Cinecanal',
  'Golden',
  'Golden Edge',
  'TLNovelas',
  'Bitme',
  'Las Estrellas',
  'De Película HD',
  'Distrito Comedia',
  'Univision',
  'TVE',
  'Telehit',
  'Bandamax',
]

const canales2 = [
  'Win Sports',
  '24h',
  'Clan',
  'El Gourmet',
  'Caracol Internacional',
  'Canal E',
  'Star TVE',
  'Film & Arts',
  'AMC',
  'Mi Gente',
  'AMC Series',
]

export const parrillasTv: ParrillaTv[] = [
  {
    id: 'flex',
    titulo: 'Plan Flex',
    imagen: { src: '/tv/parrilla-flex.jpg', width: 1080, height: 1369 },
    canales: flex,
  },
  {
    id: 'canales-1',
    titulo: 'Deportes, cine e infantiles',
    imagen: { src: '/tv/canales-1.jpg', width: 591, height: 867 },
    canales: canales1,
  },
  {
    id: 'canales-2',
    titulo: 'Más canales',
    imagen: { src: '/tv/canales-2.jpg', width: 408, height: 778 },
    canales: canales2,
  },
]

export const planesTv: PlanTv[] = [
  {
    id: 'free',
    nombre: 'Free',
    descripcion: 'Empieza a ver TV en vivo con NUPLIN. Pregunta qué canales incluye.',
  },
  {
    id: 'flex',
    nombre: 'Flex',
    descripcion: `${flex.length} canales nacionales, de noticias, series, cine y variedades.`,
    parrilla: 'flex',
  },
  {
    id: 'premium',
    nombre: 'Premium',
    descripcion: 'La experiencia más completa, con deportes, cine e infantiles.',
    incluye: {
      nombre: 'Win Sports+',
      logo: { src: '/tv/win-sports-plus.png', width: 480, height: 192 },
    },
  },
]
