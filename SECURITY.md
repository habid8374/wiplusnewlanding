# Seguridad — OWASP Top 10:2025

Cómo el sitio de WIPLUS cubre cada riesgo del [OWASP Top 10:2025](https://owasp.org/Top10/2025/).
El sitio es mayormente estático: no tiene cuentas de usuario, base de datos propia ni pagos. La
superficie de ataque real son los **formularios** (`app/api/*`), el **webhook** de Sanity
(`/api/revalidate`), el **panel** (`/studio`) y el **contenido que llega del CMS**.

Reportes de vulnerabilidades: `/.well-known/security.txt`.

| #   | Riesgo                                        | Controles en el proyecto                                                                                                                                                                                                                                                                                                                                                     |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Control de acceso roto                        | Sin rutas privadas propias. `/studio` exige sesión de Sanity; los orígenes CORS de Sanity son solo los del sitio. `/api/revalidate` exige firma HMAC (`SANITY_REVALIDATE_SECRET`). Los formularios aceptan solo JSON del mismo origen (`origenValido` en `lib/forms/handler.ts`). El token de escritura de Sanity vive solo en GitHub Actions.                               |
| A02 | Configuración de seguridad incorrecta         | Cabeceras en `lib/security-headers.ts`: CSP con lista cerrada de orígenes, HSTS, `nosniff`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`, COOP; sin `X-Powered-By`. Turnstile falla de forma segura si en producción falta el secreto. `robots.txt` bloquea `/studio` y `/api/`.                                                             |
| A03 | Fallas en la cadena de suministro de software | `package-lock.json` + `npm ci`. `npm audit --omit=dev --audit-level=high` en CI. Dependabot semanal (`.github/dependabot.yml`). `overrides` en `package.json` para parchear dependencias transitivas de Sanity (adm-zip, js-yaml, smol-toml). El Studio (herramientas de Sanity) solo corre en el build, no en el servidor.                                                  |
| A04 | Fallas criptográficas                         | Solo HTTPS (HSTS + `upgrade-insecure-requests`). Secretos solo en variables de entorno (`.env*` ignorados por git). Tickets y radicados con `crypto.getRandomValues`. No se guardan datos personales: los formularios se envían por correo.                                                                                                                                  |
| A05 | Inyección                                     | Validación con Zod en cliente y servidor (`lib/schemas/forms.ts`), con longitudes máximas. HTML de los correos escapado (`escapeHtml`). JSON-LD escapa `<`. Enlaces del CMS filtrados con `enlaceSeguro` (`lib/safe-url.ts`): solo rutas internas o http(s), nunca `javascript:`. Consultas GROQ con parámetros, sin concatenar texto del usuario. CSP como segunda barrera. |
| A06 | Diseño inseguro                               | Anti-spam en capas: Turnstile + campo trampa (honeypot) + límite de 8 envíos cada 10 min por IP, tomando solo la cabecera de IP que la plataforma sobrescribe (`clientIp`). Cuerpo máximo de 16 KB. Contenido de ejemplo oculto en producción.                                                                                                                               |
| A07 | Fallas de autenticación                       | El sitio no maneja contraseñas. El acceso al panel lo gestiona Sanity (cuentas con 2FA recomendado para los editores).                                                                                                                                                                                                                                                       |
| A08 | Fallas de integridad de software o datos      | Despliegue solo desde `main` con CI (lint, tipos, formato, build, 219 pruebas e2e). Webhook firmado. Scripts de terceros limitados por CSP a orígenes conocidos.                                                                                                                                                                                                             |
| A09 | Fallas de registro y alertas                  | Eventos de seguridad registrados sin datos personales: `origen_rechazado`, `limite_de_envios`, `turnstile_fallido`, `honeypot` (JSON en los logs de Vercel/Cloudflare). Errores de correo, Sanity y Turnstile también se registran.                                                                                                                                          |
| A10 | Mal manejo de condiciones excepcionales       | Respuestas de error genéricas en las APIs (sin trazas). Si Sanity falla, se usa el contenido local. Sin proveedor de correo en producción, el formulario pide usar WhatsApp en vez de perder el mensaje. Página de error amable (`app/(site)/error.tsx`) y 404 útil.                                                                                                         |

## Al agregar funcionalidad

- **Nuevo servicio externo** (script, iframe, imagen o API desde el navegador): agrégalo a la CSP en
  `lib/security-headers.ts`, o el navegador lo bloqueará (las pruebas e2e fallan con errores de CSP).
- **Enlace que viene del CMS**: pásalo siempre por `enlaceSeguro()`.
- **Nuevo formulario**: usa `handleForm` (origen, límite, honeypot, Turnstile y validación ya incluidos).
- **Nuevo secreto**: solo en variables de entorno de Vercel/Cloudflare (tipo _Secret_), nunca con
  prefijo `NEXT_PUBLIC_`.

## Riesgos aceptados y recomendaciones de operación

- El límite de envíos vive en memoria por instancia: en producción conviene además una regla de
  _Rate limiting_ del WAF de Cloudflare (o Vercel Firewall) sobre `/api/*`.
- `npm audit` reporta vulnerabilidades moderadas en herramientas de compilación de Sanity (uuid) y
  altas en herramientas de desarrollo (Lighthouse CI). No llegan al servidor ni al navegador; se
  actualizan cuando Sanity publique la corrección (Dependabot avisa).
- La CSP permite `'unsafe-inline'` en scripts porque las páginas son estáticas (un nonce obligaría a
  renderizar cada visita en el servidor). La mitigan la lista cerrada de orígenes, `object-src 'none'`
  y `base-uri 'self'`.
- Editores del panel: activar 2FA en sus cuentas de Sanity y quitar `http://localhost:3000` de los
  orígenes CORS cuando ya no se desarrolle en local.
