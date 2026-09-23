/**
 * Sanity Studio: SPA estática compilada en public/studio (scripts/build-studio.mjs).
 * Los archivos existentes (/studio/static/*) se sirven directamente como estáticos; cualquier otra
 * ruta /studio/* devuelve el index.html del Studio, que resuelve la navegación en el navegador.
 */
async function leerIndex(request: Request) {
  const url = new URL('/studio/index.html', request.url)
  try {
    // En Cloudflare Workers se lee desde el binding de assets (sin salir a la red).
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    const assets = (getCloudflareContext().env as { ASSETS?: { fetch: typeof fetch } }).ASSETS
    if (assets) return await assets.fetch(url)
  } catch {
    // No estamos en Cloudflare (next start / Vercel): se usa HTTP.
  }
  return fetch(url)
}

export async function GET(request: Request) {
  const res = await leerIndex(request)
  if (!res.ok) return new Response('Sanity Studio no disponible', { status: 404 })
  return new Response(await res.text(), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
