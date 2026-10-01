import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { cobertura } from '../../content/cobertura'
import type { EstadoCobertura } from '../../lib/types'
import { cerrarCookies, WHATSAPP } from './helpers'

// Datos del respaldo local (las pruebas corren sin Sanity). Se toma el primer barrio de cada
// estado, así las pruebas siguen sirviendo cuando llegue la lista real.
const barrioCon = (estado: EstadoCobertura) => {
  for (const m of cobertura) {
    const b = m.barrios.find((x) => x.estado === estado)
    if (b) return { municipio: m, barrio: b }
  }
  throw new Error(`No hay barrios en estado ${estado} en content/cobertura.ts`)
}

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

async function buscar(page: Page, municipio: string, texto: string) {
  const v = page.getByTestId('verificador-cobertura').first()
  await v.getByText(municipio, { exact: true }).click()
  const input = v.getByRole('combobox', { name: 'Barrio o vereda' })
  await input.fill(texto)
  return { v, input }
}

test.describe('Verificador de cobertura', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cobertura')
    await cerrarCookies(page)
  })

  for (const estado of ['cubierto', 'parcial', 'proximamente', 'sin_cobertura'] as const) {
    test(`muestra el resultado «${estado}» con la tarjeta correcta`, async ({ page }) => {
      const { municipio, barrio } = barrioCon(estado)
      const { v, input } = await buscar(page, municipio.nombre, barrio.nombre)
      await expect(v.getByRole('listbox')).toBeVisible()
      await input.press('ArrowDown')
      await input.press('Enter')
      const r = v.getByTestId('resultado-cobertura')
      await expect(r).toHaveAttribute('data-estado', estado)
      await expect(r).toContainText(barrio.nombre)
      await expect(page).toHaveURL(new RegExp(`municipio=${municipio.slug}&barrio=${barrio.slug}$`))
    })
  }

  test('encuentra el barrio escrito sin tildes, en minúsculas y con prefijo', async ({ page }) => {
    const { municipio, barrio } = barrioCon('cubierto')
    const { v } = await buscar(
      page,
      municipio.nombre,
      `b. ${sinTildes(barrio.nombre).toLowerCase()}`,
    )
    await expect(v.getByRole('option').first()).toContainText(barrio.nombre)
  })

  test('el botón de WhatsApp lleva barrio y municipio', async ({ page }) => {
    const { municipio, barrio } = barrioCon('cubierto')
    const { v, input } = await buscar(page, municipio.nombre, barrio.nombre)
    await input.press('Enter')
    const msg = `Hola WIPLUS, estoy en el barrio ${barrio.nombre}, ${municipio.nombre} y quiero contratar internet.`
    await expect(
      v.getByTestId('resultado-cobertura').getByRole('link', { name: /Contratar por WhatsApp/ }),
    ).toHaveAttribute('href', `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`)
  })

  test('municipio con cobertura total: un barrio que no está en la lista responde que sí', async ({
    page,
  }) => {
    const m = cobertura[0]
    const { v } = await buscar(page, m.nombre, 'Barrio Inventado Xyz')
    await expect(v.getByText(`Cobertura en todos los barrios de ${m.nombre}`)).toBeVisible()
    await v.getByRole('button', { name: 'Verificar' }).click()
    const r = v.getByTestId('resultado-cobertura')
    await expect(r).toHaveAttribute('data-estado', 'cubierto_municipio')
    await expect(r).toContainText(`Tenemos cobertura en todo ${m.nombre}`)
    const msg = `Hola WIPLUS, estoy en el barrio Barrio Inventado Xyz, ${m.nombre} y quiero contratar internet.`
    await expect(r.getByRole('link', { name: /Contratar por WhatsApp/ })).toHaveAttribute(
      'href',
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    )
  })

  test('«Avísame cuando lleguen»: formulario con API simulada', async ({ page }) => {
    let enviado: Record<string, unknown> | null = null
    await page.route('**/api/cobertura/solicitud', async (route) => {
      enviado = route.request().postDataJSON()
      await route.fulfill({ json: { ok: true, mensaje: 'Te avisaremos.' } })
    })
    const { municipio, barrio } = barrioCon('sin_cobertura')
    const { v, input } = await buscar(page, municipio.nombre, barrio.nombre)
    await input.press('Enter')
    const r = v.getByTestId('resultado-cobertura')
    await expect(r).toHaveAttribute('data-estado', 'sin_cobertura')
    const form = r.getByTestId('form-solicitudCobertura')
    await form.getByLabel(/Nombre/).fill('Ana Pérez')
    await form.getByLabel(/Celular/).fill('3012133151')
    await form.getByRole('checkbox', { name: /Acepto la política/ }).check()
    await form.getByRole('button', { name: 'Avísame' }).click()
    await expect(r.getByTestId('form-solicitudCobertura-exito')).toBeVisible()
    expect(enviado).toMatchObject({
      motivo: 'avisame',
      municipio: municipio.nombre,
      barrio: barrio.nombre,
      aceptaPolitica: true,
    })
    const eventos = await page.evaluate(() => window.__wiplusEvents ?? [])
    expect(eventos.map((e) => e.name)).toEqual(expect.arrayContaining(['cobertura_solicitud']))
  })

  test('una URL compartida muestra el mismo resultado', async ({ page }) => {
    const { municipio, barrio } = barrioCon('proximamente')
    await page.goto(`/cobertura?municipio=${municipio.slug}&barrio=${barrio.slug}`)
    const r = page.getByTestId('resultado-cobertura')
    await expect(r).toHaveAttribute('data-estado', 'proximamente')
    await expect(r).toContainText(barrio.nombre)
  })

  test('funciona solo con teclado y sin errores de accesibilidad', async ({ page }, info) => {
    const { municipio, barrio } = barrioCon('parcial')
    const v = page.getByTestId('verificador-cobertura').first()
    await v.getByRole('radio', { name: municipio.nombre }).focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('Tab')
    await expect(v.getByRole('combobox')).toBeFocused()
    await page.keyboard.type(barrio.nombre)
    await page.keyboard.press('ArrowDown')
    await expect(v.getByRole('combobox')).toHaveAttribute('aria-activedescendant', /.+/)
    await page.keyboard.press('Enter')
    await expect(v.getByTestId('resultado-cobertura')).toHaveAttribute('data-estado', 'parcial')
    await page.keyboard.press('Escape')
    if (!['movil-390', 'escritorio-1280'].includes(info.project.name)) return
    const axe = await new AxeBuilder({ page })
      .include('[data-testid="verificador-cobertura"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(axe.violations.map((x) => x.id)).toEqual([])
  })
})

