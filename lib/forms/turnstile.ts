/** Verificación de Cloudflare Turnstile en el servidor. Sin secreto configurado se omite (desarrollo). */
export async function verificarTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: true, omitido: true }
  if (!token) return { ok: false }
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'desconocida') body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    return { ok: data.success === true, errores: data['error-codes'] }
  } catch (error) {
    console.error('[turnstile] Error verificando token', error)
    return { ok: false }
  }
}
