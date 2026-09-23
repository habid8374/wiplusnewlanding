# WIPLUS Comunicaciones — sitio web

Sitio de ventas de **WIPLUS Comunicaciones** (internet por fibra óptica en Sabanalarga y Luruaco,
Atlántico) — https://www.wiplus.com.co. Desarrollado por Axentia Technologies.

- Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4
- CMS: Sanity (Studio en `/studio`) con respaldo local en `content/`
- Formularios: Zod · Resend · Cloudflare Turnstile · honeypot · rate limit
- Despliegue: Cloudflare Workers con `@opennextjs/cloudflare` (compatible con Vercel)
- Calidad: ESLint · Prettier · Playwright + axe · Lighthouse CI

Documentos: [`CLAUDE.md`](CLAUDE.md) (convenciones) · [`ARQUITECTURA.md`](ARQUITECTURA.md) ·
[`PENDIENTES.md`](PENDIENTES.md) (datos que debe enviar WIPLUS).

---

## Desarrollo local

Requisitos: Node.js ≥ 20.9 (recomendado 22).

```bash
npm install
cp .env.example .env.local   # opcional: sin variables el sitio usa content/ y correo simulado
npm run dev                  # http://localhost:3000
```

| Comando                                                 | Qué hace                                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `npm run dev`                                           | Servidor de desarrollo                                                     |
| `npm run build`                                         | Compila el Studio (`public/studio`) y el sitio                             |
| `npm run lint` / `npm run typecheck` / `npm run format` | Calidad de código                                                          |
| `npm run test:e2e`                                      | Playwright (requiere `npm run build` antes)                                |
| `npm run lhci`                                          | Lighthouse CI (requiere build; ver `lighthouserc.json`)                    |
| `npm run studio:dev`                                    | Sanity Studio en modo desarrollo en :3333                                  |
| `npm run cf:preview`                                    | Build de OpenNext + vista previa en `workerd` (runtime real de Cloudflare) |
| `npm run cf:deploy`                                     | Build + despliegue a Cloudflare                                            |

> Si usas un Chromium preinstalado: `PW_CHROMIUM_PATH=/ruta/chromium npm run test:e2e` y
> `CHROME_PATH=/ruta/chromium npm run lhci`.

### Contenido de ejemplo

Todo dato no suministrado por WIPLUS (testimonios, barrios, nombres de clientes, medios de pago) está
marcado `ejemplo: true`. Se ve con la etiqueta **[EJEMPLO]** mientras `NEXT_PUBLIC_SITE_ENV` no sea
`production`; en producción se oculta automáticamente. Buscar pendientes: `grep -rn "TODO(WIPLUS)"`.

---

## Despliegue en Cloudflare Workers

### 1. Requisitos

- Cuenta de Cloudflare con la zona **wiplus.com.co** agregada (ver paso 5 para el DNS).
- `npx wrangler login`

### 2. Crear recursos (una sola vez)

```bash
# Caché incremental (páginas ISR)
npx wrangler r2 bucket create wiplus-web-opennext-cache

# Caché de etiquetas (revalidación on-demand desde Sanity)
npx wrangler d1 create wiplus-web-tag-cache
# → copia el "database_id" que imprime el comando en wrangler.jsonc (d1_databases[0].database_id)
```

Opcional: habilitar **Cloudflare Images** (optimización de `next/image`) en el panel; el binding `IMAGES`
ya está en `wrangler.jsonc`.

### 3. Variables y secretos

Las variables públicas están en `wrangler.jsonc › vars` (`NEXT_PUBLIC_SITE_ENV=production`, etc.).
Las variables `NEXT_PUBLIC_*` se incrustan **en el build**, así que deben existir también al compilar
(en `.env.production.local` o en el entorno de CI):

```bash
# .env.production.local (no se versiona)
NEXT_PUBLIC_SITE_URL=https://www.wiplus.com.co
NEXT_PUBLIC_SITE_ENV=production
NEXT_PUBLIC_WHATSAPP_NUMBER=573012133151
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Secretos del Worker:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put SANITY_REVALIDATE_SECRET
npx wrangler secret put SANITY_API_READ_TOKEN   # solo si el dataset es privado
npx wrangler secret put MAIL_FROM               # "WIPLUS Comunicaciones <no-responder@wiplus.com.co>"
```

### 4. Desplegar

```bash
npm run cf:deploy
```

`opennextjs-cloudflare deploy` sube el Worker, los assets estáticos y puebla la caché (R2/D1).
Tamaño actual del Worker: ~2,9 MiB gzip (cabe en el plan gratuito, límite 3 MiB; el plan de pago admite 10 MiB).

### 5. DNS de wiplus.com.co (sin tocar el correo)

1. En Cloudflare › _Add a site_ › `wiplus.com.co` (plan Free). Cloudflare importa los registros actuales.
2. **Antes de cambiar los nameservers**, compara los registros importados con los del proveedor actual y
   verifica que estén **idénticos** los registros de correo:
   - todos los **MX**,
   - **TXT** de SPF (`v=spf1 …`), **DKIM** (`*._domainkey`) y **DMARC** (`_dmarc`),
   - cualquier `CNAME` de autodiscover/webmail.
     Estos registros deben quedar en modo **DNS only (nube gris)**. No se modifican.
