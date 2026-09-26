/**
 * Municipios con servicio (datos reales). Los barrios de cada uno se generan desde
 * data/barrios-cobertura.csv en content/cobertura.ts (`npm run cobertura:importar -- --local`).
 */
export const municipiosBase = [
  {
    nombre: 'Sabanalarga',
    departamento: 'Atlántico',
    geo: { lat: 10.6297, lng: -74.916 },
    whatsapp: null,
  },
  {
    nombre: 'Luruaco',
    departamento: 'Atlántico',
    geo: { lat: 10.6103, lng: -75.142 },
    whatsapp: null,
  },
  // TODO(WIPLUS): coordenadas del centro de La Peña para el mapa (sin ellas no se muestra mapa).
  { nombre: 'La Peña', departamento: 'Atlántico', geo: null, whatsapp: null },
  // TODO(WIPLUS): coordenadas del centro de Aguada de Pablo para el mapa (sin ellas no se muestra mapa).
  { nombre: 'Aguada de Pablo', departamento: 'Atlántico', geo: null, whatsapp: null },
  // TODO(WIPLUS): coordenadas del centro de Hibácharo para el mapa (sin ellas no se muestra mapa).
  { nombre: 'Hibácharo', departamento: 'Atlántico', geo: null, whatsapp: null },
  // TODO(WIPLUS): coordenadas del centro de Leña para el mapa (sin ellas no se muestra mapa).
  { nombre: 'Leña', departamento: 'Atlántico', geo: null, whatsapp: null },
  // TODO(WIPLUS): coordenadas del centro de Palmar de Candelaria para el mapa (sin ellas no se muestra mapa).
  { nombre: 'Palmar de Candelaria', departamento: 'Atlántico', geo: null, whatsapp: null },
] as const