test('API de solicitudes: valida el motivo y acepta una solicitud correcta', async ({
  request,
}) => {
  const ip = {
    'x-real-ip': `10.7.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
  }
  const datos = {
    motivo: 'avisame',
    nombre: 'Ana Pérez',
    celular: '3012133151',
    municipio: 'Sabanalarga',
    barrio: 'Centro',
    aceptaPolitica: true,
  }
  const malo = await request.post('/api/cobertura/solicitud', {
    data: { ...datos, motivo: 'otro' },
    headers: ip,
  })
  expect(malo.status()).toBe(400)
  const bueno = await request.post('/api/cobertura/solicitud', { data: datos, headers: ip })
  expect(bueno.status()).toBe(200)
  expect((await bueno.json()).mensaje).toContain('Te avisaremos')
})

test.describe('Páginas por zona (SEO local)', () => {
  test('cada zona tiene su página con título propio y está en el sitemap', async ({
    page,
    request,
  }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const [slug, nombre] of [
      ['sabanalarga', 'Sabanalarga'],
      ['la-pena', 'La Peña'],
      ['palmar-de-candelaria', 'Palmar de Candelaria'],
    ]) {
      expect(sitemap).toContain(`/cobertura/${slug}</loc>`)
      await page.goto(`/cobertura/${slug}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        `Internet por fibra óptica en ${nombre}`,
      )
      await expect(page).toHaveTitle(new RegExp(`Internet por fibra óptica en ${nombre}`))
    }
  })

  test('zona inexistente responde 404', async ({ page }) => {
    const r = await page.goto('/cobertura/no-existe')
    expect(r?.status()).toBe(404)
  })
})

test('el pie enlaza la página de cada zona', async ({ page }) => {
  await page.goto('/')
  for (const slug of ['sabanalarga', 'hibacharo', 'lena', 'palmar-de-candelaria']) {
    await expect(page.locator(`footer a[href="/cobertura/${slug}"]`)).toHaveCount(1)
  }
})

test.describe('Planes por zona', () => {
  test('Luruaco muestra sus propios planes y precios', async ({ page }) => {
    await page.goto('/cobertura/luruaco')
    const planes = page.locator('#planes')
    for (const [mb, precio] of [
      [50, '60.000'],
      [100, '80.000'],
      [150, '100.000'],
      [200, '120.000'],
    ] as const) {
      await expect(planes.locator(`#plan-luruaco-${mb}`)).toContainText(precio)
    }
    await expect(planes.locator('#plan-luruaco-50 a[data-plan="50"]')).toHaveAttribute(
      'href',
      new RegExp(encodeURIComponent('plan de 50 Mb en Luruaco')),
    )
  })

  for (const slug of ['la-pena', 'aguada-de-pablo', 'hibacharo', 'lena', 'palmar-de-candelaria']) {
    test(`${slug}: planes de 20 a 100 Mb sin precio`, async ({ page }) => {
      await page.goto(`/cobertura/${slug}`)
      const planes = page.locator('#planes')
      await expect(planes).toContainText('Planes desde 20 hasta 100 Mb')
      await expect(planes).toContainText('Consulta el precio')
      await expect(planes).not.toContainText('$')
      await expect(planes.getByRole('link', { name: /Consultar por WhatsApp/ })).toBeVisible()
    })
  }

  test('Planes Hogar separa los planes por municipio', async ({ page }) => {
    await page.goto('/planes-hogar')
    await expect(page.locator('#planes h2')).toHaveText('Planes en Sabanalarga')
    await expect(page.locator('#planes-luruaco')).toContainText('120.000')
    await expect(page.locator('#otras-zonas')).toContainText('Planes desde 20 hasta 100 Mb')
  })
})
