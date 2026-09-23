import type { Municipio } from '@/lib/types'

/**
 * Cobertura. Municipios reales: Sabanalarga y Luruaco.
 * TODO(WIPLUS): lista real de barrios/veredas con servicio. Los barrios actuales son de EJEMPLO
 * (no se muestran en producción). Mientras tanto, cualquier búsqueda responde "consúltanos".
 */
export const cobertura: Municipio[] = [
  {
    id: 'sabanalarga',
    nombre: 'Sabanalarga',
    departamento: 'Atlántico',
    geo: { lat: 10.6297, lng: -74.916 },
    barrios: [
      { nombre: 'Barrio de ejemplo 1', estado: 'disponible', ejemplo: true },
      { nombre: 'Barrio de ejemplo 2', estado: 'disponible', ejemplo: true },
      { nombre: 'Barrio de ejemplo 3', estado: 'proximamente', ejemplo: true },
    ],
  },
  {
    id: 'luruaco',
    nombre: 'Luruaco',
    departamento: 'Atlántico',
    geo: { lat: 10.6103, lng: -75.142 },
    barrios: [
      { nombre: 'Barrio de ejemplo 4', estado: 'disponible', ejemplo: true },
      { nombre: 'Vereda de ejemplo 5', estado: 'proximamente', ejemplo: true },
    ],
  },
]
