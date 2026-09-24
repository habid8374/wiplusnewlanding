import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { sitio } from '@/content'
import { WHATSAPP_OVERRIDE } from '@/lib/env'

/**
 * Tarjeta para compartir (Open Graph / Twitter / WhatsApp): 1200×630.
 * Se genera en el build (estática). Tipografía de marca: Plus Jakarta Sans (OFL, en assets/og).
 */
export const OG_SIZE = { width: 1200, height: 630 }
export { OG_ALT } from './og-alt'

const archivo = (ruta: string) => readFile(join(process.cwd(), ruta))

export async function renderOgCard() {
  const [logo, f500, f700, f800] = await Promise.all([
    archivo('public/brand/wiplus-logo.png'),
    archivo('assets/og/plus-jakarta-sans-latin-500-normal.woff'),
    archivo('assets/og/plus-jakarta-sans-latin-700-normal.woff'),
    archivo('assets/og/plus-jakarta-sans-latin-800-normal.woff'),
  ])
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`
  // Mismo número que usan los botones (NEXT_PUBLIC_WHATSAPP_NUMBER o content/sitio.ts), sin el 57.
  const wa = (WHATSAPP_OVERRIDE || sitio.whatsapp).replace(/^57/, '')
  const whatsapp = `${wa.slice(0, 3)} ${wa.slice(3, 6)} ${wa.slice(6)}`
  const chips = [
    'Hasta 100 Mb',
    'Soporte técnico local',
    `+${sitio.experienciaAnios} años de experiencia`,
  ]

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        fontFamily: 'Jakarta',
        color: '#ffffff',
        backgroundImage: 'linear-gradient(135deg, #08163c 0%, #0a2a6e 55%, #0054aa 100%)',
      }}
    >
      {/* Brillos de fondo */}
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: 9999,
          backgroundImage:
            'radial-gradient(circle, rgba(0,187,254,0.35) 0%, rgba(0,187,254,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -220,
          left: 260,
          width: 520,
          height: 520,
          borderRadius: 9999,
          backgroundImage:
            'radial-gradient(circle, rgba(2,132,255,0.30) 0%, rgba(2,132,255,0) 70%)',
        }}
      />
      {/* Franja inferior de acento */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 10,
          backgroundImage: 'linear-gradient(90deg, #00bbfe, #0284ff, #0a3d8a)',
        }}
      />

      <div
        style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '56px 64px 66px' }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 400,
            height: 400,
            borderRadius: 48,
            backgroundColor: '#ffffff',
            boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
            flexShrink: 0,
          }}
        >
          {/* ImageResponse (Satori) solo admite <img>; next/image no aplica aquí. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={340} height={270} alt="" style={{ objectFit: 'contain' }} />
        </div>

        {/* Texto */}
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 56, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              color: '#66d8ff',
              letterSpacing: 1,
            }}
          >
            INTERNET POR FIBRA ÓPTICA
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              marginTop: 14,
              letterSpacing: -1.5,
            }}
          >
            <span>Sabanalarga</span>
            <span>y Luruaco</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 500,
              color: '#d2e8ff',
              marginTop: 14,
            }}
          >
            Hogares y empresas · Atlántico, Colombia
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{
                  display: 'flex',
                  fontSize: 22,
                  fontWeight: 700,
                  padding: '10px 18px',
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                {c}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 34 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                fontWeight: 800,
                padding: '12px 22px',
                borderRadius: 999,
                backgroundColor: '#15803d',
              }}
            >
              WhatsApp {whatsapp}
            </div>
            <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#ffffff' }}>
              wiplus.com.co
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Jakarta', data: f500, weight: 500, style: 'normal' },
        { name: 'Jakarta', data: f700, weight: 700, style: 'normal' },
        { name: 'Jakarta', data: f800, weight: 800, style: 'normal' },
      ],
    },
  )
}
