import type { SiteSettings } from '@/lib/types'

/** Datos reales del negocio (fuente: brief del cliente). */
export const sitio: SiteSettings = {
  nombre: 'WIPLUS Comunicaciones',
  eslogan: 'Internet por fibra óptica en Sabanalarga y Luruaco',
  dominio: 'https://www.wiplus.com.co',
  telefonos: [
    { numero: '301 213 3151', etiqueta: 'Ventas y atención' },
    { numero: '300 788 8808', etiqueta: 'Atención al cliente' },
  ],
  // TODO(WIPLUS): confirmar cuál número es WhatsApp. Se puede sobrescribir con NEXT_PUBLIC_WHATSAPP_NUMBER o desde el CMS.
  whatsapp: '573012133151',
  correo: 'atencionalcliente@wiplus.com.co',
  direccion: {
    calle: 'Calle 13 #17-04',
    municipio: 'Sabanalarga',
    departamento: 'Atlántico',
    pais: 'Colombia',
  },
  geo: { lat: 10.6297, lng: -74.916 },
  mapsUrl: 'https://maps.app.goo.gl/i1Fo5RVo3neGZcT88',
  horario: {
    texto: '8:00 a. m. – 6:00 p. m.',
    // TODO(WIPLUS): confirmar días de atención (se asume lunes a sábado).
    dias: 'Lunes a sábado',
    abre: '08:00',
    cierra: '18:00',
    diasSchema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  redes: {
    facebook: 'https://www.facebook.com/wipluscomunicaciones',
  },
  experienciaAnios: 7,
  municipiosCobertura: ['Sabanalarga', 'Luruaco'],
  mision:
    'Estamos comprometidos con llevar conectividad a los hogares y empresas de Sabanalarga y sus alrededores, con un servicio de internet óptimo y de primera calidad a precios accesibles.',
  vision:
    'Ser la empresa número uno en telecomunicaciones de la región del Atlántico, llegando a todos sus municipios con la mejor calidad en conectividad y los mejores precios.',
  // TODO(WIPLUS): razón social y NIT para el pie de página y los textos legales.
  razonSocial: null,
  nit: null,
}
