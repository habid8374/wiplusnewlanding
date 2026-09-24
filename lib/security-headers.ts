/**
 * Cabeceras de seguridad (OWASP A02 Configuración de seguridad / A05 Inyección).
 * La CSP enumera los únicos orígenes externos que usa el sitio público:
 * Google Analytics (con consentimiento), Cloudflare Turnstile, mapas de Google,
 * OpenSpeedTest, imágenes de Sanity y la barra de Vercel en las vistas previas.
 * /studio (Sanity Studio) queda fuera: es una SPA de terceros con sus propias conexiones.
 */
const csp = [
  "default-src 'self'",
  // Next.js inyecta scripts en línea para hidratar páginas estáticas (sin nonce para no perder el prerender).
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.google-analytics.com https://*.googletagmanager.com https://vercel.live https://vercel.com",
  "font-src 'self' data: https://vercel.live",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com https://vercel.live wss://ws-us3.pusher.com",
  'frame-src https://challenges.cloudflare.com https://www.google.com https://maps.google.com https://openspeedtest.com https://vercel.live',
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

export const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
]

/** Para /studio: las mismas cabeceras salvo la CSP (el Studio carga y conecta con *.sanity.io). */
export const studioHeaders = securityHeaders.filter((h) => h.key !== 'Content-Security-Policy')
