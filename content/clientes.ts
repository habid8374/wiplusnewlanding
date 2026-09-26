import type { ClienteEmpresarial } from '@/lib/types'

/**
 * Clientes corporativos (lista enviada por WIPLUS).
 * TODO(WIPLUS): confirmar la escritura exacta de «Berboj Salub» y enviar los logos
 * (se suben en CMS › Clientes empresariales; mientras tanto se muestra el nombre).
 */
const nombres = [
  'Supergiros',
  'Lewis',
  'Olmos Drill',
  'Berboj Salub',
  'Colegio Howard',
  'Inversiones Noreña',
  'Elecnor',
  'Deltec',
]

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')

export const clientes: ClienteEmpresarial[] = nombres.map((nombre) => ({
  id: slug(nombre),
  nombre,
  sector: null,
  logo: null,
}))
