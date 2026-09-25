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

  test('barrio que no aparece: formulario con API simulada', async ({ page }) => {
    let enviado: Record<string, unknown> | null = null
    await page.route('**/api/cobertura/solicitud', async (route) => {
      enviado = route.request().postDataJSON()
      await route.fulfill({ json: { ok: true, mensaje: 'Un asesor te contactará.' } })
    })
    const { v } = await buscar(page, cobertura[0].nombre, 'Barrio Inventado Xyz')
    await v.getByRole('button', { name: 'Verificar' }).click()
    const r = v.getByTestId('resultado-cobertura')
    await expect(r).toHaveAttribute('data-estado', 'no_aparece')
    const form = r.getByTestId('form-solicitudCobertura')
    await expect(form.getByLabel(/Barrio o vereda/)).toHaveValue('Barrio Inventado Xyz')
    await form.getByLabel(/Nombre/).fill('Ana Pérez')
    await form.getByLabel(/Celular/).fill('3012133151')
    await form.getByRole('checkbox', { name: /Acepto la política/ }).check()
    await form.getByRole('button', { name: 'Enviar' }).click()
    await expect(r.getByTestId('form-solicitudCobertura-exito')).toBeVisible()
    expect(enviado).toMatchObject({
      motivo: 'barrio_no_aparece',
      municipio: cobertura[0].nombre,
      barrio: 'Barrio Inventado Xyz',
      aceptaPolitica: true,
    })
    const eventos = await page.evaluate(() => window.__wiplusEvents ?? [])
    expect(eventos.map((e) => e.name)).toEqual(
      expect.arrayContaining(['cobertura_no_aparece', 'cobertura_solicitud']),
    )
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
