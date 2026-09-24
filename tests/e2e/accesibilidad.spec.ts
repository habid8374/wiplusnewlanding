import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { cerrarCookies, PAGINAS } from './helpers'

test.describe('Accesibilidad (axe, WCAG 2.1 AA)', () => {
  test.beforeEach(({ browserName }, info) => {
    void browserName
    test.skip(!['movil-390', 'escritorio-1280'].includes(info.project.name), 'Dos anchos bastan')
  })
  for (const p of PAGINAS) {
    test(`sin violaciones en ${p.path}`, async ({ page }) => {
      await page.goto(p.path)
      await cerrarCookies(page)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      const resumen = results.violations.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(' '))
            .slice(0, 3)
            .join(' | ')}`,
      )
      expect(resumen).toEqual([])
    })
  }
})
