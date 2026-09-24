import { aviso } from './aviso'
import { clienteEmpresarial } from './clienteEmpresarial'
import { faq } from './faq'
import { infoPagos } from './infoPagos'
import { municipio } from './municipio'
import { ofertaEmpresarial } from './ofertaEmpresarial'
import { ofertaFlotante } from './ofertaFlotante'
import { plan } from './plan'
import { siteSettings } from './siteSettings'
import { testimonio } from './testimonio'

export const schemaTypes = [
  siteSettings,
  plan,
  aviso,
  ofertaFlotante,
  municipio,
  faq,
  testimonio,
  clienteEmpresarial,
  infoPagos,
  ofertaEmpresarial,
]

/** Documentos únicos (uno solo por dataset, con _id fijo). */
export const singletonTypes = new Set([
  'siteSettings',
  'infoPagos',
  'ofertaEmpresarial',
  'ofertaFlotante',
])
