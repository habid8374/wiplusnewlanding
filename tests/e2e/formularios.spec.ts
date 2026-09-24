import { expect, test, type Page } from '@playwright/test'
import { cerrarCookies } from './helpers'

async function aceptar(page: Page, form: ReturnType<Page['getByTestId']>) {
  await form.getByRole('checkbox', { name: /Acepto la política/ }).check()
  void page
}

test.describe('Formularios', () => {
  test('validación en el cliente muestra errores accesibles', async ({ page }) => {
    await page.goto('/contacto')
    await cerrarCookies(page)
    const form = page.getByTestId('form-contacto')
    await form.getByRole('button', { name: 'Enviar mensaje' }).click()
    await expect(form.getByTestId('form-contacto-error')).toContainText('Revisa los campos')
    await expect(form.getByLabel(/Nombre completo/)).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByText('Debes aceptar la política')).toBeVisible()
    await expect(form.getByLabel(/Nombre completo/)).toBeFocused()
  })

  test('reporte de falla (API simulada) muestra el ticket', async ({ page }) => {
    let enviado: Record<string, unknown> | null = null
    await page.route('**/api/falla', async (route) => {
      enviado = route.request().postDataJSON()
      await route.fulfill({
        json: { ok: true, ticket: 'WP-20260101-ABCD', mensaje: 'Te contactaremos.' },
      })
    })
    await page.goto('/soporte')
    await cerrarCookies(page)
    const form = page.getByTestId('form-falla')
    await form.getByLabel(/Nombre del titular/).fill('Ana Pérez')
    await form.getByLabel(/contrato o documento/).fill('123456')
    await form.getByLabel(/Celular de contacto/).fill('301 213 3151')
    await form.getByLabel(/Tipo de falla/).selectOption('Sin servicio')
    await form.getByLabel(/Describe la falla/).fill('No tengo internet desde esta mañana.')
    await aceptar(page, form)
    await form.getByRole('button', { name: 'Reportar falla' }).click()
    await expect(page.getByTestId('form-falla-exito')).toBeVisible()
    await expect(page.getByTestId('ticket')).toHaveText('WP-20260101-ABCD')
    expect(enviado).toMatchObject({
      titular: 'Ana Pérez',
      tipo: 'Sin servicio',
      aceptaPolitica: true,
    })
  })

  test('solicitud de servicio contra la API real (correo simulado)', async ({ page }) => {
    await page.goto('/planes-hogar')
    await cerrarCookies(page)
    const form = page.getByTestId('form-solicitud')
    await form.getByLabel(/Nombre completo/).fill('Carlos Gómez')
    await form.getByLabel(/^Celular/).fill('3007888808')
    await form.getByLabel(/Municipio/).selectOption('Sabanalarga')
    await form.getByLabel(/Barrio o vereda/).fill('Centro')
    await form.getByLabel(/Dirección/).fill('Calle 10 # 20-30')
    await form.getByLabel(/Plan de interés/).selectOption('100 Mb')
    await aceptar(page, form)
    await form.getByRole('button', { name: 'Solicitar servicio' }).click()
    await expect(page.getByTestId('form-solicitud-exito')).toBeVisible()
    const eventos = await page.evaluate(() => window.__wiplusEvents ?? [])
    expect(eventos.some((e) => e.name === 'form_submit' && e.params.tipo === 'solicitud')).toBe(
      true,
    )
  })

  const casos = [
    { path: '/planes-empresas', tipo: 'empresas', api: '**/api/cotizacion' },
    { path: '/cobertura', tipo: 'cobertura', api: '**/api/cobertura' },
    { path: '/contacto', tipo: 'contacto', api: '**/api/contacto' },
  ]
  for (const c of casos) {
    test(`error del servidor en ${c.tipo} se muestra al usuario`, async ({ page }) => {
      await page.route(c.api, (r) =>
        r.fulfill({ status: 502, json: { ok: false, mensaje: 'No pudimos enviar tu solicitud.' } }),
      )
      await page.goto(c.path)
      await cerrarCookies(page)
      const form = page.getByTestId(`form-${c.tipo}`)
      // Rellena todos los campos visibles con valores válidos
      for (const input of await form
        .locator('input:not([type=checkbox]):not([tabindex="-1"]), textarea')
        .all()) {
        const name = await input.getAttribute('name')
        const valores: Record<string, string> = {
          celular: '3012133151',
          email: 'cliente@ejemplo.com',
          nit: '900123456',
        }
        await input.fill(valores[name ?? ''] ?? 'Texto de prueba válido')
      }
      for (const select of await form.locator('select').all()) {
        await select.selectOption({ index: 1 })
      }
      await aceptar(page, form)
      await form.getByRole('button').last().click()
      await expect(form.getByTestId(`form-${c.tipo}-error`)).toContainText('No pudimos enviar')
    })
  }

  test('la API rechaza datos inválidos y aplica honeypot', async ({ request }) => {
    const malo = await request.post('/api/contacto', { data: { nombre: 'A' } })
    expect(malo.status()).toBe(400)
    const json = await malo.json()
    expect(json.errores).toHaveProperty('celular')
    const bot = await request.post('/api/contacto', { data: { sitioWeb: 'http://spam' } })
    expect(bot.status()).toBe(200)
  })

  test('la API de fallas genera ticket con formato WP-AAAAMMDD-XXXX', async ({ request }) => {
    const res = await request.post('/api/falla', {
      headers: { 'x-real-ip': `10.0.0.${Math.floor(Math.random() * 250)}` },
      data: {
        titular: 'Ana Pérez',
        contrato: '123456',
        celular: '3012133151',
        tipo: 'Internet lento',
        descripcion: 'La velocidad está muy baja desde ayer.',
        aceptaPolitica: true,
      },
    })
    expect(res.status()).toBe(200)
    const json = await res.json()
    expect(json.ticket).toMatch(/^WP-\d{8}-[A-Z2-9]{4}$/)
  })

  test('PQR contra la API real muestra el número de radicado', async ({ page }) => {
    await page.goto('/usuario#radicar-pqr')
    await cerrarCookies(page)
    const form = page.getByTestId('form-pqr')
    await form.getByLabel(/Tipo de PQR/).selectOption('Queja o reclamo')
    await form.getByLabel(/Nombre del titular/).fill('Ana Pérez')
    await form.getByLabel(/N.º de documento/).fill('1234567890')
    await form.getByLabel(/Celular de contacto/).fill('3012133151')
    await form.getByLabel(/Municipio/).selectOption('Sabanalarga')
    await form.getByLabel(/Hechos/).fill('Me cobraron dos veces la factura de este mes.')
    await aceptar(page, form)
    await form.getByRole('button', { name: 'Radicar PQR' }).click()
    await expect(page.getByTestId('form-pqr-exito')).toBeVisible()
    await expect(page.getByTestId('ticket')).toHaveText(/^PQR-\d{8}-[A-Z2-9]{4}$/)
  })

  test('la barra superior enlaza al formulario de PQR', async ({ page }) => {
    await page.goto('/')
    await cerrarCookies(page)
    // El primero es el de la barra superior (en móvil dice solo «PQR»); el pie tiene otro.
    await page.locator('a[href="/usuario#radicar-pqr"]').first().click()
    await expect(page).toHaveURL(/\/usuario#radicar-pqr$/)
    await expect(page.getByTestId('form-pqr')).toBeVisible()
  })
})
