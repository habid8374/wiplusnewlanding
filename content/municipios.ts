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
] as const
