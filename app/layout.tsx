import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import {
  BING_SITE_VERIFICATION,
  GOOGLE_SITE_VERIFICATION,
  IS_PRODUCTION_SITE,
  SITE_URL,
} from '@/lib/env'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'optional', // evita el reemplazo tardío de la fuente (mejor LCP/CLS en móvil)
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Internet por fibra óptica en Sabanalarga y Luruaco | WIPLUS Comunicaciones',
    template: '%s | WIPLUS Comunicaciones',
  },
  description:
    'Internet por fibra óptica para hogares y empresas en Sabanalarga y Luruaco, Atlántico. Planes hasta 300 Mb, soporte local y contratación por WhatsApp.',
  applicationName: 'WIPLUS Comunicaciones',
  keywords: [
    'internet fibra óptica Sabanalarga',
    'internet hogar Luruaco',
    'internet para empresas Atlántico',
    'proveedor de internet Sabanalarga',
    'WIPLUS Comunicaciones',
  ],
  authors: [{ name: 'WIPLUS Comunicaciones' }],
  creator: 'Axentia Technologies',
  formatDetection: { telephone: false },
  openGraph: { locale: 'es_CO', type: 'website', siteName: 'WIPLUS Comunicaciones' },
  verification: {
    ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
    ...(BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': BING_SITE_VERIFICATION } } : {}),
  },
  robots: IS_PRODUCTION_SITE ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0a2a6e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  )
}
