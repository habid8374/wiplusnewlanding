# Arquitectura — sitio web WIPLUS Comunicaciones

## Visión general

```
Visitante ──► Cloudflare (DNS + CDN) ──► Worker "wiplus-web" (OpenNext)
                                          │  ├─ Páginas estáticas/ISR (R2 + D1 tag cache)
                                          │  ├─ /api/* (formularios, webhook)
                                          │  └─ Assets estáticos (public/, _next/static, /studio SPA)
                                          │
              Sanity (Content Lake) ◄─────┤  contenido (GROQ por HTTP, caché con etiquetas)
              Sanity webhook ─────────────┘► /api/revalidate  → revalidateTag(tipo)
              Resend (API REST)  ◄──────────  correos de formularios
              Cloudflare Turnstile ◄────────  verificación antispam
              Google Analytics 4 ◄──────────  eventos (solo con consentimiento)
```

## Decisiones

| Tema                 | Decisión                                                                                        | Motivo                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Framework            | Next.js 16 App Router, páginas estáticas (SSG) + revalidación on-demand                         | Rendimiento máximo en móvil, SEO                                                                 |
| Contenido            | `lib/content.ts` → Sanity si hay `projectId`; si no, `content/*.ts`                             | El sitio funciona y se despliega sin CMS                                                         |
| CMS                  | Sanity Studio compilado como SPA estática en `public/studio`                                    | El Studio (varios MB) no entra en el Worker → cabe en el plan gratuito de Workers (límite 3 MiB) |
| Sanity en servidor   | `fetch` a la API HTTP (sin SDK)                                                                 | −84 KB en el Worker; usa la caché de Next con etiquetas                                          |
| Correo               | API REST de Resend con `fetch`                                                                  | Sin SDK, menor tamaño del Worker                                                                 |
| Validación           | `zod/mini`, esquemas compartidos cliente/servidor; en el cliente se carga bajo demanda          | JS inicial mínimo                                                                                |
| Antispam             | Turnstile (se carga al primer foco en el formulario) + honeypot + rate limit por IP             | Sin penalizar Lighthouse                                                                         |
| Imágenes             | `next/image` (Cloudflare Images binding en Workers)                                             | Formatos modernos y tamaños responsivos                                                          |
| Analítica            | GA4 con `@next/third-parties`, solo tras aceptar cookies                                        | Ley 1581 / buenas prácticas                                                                      |
| Contenido de ejemplo | `ejemplo: true` → `[EJEMPLO]` fuera de producción, oculto con `NEXT_PUBLIC_SITE_ENV=production` | Nunca publicar datos inventados                                                                  |

Tamaño del Worker (gzip): **~2,9 MiB** (medido con `wrangler deploy --dry-run`).

## Fase 2 — Portal de clientes (reservado, no implementado)

Carpeta reservada: `app/(portal)/` · Tipos base: `lib/portal/types.ts`.

Alcance previsto:

1. **Autenticación de clientes**: documento + OTP por WhatsApp/SMS o correo (p. ej. Auth.js con proveedor
   propio, o Clerk). Sesiones en cookies `httpOnly`. Rutas bajo `app/(portal)/mi-cuenta/*` protegidas
   en `proxy.ts` (ampliar el `matcher`) y verificadas de nuevo en cada Server Function.
2. **Facturas**: consulta desde el sistema de gestión del ISP (API o exportación periódica).
   Integración en `lib/portal/billing.ts` con un adaptador por sistema.
3. **Pagos**: Wompi (Bancolombia) o ePayco con PSE, Nequi y tarjeta.
   - Crear transacción con referencia única (`Pago.referencia`), redirigir al checkout de la pasarela.
   - Webhook firmado `app/api/pagos/webhook/route.ts` → actualizar `Pago.estado` (idempotente por referencia).
   - **Conciliación**: tarea programada (Cron Trigger de Cloudflare) que compara pagos aprobados vs
     facturas en el sistema de gestión y marca diferencias.
4. **Persistencia**: Cloudflare D1 (SQLite) para pagos, tickets y sesiones; o la base del sistema de gestión.
5. **Tickets con seguimiento**: el formulario actual ya genera `WP-AAAAMMDD-XXXX`; en Fase 2 se guardan en D1
   con historial de estados y se consultan en `app/(portal)/tickets`.
6. **Notificaciones**: WhatsApp Business API (Meta) / SMS / correo (Resend) con plantillas por evento
   (`Notificacion` en los tipos).

Requisitos legales Fase 2: CUN para PQR (CRC), autorización de datos (Ley 1581), PCI-DSS delegado en la pasarela
(no se almacenan datos de tarjeta).
