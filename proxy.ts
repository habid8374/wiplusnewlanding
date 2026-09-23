import { NextResponse, type NextRequest } from 'next/server'

/**
 * URLs de WordPress con parámetro (?p=123, ?page_id=…) → inicio con 301 y sin parámetros.
 * Solo se ejecuta en "/" cuando viene alguno de esos parámetros (ver matcher).
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.search = ''
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: [
    { source: '/', has: [{ type: 'query', key: 'p' }] },
    { source: '/', has: [{ type: 'query', key: 'page_id' }] },
    { source: '/', has: [{ type: 'query', key: 'cat' }] },
  ],
}
