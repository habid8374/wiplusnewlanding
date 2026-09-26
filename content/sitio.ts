import type { SiteSettings } from '@/lib/types'

/** Datos reales del negocio (fuente: brief y volante oficial del cliente). */
export const sitio: SiteSettings = {
  nombre: 'WIPLUS Comunicaciones',
  eslogan: 'La mejor fibra óptica. En Wiplus tenemos planes para todos',
  dominio: 'https://www.wiplus.com.co',
  telefonos: [
    { numero: '301 213 3151', etiqueta: 'Llamadas y ventas empresariales' },
    { numero: '300 788 8808', etiqueta: 'WhatsApp' },
  ],
  // WhatsApp según el volante oficial. Se puede sobrescribir con NEXT_PUBLIC_WHATSAPP_NUMBER o desde el CMS.
  whatsapp: '573007888808',
  // Ventas de planes empresariales (indicado por WIPLUS).
  whatsappEmpresas: '573012133151',
  correo: 'wipluscomunicaciones@gmail.com',
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
    instagram: 'https://www.instagram.com/wipluscomunicaciones1',
  },
  // Portal de facturación y pagos (WispHub).
  // TODO(WIPLUS): si WispHub les asignó una dirección propia del portal de clientes, ponerla aquí o en el CMS.
  portalClientes: 'https://wisphub.net',
  experienciaAnios: 7,
  // Zonas con cobertura confirmadas por WIPLUS.
  municipiosCobertura: [
    'Sabanalarga',
    'Luruaco',
    'La Peña',
    'Aguada de Pablo',
    'Hibácharo',
    'Leña',
    'Palmar de Candelaria',
  ],
  mision:
    'Estamos comprometidos con llevar conectividad a los hogares y empresas de Sabanalarga y sus alrededores, con un servicio de internet óptimo y de primera calidad a precios accesibles.',
  vision:
    'Ser la empresa número uno en telecomunicaciones de la región del Atlántico, llegando a todos sus municipios con la mejor calidad en conectividad y los mejores precios.',
  razonSocial: 'WIPLUS COMUNICACIONES DE COLOMBIA SAS',
  nit: '901194958-0',
}
