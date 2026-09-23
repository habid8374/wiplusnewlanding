import { expect, test } from '@playwright/test'
import { cerrarCookies, WHATSAPP } from './helpers'

const wa = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

test.describe('CTA de WhatsApp', () => {
  for (const mb of [30, 40, 50, 80, 100]) {
    test(`“Lo quiero” del plan ${mb} Mb abre WhatsApp con el mensaje correcto`, async ({
      page,
    }) => {
      await page.goto('/planes-hogar')
      const link = page.locator(`#planes a[data-plan="${mb}"]`)
      await expect(link).toHaveAttribute(
        'href',
        wa(`Hola WIPLUS, me interesa el plan de ${mb} Mb. ¿Me pueden dar información?`),
      )
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    })
  }

  test('el plan destacado dice “Más elegido”', async ({ page }) => {
    await page.goto('/planes-hogar')
    await expect(page.locator('#plan-100')).toContainText('Más elegido')
  })

  const flotante: [string, string][] = [
    ['/', 'Hola WIPLUS, quiero información sobre sus planes de internet.'],
    ['/planes-empresas', 'Hola, quiero una cotización de internet para mi empresa.'],
    ['/soporte', 'Hola, tengo una falla con mi servicio. Mi número de contrato es: '],
    ['/cobertura', 'Hola, quiero saber si tienen cobertura en mi barrio.'],
  ]
  for (const [path, msg] of flotante) {
    test(`botón flotante en ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByTestId('whatsapp-flotante')).toHaveAttribute('href', wa(msg))
    })
  }

  test('clic en WhatsApp registra el evento click_whatsapp con el plan', async ({
    page,
    context,
  }) => {
    await context.route('https://wa.me/**', (r) => r.fulfill({ status: 200, body: 'ok' }))
    await page.goto('/planes-hogar')
    await cerrarCookies(page)
    const popup = page.waitForEvent('popup')
    await page.locator('#planes a[data-plan="50"]').click()
    await (await popup).close()
    const eventos = await page.evaluate(() => window.__wiplusEvents ?? [])
    expect(eventos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'click_whatsapp',
          params: expect.objectContaining({ plan: '50 Mb', ubicacion: 'planes_hogar' }),
        }),
      ]),
    )
  })

  test('verificador de cobertura prellena el mensaje con barrio y municipio', async ({ page }) => {
    await page.goto('/cobertura')
    await cerrarCookies(page)
    const form = page.locator('#verificador')
    await form.getByLabel('Municipio').selectOption({ label: 'Luruaco' })
    await form.getByLabel('Barrio o vereda').fill('El Centro')
    await form.getByRole('button', { name: 'Verificar' }).click()
    const resultado = form.getByTestId('resultado-cobertura')
    await expect(resultado).toBeVisible()
    await expect(resultado.locator('a[href^="https://wa.me/"]')).toHaveAttribute(
      'href',
      wa('Hola, quiero saber si tienen cobertura en el barrio El Centro, Luruaco.'),
    )
  })
})
