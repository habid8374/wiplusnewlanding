import { expect, test } from '@playwright/test'
import { cerrarCookies, WHATSAPP, WHATSAPP_EMPRESAS } from './helpers'

const wa = (msg: string, numero = WHATSAPP) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`

test.describe('CTA de WhatsApp', () => {
  for (const mb of [100, 150, 200, 250, 300]) {
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

  test('el plan destacado dice “Recomendado” y muestra su precio', async ({ page }) => {
    await page.goto('/planes-hogar')
    await expect(page.locator('#plan-200')).toContainText('Recomendado')
    await expect(page.locator('#plan-200')).toContainText(/90\.000/)
  })

  const flotante: [string, string, string?][] = [
    ['/', 'Hola WIPLUS, quiero información sobre sus planes de internet.'],
    // Ventas empresariales van a su propio WhatsApp.
    [
      '/planes-empresas',
      'Hola, quiero una cotización de internet para mi empresa.',
      WHATSAPP_EMPRESAS,
    ],
    ['/soporte', 'Hola, tengo una falla con mi servicio. Mi número de contrato es: '],
    ['/cobertura', 'Hola, quiero saber si tienen cobertura en mi barrio.'],
  ]
  for (const [path, msg, numero] of flotante) {
    test(`botón flotante en ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByTestId('whatsapp-flotante')).toHaveAttribute('href', wa(msg, numero))
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
    await page.locator('#planes a[data-plan="150"]').click()
    await (await popup).close()
    const eventos = await page.evaluate(() => window.__wiplusEvents ?? [])
    expect(eventos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'click_whatsapp',
          params: expect.objectContaining({ plan: '150 Mb', ubicacion: 'planes_hogar' }),
        }),
      ]),
    )
  })
})
