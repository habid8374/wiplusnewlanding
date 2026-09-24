/**
 * Tipos del contenido editable del sitio.
 * La misma forma la devuelven Sanity (vía consultas GROQ con proyección) y el respaldo local en /content.
 *
 * `ejemplo: true` marca contenido de relleno pendiente de datos reales de WIPLUS:
 * se muestra con la etiqueta [EJEMPLO] fuera de producción y se oculta en producción.
 */

export type Imagen = {
  src: string
  alt: string
  width?: number
  height?: number
}

export type Telefono = {
  numero: string // formato visible: "301 213 3151"
  etiqueta?: string
}

export type SiteSettings = {
  nombre: string
  eslogan: string
  dominio: string
  telefonos: Telefono[]
  /** Solo dígitos con indicativo, p. ej. 573012133151 */
  whatsapp: string
  correo: string
  direccion: {
    calle: string
    municipio: string
    departamento: string
    pais: string
  }
  geo: { lat: number; lng: number }
  horario: {
    texto: string // "8:00 a. m. – 6:00 p. m."
    dias: string // "Lunes a sábado"
    abre: string // "08:00"
    cierra: string // "18:00"
    /** Días en formato schema.org (Monday, Tuesday…) */
    diasSchema: string[]
  }
  redes: { facebook?: string; instagram?: string; tiktok?: string }
  experienciaAnios: number
  municipiosCobertura: string[]
  mision: string
  vision: string
  razonSocial?: string | null
  nit?: string | null
}

export type Plan = {
  id: string
  nombre: string
  velocidadMb: number
  /** Precio mensual en COP. null = "Consulta el precio" */
  precio: number | null
  destacado: boolean
  etiqueta?: string | null
  idealPara: string
  beneficios: string[]
  orden: number
  ejemplo?: boolean
}

export type Faq = {
  id: string
  pregunta: string
  respuesta: string
  categorias: FaqCategoria[]
  ejemplo?: boolean
}

export type FaqCategoria = 'general' | 'planes' | 'soporte' | 'pagos' | 'cobertura' | 'empresas'

export type Testimonio = {
  id: string
  nombre: string
  contexto: string // "Barrio X, Sabanalarga" o "Gerente, Empresa Y"
  texto: string
  ejemplo?: boolean
}

export type ClienteEmpresarial = {
  id: string
  nombre: string
  sector?: string | null
  logo?: Imagen | null
  ejemplo?: boolean
}

export type EstadoBarrio = 'disponible' | 'proximamente'

export type Barrio = {
  nombre: string
  estado: EstadoBarrio
  ejemplo?: boolean
}

export type Municipio = {
  id: string
  nombre: string
  departamento: string
  geo: { lat: number; lng: number }
  barrios: Barrio[]
}

export type Aviso = {
  id: string
  texto: string
  enlace?: { texto: string; href: string } | null
  tono: 'info' | 'promo' | 'alerta'
  activo: boolean
  desde?: string | null
  hasta?: string | null
  ejemplo?: boolean
}

export type MedioPago = {
  id: string
  nombre: string
  descripcion: string
  ejemplo?: boolean
}

export type InfoPagos = {
  medios: MedioPago[]
  fechasCorte: string
  notas: string[]
  fechasEjemplo?: boolean
}

export type OfertaEmpresarial = {
  titulo: string
  descripcion: string
  beneficios: { titulo: string; descripcion: string }[]
  velocidades: string[]
}

export type Foto = Imagen & { id: string; ejemplo?: boolean }
