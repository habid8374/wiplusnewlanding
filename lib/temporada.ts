/**
 * Temporada navideña del sitio: nieve, guirnalda de fibra, saludo y superhéroe con gorro.
 * Se activa y se quita sola entre estas fechas (hora de Colombia).
 * Para verla antes de tiempo: abrir cualquier página con ?navidad=1 (dura la sesión del navegador).
 */
export const NAVIDAD = {
  desde: '2026-12-01T00:00:00-05:00',
  hasta: '2027-01-07T00:00:00-05:00',
} as const

export function esNavidad(fecha: Date = new Date()) {
  return fecha >= new Date(NAVIDAD.desde) && fecha < new Date(NAVIDAD.hasta)
}
