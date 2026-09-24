import type { NextConfig } from 'next'
import { securityHeaders, studioHeaders } from './lib/security-headers'

/** Redirecciones 301 desde las URLs del sitio WordPress anterior. */
const legacyRedirects: [string, string][] = [
  ['/planes', '/planes-hogar'],
  ['/planes/', '/planes-hogar'],
  ['/comunicate', '/contacto'],
  ['/comunicate/', '/contacto'],
  ['/nuestros-usuarios', '/nosotros'],
  ['/nuestros-usuarios/', '/nosotros'],
  ['/wp-admin', '/'],
  ['/wp-admin/:path*', '/'],
  ['/wp-login.php', '/'],
  ['/wp-json/:path*', '/'],
  ['/feed', '/'],
  ['/feed/', '/'],
  ['/xmlrpc.php', '/'],
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // La barra final se redirige con 301 en redirects() (Next usaría 308 y dos saltos para URLs de WordPress).
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // 50: fotos de fondo del hero (van bajo una capa de color, la compresión no se nota)
    qualities: [50, 75],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    return [
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301 as const,
      })),
      // Cualquier otra URL con barra final → sin barra (301).
      { source: '/:path+/', destination: '/:path+', statusCode: 301 as const },
    ]
  },
  async headers() {
    return [
      // Todo el sitio salvo /studio (ver lib/security-headers.ts)
      { source: '/((?!studio).*)', headers: securityHeaders },
      { source: '/studio/:path*', headers: studioHeaders },
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
