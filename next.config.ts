import type { NextConfig } from 'next'

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
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
