import type { ClienteEmpresarial } from '@/lib/types'

/**
 * Clientes corporativos (lista enviada por WIPLUS). Los `id` no cambian aunque cambie el nombre:
 * son los mismos documentos en Sanity (`cliente-<id>`).
 * Logos en public/clientes/. Los de Berboj Salud IPS e Inversiones Noreña se redibujaron (foto de la fachada y captura del sitio anterior).
 * TODO(WIPLUS): logo de Olmos Drill (se suben en CMS › Clientes empresariales; mientras
 * tanto se muestra el nombre).
 */
const logo = (archivo: string, nombre: string, width: number, height: number) => ({
  src: `/clientes/${archivo}`,
  alt: `Logo de ${nombre}`,
  width,
  height,
})

export const clientes: ClienteEmpresarial[] = [
  {
    id: 'supergiros',
    nombre: 'SuperGIROS',
    logo: logo('supergiros.png', 'SuperGIROS', 556, 179),
  },
  {
    id: 'lewis',
    nombre: 'Lewis Energy Group',
    logo: logo('lewis-energy-group-logo.png', 'Lewis Energy Group', 503, 204),
  },
  { id: 'olmos-drill', nombre: 'Olmos Drill' },
  {
    id: 'berboj-salub',
    nombre: 'Berboj Salud IPS',
    logo: logo('berboj-salud-ips.png', 'Berboj Salud IPS', 372, 369),
  },
  {
    id: 'colegio-howard',
    nombre: 'Howard Gardner Bilingual School',
    logo: logo('howard-gardner.jpg', 'Howard Gardner Bilingual School', 420, 403),
  },
  {
    id: 'inversiones-norena',
    nombre: 'Inversiones Noreña',
    logo: logo('inversiones-norena.png', 'Inversiones Noreña', 548, 192),
  },
  { id: 'elecnor', nombre: 'Elecnor', logo: logo('elecnor.png', 'Elecnor', 678, 267) },
  { id: 'deltec', nombre: 'Deltec S.A.', logo: logo('deltec.png', 'Deltec S.A.', 588, 136) },
].map((c) => ({ sector: null, logo: null, ...c }))
