import { expect, test } from '@playwright/test'

// IP distinta por prueba para no chocar con el límite de 8 envíos (que se prueba aparte).
const ip = () => ({
  'x-real-ip': `10.9.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
})

/** Controles del OWASP Top 10 verificables desde fuera (ver SECURITY.md). */
test.describe('Seguridad', () => {
  test('cabeceras de seguridad en las páginas públicas', async ({ request }) => {
    const res = await request.get('/')
    const h = res.headers()
    expect(h['content-security-policy']).toContain("frame-ancestors 'self'")
    expect(h['content-security-policy']).toContain("object-src 'none'")
    expect(h['strict-transport-security']).toContain('max-age=')
    expect(h['x-content-type-options']).toBe('nosniff')
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(h['x-powered-by']).toBeUndefined()
  })

  test('/studio no lleva la CSP del sitio pero sí el resto de cabeceras', async ({ request }) => {
    const h = (await request.get('/studio')).headers()
    expect(h['content-security-policy']).toBeUndefined()
    expect(h['x-content-type-options']).toBe('nosniff')
  })

  test('los formularios rechazan envíos desde otro sitio y sin JSON', async ({ request }) => {
    const datos = {
      nombre: 'Ana',
      celular: '3012133151',
      asunto: 'Hola',
      mensaje: 'Mensaje de prueba.',
    }
    const otroSitio = await request.post('/api/contacto', {
      data: datos,
      headers: { ...ip(), origin: 'https://sitio-malicioso.example' },
    })
    expect(otroSitio.status()).toBe(403)
    const textoPlano = await request.post('/api/contacto', {
      data: JSON.stringify(datos),
      headers: { ...ip(), 'content-type': 'text/plain' },
    })
    expect(textoPlano.status()).toBe(403)
  })

  test('/api/revalidate exige firma', async ({ request }) => {
    const res = await request.post('/api/revalidate', { data: { _type: 'plan' } })
    expect([401, 500]).toContain(res.status())
  })

  test('las APIs no se guardan en caché y solo aceptan POST', async ({ request }) => {
    const res = await request.post('/api/contacto', { data: { nombre: 'A' }, headers: ip() })
    expect(res.headers()['cache-control']).toContain('no-store')
    expect((await request.get('/api/contacto')).status()).toBe(405)
  })

  test('security.txt publicado', async ({ request }) => {
    const res = await request.get('/.well-known/security.txt')
    expect(res.status()).toBe(200)
    expect(await res.text()).toContain('Contact:')
  })
})
