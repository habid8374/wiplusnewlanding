/** Constantes de formularios sin dependencias (para no cargar Zod en el bundle inicial). */
export const MUNICIPIOS = ['Sabanalarga', 'Luruaco', 'Otro'] as const
export const TIPOS_FALLA = ['Sin servicio', 'Internet lento', 'Intermitente', 'Otro'] as const
/** Motivos de una solicitud desde el verificador de cobertura. */
export const MOTIVOS_COBERTURA = [
  'barrio_no_aparece',
  'avisame',
  'parcial_confirmar',
  'quiero_contratar',
] as const

/** Tipos de PQR (Régimen de Protección de los Usuarios, CRC). */
export const TIPOS_PQR = [
  'Petición',
  'Queja o reclamo',
  'Recurso de reposición',
  'Recurso de reposición y en subsidio de apelación',
  'Sugerencia',
] as const
