@AGENTS.md

# WIPLUS Comunicaciones — sitio web (convenciones del proyecto)

Sitio de ventas de WIPLUS Comunicaciones (internet por fibra óptica en Sabanalarga y Luruaco,
Atlántico). Cliente de Axentia Technologies. Dominio: https://www.wiplus.com.co

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict.
- Tailwind CSS v4 (tokens de marca en `app/globals.css` con `@theme`). Iconos: `lucide-react`.
- CMS: Sanity. Esquemas en `sanity/schemas/`. El Studio se compila como SPA estática en `public/studio`
  (`scripts/build-studio.mjs`, parte de `npm run build`) y lo sirve `app/studio/[[...tool]]/route.ts`.
  No importar `sanity`/`next-sanity` en código de páginas: el Worker debe quedar < 3 MiB gzip.
- Contenido: **siempre** a través de `lib/content.ts`. Lee de Sanity si hay `NEXT_PUBLIC_SANITY_PROJECT_ID`;
  si no (o si falla), usa el respaldo local en `content/`.
- Formularios: route handlers en `app/api/*` → `lib/forms/handler.ts`. Validación con `zod/mini`
  (`lib/schemas/forms.ts`, compartido; en el cliente se importa bajo demanda). Correo con la API REST de
  Resend (`fetch`), Turnstile + honeypot, rate limit por IP (`lib/rate-limit.ts`).
- Despliegue: Cloudflare Workers con `@opennextjs/cloudflare` (`wrangler.jsonc`, `open-next.config.ts`).
  Compatible con Vercel sin cambios.

## Estructura

```
app/(site)/        páginas públicas (layout con header, footer, WhatsApp flotante, cookies)
app/(portal)/      RESERVADO Fase 2 (portal de clientes). No crear rutas aún.
app/studio/        sirve la SPA de Sanity Studio (public/studio)
app/api/           formularios y /api/revalidate
components/        UI (ui/ = primitivas, layout/, sections/, forms/)
content/           respaldo local del contenido (fuente de verdad sin CMS)
lib/               utilidades (content, whatsapp, seo, analytics, email, …)
sanity/            configuración y esquemas de Sanity
tests/e2e/         Playwright
```

## Reglas

1. **Nunca inventar datos del negocio** (precios, barrios, nombres de clientes, testimonios, cifras,
   NIT). Lo que falte se marca `ejemplo: true` en el contenido (se ve la etiqueta `[EJEMPLO]` fuera de
   producción), con un comentario `TODO(WIPLUS): …` y una entrada en `PENDIENTES.md`.
2. Precio desconocido ⇒ `precio: null` ⇒ la UI muestra “Consulta el precio” + botón de WhatsApp.
3. Todos los enlaces de WhatsApp se construyen con `lib/whatsapp.ts`; los teléfonos con `telHref()`.
4. Textos en español de Colombia, con tildes. `lang="es-CO"`. Revisar ortografía.
5. Accesibilidad: foco visible, `aria-*` correctos, `alt` descriptivo en español, contraste AA,
   respetar `prefers-reduced-motion`.
6. Rendimiento: componentes de servidor por defecto; `"use client"` solo donde hay interacción.
   Sin librerías de carrusel. Imágenes con `next/image`.
7. Eventos GA4 con `track()` de `lib/analytics.ts` (solo se envían con consentimiento de cookies).
8. Mantener liviano el Worker: medir con `npx opennextjs-cloudflare build && npx wrangler deploy --dry-run`.
9. Next 16: `proxy.ts` (no `middleware.ts`), `params`/`searchParams` son Promises,
   `revalidateTag(tag, 'max')` requiere perfil. Consultar `node_modules/next/dist/docs/`.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción
npm run lint         # ESLint (0 warnings)
npm run typecheck    # tsc
npm run format       # Prettier
npm run test:e2e     # Playwright (levanta build + start)
npm run lhci         # Lighthouse CI
npm run cf:preview   # build OpenNext + vista previa local en workerd
npm run cf:deploy    # despliegue a Cloudflare
```
