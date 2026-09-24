/** Constantes de formularios sin dependencias (para no cargar Zod en el bundle inicial). */
export const MUNICIPIOS = ['Sabanalarga', 'Luruaco', 'Otro'] as const
export const TIPOS_FALLA = ['Sin servicio', 'Internet lento', 'Intermitente', 'Otro'] as const
/** Tipos de PQR (Régimen de Protección de los Usuarios, CRC). */
export const TIPOS_PQR = [
  'Petición',
  'Queja o reclamo',
  'Recurso de reposición',
  'Recurso de reposición y en subsidio de apelación',
  'Sugerencia',
] as const
