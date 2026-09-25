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
  /** Enlace de Google Maps a la oficina (botón «Cómo llegar»). */
  mapsUrl?: string
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

export type EstadoCobertura = 'cubierto' | 'parcial' | 'proximamente' | 'sin_cobertura'
export type TipoZona = 'barrio' | 'urbanizacion' | 'sector' | 'vereda' | 'corregimiento'

/** Barrio tal como llega al navegador (sin notaInterna ni campos internos). */
export type Barrio = {
  id: string
  slug: string
  nombre: string
  tipo: TipoZona
  estado: EstadoCobertura
  alias: string[]
  notaPublica?: string | null
  /** Dato de muestra: se oculta en producción y muestra el aviso «Datos de muestra». */
  demo?: boolean
}

export type Municipio = {
  id: string
  slug: string
  nombre: string
  departamento: string
  geo?: { lat: number; lng: number } | null
  /** WhatsApp propio del municipio; vacío = el general del sitio. */
  whatsapp?: string | null
  barrios: Barrio[]
}

/** Textos del verificador (CMS › Cobertura › Configuración). {barrio} y {municipio} se reemplazan. */
export type ConfigCobertura = {
  titulo: string
  mensajes: Record<EstadoCobertura | 'noAparece', string>
  mostrarAvisoDemo: boolean
  /** Publica también los barrios de muestra (pruebas/demostraciones). */
  mostrarMuestras: boolean
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

/** Producto u oferta dentro de la burbuja flotante. */
export type OfertaItem = {
  id: string
  titulo: string
  imagen?: Imagen | null
  /** Precio en COP. null ⇒ «Consulta el precio». */
  precio?: number | null
  /** Texto junto al precio, p. ej. «/mes». */
  detallePrecio?: string | null
  /** Ruta o URL. Vacío ⇒ WhatsApp con el nombre de la oferta. */
  enlace?: string | null
}

/** Burbuja flotante con el logo de WIPLUS que abre un panel de ofertas (CMS › Oferta flotante). */
export type OfertaFlotante = {
  /** Cambia con cada publicación: al cambiar, la burbuja vuelve a mostrarse aunque se haya cerrado. */
  version: string
  insignia: string
  mensaje?: string | null
  titulo: string
  pie?: string | null
  items: OfertaItem[]
  desde?: string | null
  hasta?: string | null
  ejemplo?: boolean
}
