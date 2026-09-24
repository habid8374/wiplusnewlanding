/**
 * Rate limit básico por IP (ventana deslizante en memoria).
 *
 * Nota: en Cloudflare Workers la memoria es por isolate, así que el límite es "mejor esfuerzo".
 * Para un límite global, activar además una regla de Rate Limiting de Cloudflare (WAF) sobre /api/*
 * (ver README › Seguridad).
 */
const buckets = new Map<string, number[]>()
const MAX_KEYS = 5000

export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    const retryAfter = Math.ceil((windowMs - (now - hits[0])) / 1000)
    return { ok: false as const, retryAfter }
  }
  hits.push(now)
  buckets.set(key, hits)
  if (buckets.size > MAX_KEYS) {
    // Limpieza simple para no crecer sin control.
    for (const k of buckets.keys()) {
      buckets.delete(k)
      if (buckets.size <= MAX_KEYS / 2) break
    }
  }
  return { ok: true as const }
}

export function clientIp(headers: Headers) {
  return (
    headers.get('cf-connecting-ip') ||
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'desconocida'
  )
}

/** Solo para pruebas. */
export function __resetRateLimit() {
  buckets.clear()
}
