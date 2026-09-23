import { NextResponse, type NextRequest } from 'next/server'

const PARAMS_WORDPRESS = ['p', 'page_id', 'cat']

/**
 * URLs de WordPress con parámetro (?p=123, ?page_id=…, ?cat=…) → inicio con 301 y sin parámetros.
 * Se revisan los parámetros aquí además del matcher, porque algunos adaptadores (OpenNext)
 * no aplican las condiciones `has` del matcher.
 */
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl
  if (!PARAMS_WORDPRESS.some((p) => searchParams.has(p))) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.search = ''
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: ['/'],
}
