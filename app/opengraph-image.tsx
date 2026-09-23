import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'WIPLUS Comunicaciones — Internet por fibra óptica en Sabanalarga y Luruaco'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const icono = await readFile(join(process.cwd(), 'public/brand/wiplus-icono-app.png'))
  const src = `data:image/png;base64,${icono.toString('base64')}`
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '72px',
        gap: '56px',
        background: 'linear-gradient(135deg, #08163c 0%, #0a2a6e 55%, #0054aa 100%)',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      }}
    >
      <img src={src} width={300} height={300} alt="" style={{ borderRadius: 48 }} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 30, color: '#66d8ff', fontWeight: 700 }}>WIPLUS Comunicaciones</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, marginTop: 16 }}>
          Internet por fibra óptica en Sabanalarga y Luruaco
        </div>
        <div style={{ fontSize: 30, marginTop: 24, color: '#d2e8ff' }}>
          Planes hasta 100 Mb · Soporte local · Contrata por WhatsApp
        </div>
      </div>
    </div>,
    size,
  )
}
