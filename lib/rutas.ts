/**
 * Fuente única de las páginas públicas: la usan app/sitemap.ts (XML para buscadores)
 * y la página /mapa-del-sitio (para personas). Al crear una página nueva, agrégala aquí.
 */
export type Ruta = {
  path: string
  titulo: string
  descripcion: string
  grupo: 'Servicios' | 'Clientes' | 'Empresa' | 'Legal'
  prioridad: number
  frecuencia: 'weekly' | 'monthly' | 'yearly'
}

export const RUTAS: Ruta[] = [
  {
    path: '/',
    titulo: 'Inicio',
    descripcion: 'Internet por fibra óptica en Sabanalarga y Luruaco.',
    grupo: 'Servicios',
    prioridad: 1,
    frecuencia: 'weekly',
  },
  {
    path: '/planes-hogar',
    titulo: 'Planes hogar',
    descripcion: 'Planes de 100 a 300 Mb desde $60.000, comparativo y contratación por WhatsApp.',
    grupo: 'Servicios',
    prioridad: 0.9,
    frecuencia: 'weekly',
  },
  {
    path: '/planes-empresas',
    titulo: 'Internet para empresas',
    descripcion: 'Canal dedicado, IP fija, soporte prioritario y cotización.',
    grupo: 'Servicios',
    prioridad: 0.8,
    frecuencia: 'monthly',
  },
  {
    path: '/cobertura',
    titulo: 'Cobertura',
    descripcion: 'Municipios y barrios con servicio y verificador de dirección.',
    grupo: 'Servicios',
    prioridad: 0.8,
    frecuencia: 'weekly',
  },
  {
    path: '/soporte',
    titulo: 'Soporte técnico',
    descripcion: 'Reporte de fallas con ticket, guía rápida y test de velocidad.',
    grupo: 'Clientes',
    prioridad: 0.6,
    frecuencia: 'monthly',
  },
  {
    path: '/pagos',
    titulo: 'Pagos',
    descripcion: 'Medios de pago y fechas de corte.',
    grupo: 'Clientes',
    prioridad: 0.6,
    frecuencia: 'monthly',
  },
  {
    path: '/pqr',
    titulo: 'Radicar PQR',
    descripcion: 'Formulario para peticiones, quejas, reclamos y recursos, con número de radicado.',
    grupo: 'Clientes',
    prioridad: 0.5,
    frecuencia: 'yearly',
  },
  {
    path: '/usuario',
    titulo: 'Protección al usuario y PQR',
    descripcion: 'Derechos, deberes y cómo presentar peticiones, quejas y recursos.',
    grupo: 'Clientes',
    prioridad: 0.4,
    frecuencia: 'yearly',
  },
  {
    path: '/nosotros',
    titulo: 'Nosotros',
    descripcion: 'Historia, misión, visión y clientes empresariales.',
    grupo: 'Empresa',
    prioridad: 0.5,
    frecuencia: 'yearly',
  },
  {
    path: '/contacto',
    titulo: 'Contacto',
    descripcion: 'Teléfonos, WhatsApp, correo, oficina y horario.',
    grupo: 'Empresa',
    prioridad: 0.7,
    frecuencia: 'yearly',
  },
  {
    path: '/mapa-del-sitio',
    titulo: 'Mapa del sitio',
    descripcion: 'Todas las páginas del sitio.',
    grupo: 'Empresa',
    prioridad: 0.2,
    frecuencia: 'yearly',
  },
  {
    path: '/politica-de-datos',
    titulo: 'Política de datos personales',
    descripcion: 'Tratamiento de datos según la Ley 1581 de 2012.',
    grupo: 'Legal',
    prioridad: 0.3,
    frecuencia: 'yearly',
  },
  {
    path: '/terminos',
    titulo: 'Términos y condiciones',
    descripcion: 'Condiciones de planes y promociones.',
    grupo: 'Legal',
    prioridad: 0.3,
    frecuencia: 'yearly',
  },
]
