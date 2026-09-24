'use client'

import { sitio } from '@/content/sitio'

/**
 * Último recurso si falla el diseño principal (ASVS V16 / OWASP A10): página mínima, sin detalles
 * técnicos, que no depende de ningún otro componente del sitio.
 */
export default function ErrorGlobal({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es-CO">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f5f8fc',
          color: '#08163c',
          padding: '1rem',
        }}
      >
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem' }}>WIPLUS Comunicaciones</h1>
          <p style={{ fontSize: '1.125rem' }}>
            Tenemos un problema temporal con el sitio. Intenta de nuevo en unos segundos o
            escríbenos por WhatsApp al {sitio.telefonos[0]?.numero}.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: 0,
              background: '#006bd6',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Intentar de nuevo
          </button>
        </main>
      </body>
    </html>
  )
}
