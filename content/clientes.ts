import type { ClienteEmpresarial } from '@/lib/types'

/**
 * Clientes empresariales. El sitio anterior muestra 9 logos (image10-1.jpeg … image18-1.png) sin nombre.
 * TODO(WIPLUS): nombres de cada empresa, autorización para publicarlos y archivos de los logos
 * (no se pudieron descargar desde el entorno de desarrollo). Subirlos en CMS › Clientes empresariales.
 */
export const clientes: ClienteEmpresarial[] = Array.from({ length: 9 }, (_, i) => ({
  id: `cliente-${i + 1}`,
  nombre: `Empresa cliente ${i + 1}`,
  sector: null,
  logo: null,
  ejemplo: true,
}))
