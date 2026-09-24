import { expect, test } from '@playwright/test'

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
      headers: { origin: 'https://sitio-malicioso.example' },
    })
    expect(otroSitio.status()).toBe(403)
    const textoPlano = await request.post('/api/contacto', {
      data: JSON.stringify(datos),
      headers: { 'content-type': 'text/plain' },
    })
    expect(textoPlano.status()).toBe(403)
  })

  test('/api/revalidate exige firma', async ({ request }) => {
    const res = await request.post('/api/revalidate', { data: { _type: 'plan' } })
    expect([401, 500]).toContain(res.status())
  })
})