3. Cambia los nameservers en el registrador del dominio por los que indique Cloudflare.
4. Cuando la zona esté activa, elimina en Cloudflare **solo** los registros `A`/`CNAME` de `@` y `www` que
   apuntan al hosting de WordPress. El despliegue crea los dominios propios automáticamente gracias a
   `routes` con `custom_domain: true` en `wrangler.jsonc` (`www.wiplus.com.co` y `wiplus.com.co`).
5. Redirección del dominio sin `www` → `www`: en Cloudflare › Rules › Redirect Rules, crear
   `wiplus.com.co/*` → `https://www.wiplus.com.co/${1}` (301, conservar query string).
6. SSL/TLS en modo **Full (strict)** y _Always Use HTTPS_ activado.
7. Verificar el correo después del cambio: enviar y recibir un mensaje en `atencionalcliente@wiplus.com.co`.

### 6. Resend (correo de formularios)

1. Crear cuenta en resend.com › _Domains_ › `wiplus.com.co`.
2. Agregar en Cloudflare los registros que indica Resend (normalmente `TXT`/`MX` en el subdominio
   `send.wiplus.com.co` y DKIM `resend._domainkey`). **No reemplazan los MX del dominio raíz.**
3. Crear una API key con permiso de envío → `wrangler secret put RESEND_API_KEY`.

Sin `RESEND_API_KEY` en producción los formularios responden pidiendo usar WhatsApp (no se pierden en silencio).

### 7. Turnstile

Cloudflare › Turnstile › _Add site_ (`www.wiplus.com.co`, modo _Managed_). Site key →
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build); secret → `wrangler secret put TURNSTILE_SECRET_KEY`.

### 8. Sanity (CMS)

1. Crear el proyecto: `npx sanity@latest init --env` (o en sanity.io/manage) y anotar `projectId`.
2. En sanity.io/manage › API › **CORS origins** agregar `https://www.wiplus.com.co` (con credenciales) y
   `http://localhost:3000`.
3. Recompilar y desplegar con `NEXT_PUBLIC_SANITY_PROJECT_ID` definido: el Studio queda en
   `https://www.wiplus.com.co/studio`.
4. Invitar a los usuarios de WIPLUS (sanity.io/manage › Members, rol _Editor_).
5. Cargar el contenido inicial desde `content/` (planes, FAQ, etc.) en el Studio. Mientras un tipo de
   contenido esté vacío en Sanity, el sitio sigue usando el de `content/`.
6. **Webhook de revalidación** (sanity.io/manage › API › Webhooks › _Create_):
   - URL: `https://www.wiplus.com.co/api/revalidate`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: _(vacío)_ · Projection: `{_type}`
   - HTTP method: `POST` · API version: `v2025-10-01`
   - Secret: el mismo valor de `SANITY_REVALIDATE_SECRET`

   Al publicar un cambio en el Studio, la página se actualiza en segundos sin redesplegar.

### 9. Google Search Console y Analytics

1. search.google.com/search-console › _Agregar propiedad_ › **Dominio** `wiplus.com.co`.
2. Verificar con el registro **TXT** que indica Google (en Cloudflare DNS, nube gris).
3. _Sitemaps_ › enviar `https://www.wiplus.com.co/sitemap.xml`.
4. Revisar _Indexación de páginas_ y _Experiencia › Métricas web principales_ a las 2–4 semanas.
5. Las URLs antiguas de WordPress (`/planes/`, `/comunicate/`, `/nuestros-usuarios/`, `/wp-admin`, `?p=`)
   redirigen con **301**; se puede usar _Inspección de URLs_ para acelerar el reprocesamiento.
6. GA4: crear propiedad y flujo web → `NEXT_PUBLIC_GA_ID`. Eventos personalizados:
   `click_whatsapp` (ubicacion, plan), `click_llamada`, `form_submit` (tipo), `ver_plan`.
   Marcar `click_whatsapp` y `form_submit` como **eventos clave** (conversiones).

### 10. Seguridad recomendada

- Cloudflare › Security › WAF › _Rate limiting rules_: `/api/*` método POST, 10 solicitudes/minuto por IP
  (complementa el límite en memoria de `lib/rate-limit.ts`, que es por instancia).
- Bot Fight Mode activado.

---

## Despliegue alternativo en Vercel

El proyecto funciona en Vercel sin cambios de código: importar el repositorio, definir las variables de
`.env.example` y desplegar. `wrangler.jsonc`/`open-next.config.ts` se ignoran. El Studio se compila en el
build (`npm run build`) igual que en Cloudflare.

---

## Estructura

```
app/(site)/        páginas públicas          content/       contenido de respaldo
app/(portal)/      reservado Fase 2          lib/           utilidades (content, whatsapp, seo, forms…)
app/api/           formularios y webhook     sanity/        esquemas y configuración del Studio
app/studio/        sirve la SPA del Studio   tests/e2e/     Playwright
components/        UI                         scripts/       build del Studio
```
