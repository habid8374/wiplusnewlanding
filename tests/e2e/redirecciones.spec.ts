import { expect, test } from '@playwright/test'

const casos: [string, string][] = [
  ['/planes/', '/planes-hogar'],
  ['/planes', '/planes-hogar'],
  ['/comunicate/', '/contacto'],
  ['/nuestros-usuarios/', '/nosotros'],
  ['/wp-admin/', '/'],
  ['/wp-admin/post.php', '/'],
  ['/wp-login.php', '/'],
  ['/?p=123', '/'],
  ['/soporte/', '/soporte'],
]

test.describe('Redirecciones 301', () => {
  test.beforeEach(({ browserName }, info) => {
    void browserName
    test.skip(info.project.name !== 'escritorio-1280', 'Solo una vez')
  })
  for (const [desde, hacia] of casos) {
    test(`${desde} → ${hacia}`, async ({ request, baseURL }) => {
      const res = await request.get(desde, { maxRedirects: 0 })
      expect(res.status()).toBe(301)
      expect(new URL(res.headers()['location'], baseURL).pathname).toBe(hacia)
      expect(new URL(res.headers()['location'], baseURL).search).toBe('')
    })
  }

  test('sitemap y robots', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('https://www.wiplus.com.co/planes-hogar')
    expect((await request.get('/robots.txt')).status()).toBe(200)
    expect((await request.get('/opengraph-image')).headers()['content-type']).toContain('image/png')
  })
})
