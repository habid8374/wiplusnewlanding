import type { Page } from '@playwright/test'

export const PAGINAS = [
  { path: '/', h1: /Internet por fibra óptica en Sabanalarga/ },
  { path: '/planes-hogar', h1: /Planes de internet para tu hogar/ },
  { path: '/planes-empresas', h1: /Internet para empresas/ },
  { path: '/cobertura', h1: /¿Llegamos a tu barrio\?/ },
  { path: '/soporte', h1: /Soporte técnico/ },
  { path: '/pagos', h1: /Paga tu servicio/ },
  { path: '/nosotros', h1: /Conectamos a Sabanalarga/ },
  { path: '/contacto', h1: /Hablemos/ },
  { path: '/usuario', h1: /Protección al usuario/ },
  { path: '/politica-de-datos', h1: /Política de tratamiento de datos/ },
  { path: '/terminos', h1: /Términos y condiciones/ },
  { path: '/mapa-del-sitio', h1: /Mapa del sitio/ },
] as const

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573012133151'

/** Acepta/rechaza el aviso de cookies para que no tape elementos. */
export async function cerrarCookies(page: Page) {
  const rechazar = page
    .getByRole('region', { name: 'Aviso de cookies' })
    .getByRole('button', { name: 'Rechazar' })
  if (await rechazar.isVisible().catch(() => false)) await rechazar.click()
}

/** Registra errores de consola (se ignoran recursos de terceros bloqueados por red). */
export function capturarErrores(page: Page) {
  const errores: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error' && !/openstreetmap|google|cloudflare|openspeedtest/i.test(m.text()))
      errores.push(m.text())
  })
  page.on('pageerror', (e) => errores.push(e.message))
  return errores
}
