'use client'

/**
 * Eventos de GA4. Solo se envían si el usuario aceptó cookies (gtag existe únicamente en ese caso).
 */
export type AnalyticsEvent =
  | { name: 'click_whatsapp'; params: { ubicacion: string; plan?: string; pagina?: string } }
  | { name: 'click_llamada'; params: { ubicacion: string; numero: string; pagina?: string } }
  | { name: 'click_portal_clientes'; params: { ubicacion: string; pagina?: string } }
  | { name: 'form_submit'; params: { tipo: string; pagina?: string } }
  | { name: 'ver_plan'; params: { plan: string; ubicacion: string } }
  | {
      name: 'verificar_cobertura'
      params: { municipio: string; barrio: string; estado: string }
    }
  | { name: 'cobertura_no_aparece'; params: { municipio: string; texto_buscado: string } }
  | { name: 'cobertura_solicitud'; params: { tipo: string } }
  | {
      name: 'oferta_flotante'
      params: { accion: 'abrir' | 'cerrar' | 'click_item'; item?: string }
    }

type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void

declare global {
  interface Window {
    gtag?: Gtag
    __wiplusEvents?: { name: string; params: Record<string, unknown> }[]
  }
}

export function track<E extends AnalyticsEvent>(name: E['name'], params: E['params']) {
  if (typeof window === 'undefined') return
  const payload = { pagina: window.location.pathname, ...params }
  // Registro local (útil para pruebas e2e y depuración).
  ;(window.__wiplusEvents ??= []).push({ name, params: payload })
  window.gtag?.('event', name, payload)
}
