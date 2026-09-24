import { IS_PRODUCTION_SITE, TURNSTILE_SITE_KEY } from '@/lib/env'

/**
 * Verificación de Cloudflare Turnstile en el servidor. Sin secreto se omite (desarrollo), salvo en
 * producción con la clave pública configurada: ahí falta la mitad de la configuración y se
 * rechaza el envío en lugar de aceptarlo sin verificar (OWASP A02, fallar de forma segura).
 */
export async function verificarTurnstile(token: string, ip?: string, host?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (IS_PRODUCTION_SITE && TURNSTILE_SITE_KEY) {
      console.error('[turnstile] Falta TURNSTILE_SECRET_KEY en producción')
      return { ok: false }
    }
    return { ok: true, omitido: true }
  }
  if (!token) return { ok: false }
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'desconocida') body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = (await res.json()) as {
      success: boolean
      hostname?: string
      'error-codes'?: string[]
    }
    // El desafío debe haberse resuelto en este mismo sitio (un token de otro sitio no sirve).
    const mismoSitio = !host || !data.hostname || data.hostname === host
    return { ok: data.success === true && mismoSitio, errores: data['error-codes'] }
  } catch (error) {
    console.error('[turnstile] Error verificando token', error)
    return { ok: false }
  }
}
