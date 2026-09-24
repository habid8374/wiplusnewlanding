import { expect, test } from '@playwright/test'
import { capturarErrores, cerrarCookies, PAGINAS } from './helpers'

test.describe('Navegación', () => {
  for (const p of PAGINAS) {
    test(`carga ${p.path} sin errores`, async ({ page }) => {
      const errores = capturarErrores(page)
      const res = await page.goto(p.path)
      expect(res?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.h1)
      await expect(page).toHaveTitle(/WIPLUS Comunicaciones/)
      await expect(page.locator('html')).toHaveAttribute('lang', 'es-CO')
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toBe(`https://www.wiplus.com.co${p.path === '/' ? '' : p.path}`)
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy()
      // Tarjeta para compartir (WhatsApp, Facebook, X)
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https:\/\/www\.wiplus\.com\.co\/opengraph-image/,
      )
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        /twitter-image/,
      )
      // Todas las imágenes tienen alt
      expect(await page.locator('img:not([alt])').count()).toBe(0)
      await page.waitForLoadState('networkidle').catch(() => {})
      expect(errores).toEqual([])
    })
  }

  test('títulos únicos por página', async ({ page }) => {
    const titulos = new Set<string>()
    for (const p of PAGINAS) {
      await page.goto(p.path)
      titulos.add(await page.title())
    }
    expect(titulos.size).toBe(PAGINAS.length)
  })

  test('el menú lleva a cada sección', async ({ page }) => {
    await page.goto('/')
    await cerrarCookies(page)
    const movil = (page.viewportSize()?.width ?? 1280) < 1024
    if (movil) {
      await page.getByRole('button', { name: 'Abrir menú' }).click()
      await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
      await page
        .getByRole('navigation', { name: 'Menú móvil' })
        .getByRole('link', { name: 'Cobertura' })
        .click()
    } else {
      await page
        .getByRole('navigation', { name: 'Principal' })
        .getByRole('link', { name: 'Cobertura' })
        .click()
    }
    await expect(page).toHaveURL(/\/cobertura$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/¿Llegamos a tu barrio\?/)
  })

  test('el menú móvil se cierra con Escape', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1280) >= 1024, 'Solo móvil/tablet')
    await page.goto('/')
    await cerrarCookies(page)
    const boton = page.getByRole('button', { name: 'Abrir menú' })
    await boton.click()
    await expect(page.getByRole('navigation', { name: 'Menú móvil' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Menú móvil' })).toBeHidden()
    await expect(boton).toBeFocused()
  })

  test('404 útil con CTA', async ({ page }) => {
    const res = await page.goto('/pagina-que-no-existe')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/No encontramos esta página/)
    await expect(page.getByRole('main').getByRole('link', { name: /Ver planes/ })).toHaveAttribute(
      'href',
      '/planes-hogar',
    )
    await expect(page.getByRole('main').locator('a[href^="https://wa.me/"]')).toBeVisible()
  })

  for (const fuente of ['web', 'respaldo'] as const) {
    // La fuente usa display: optional; en conexiones lentas se ve la de respaldo (más ancha).
    test(`sin desbordamiento horizontal (fuente ${fuente})`, async ({ page }) => {
      if (fuente === 'respaldo') await page.route('**/*.woff2', (r) => r.abort())
      for (const p of PAGINAS) {
        await page.goto(p.path)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        )
        expect(overflow, `desborde en ${p.path}`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('teléfonos clicables', async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.locator('a[href="tel:+573012133151"]').first()).toBeVisible()
    await expect(page.locator('a[href="tel:+573007888808"]').first()).toBeAttached()
  })
})
