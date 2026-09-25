# PENDIENTES — información que debe suministrar WIPLUS

Cada punto tiene un `TODO(WIPLUS)` en el código (búscalo con `grep -rn "TODO(WIPLUS)"`).
Todo lo marcado como contenido de ejemplo se ve con la etiqueta **[EJEMPLO]** en desarrollo y se
puede reemplazar desde el CMS (`/studio`) sin programador.

## Comercial

- [ ] **Precios de los planes hogar** (30, 40, 50, 80 y 100 Mb). Los precios actuales solo están en
      imágenes del sitio viejo (`/wp-content/uploads/2024/06/30.png`, etc.) y no se pudieron descargar
      desde el entorno de desarrollo (acceso bloqueado). Mientras tanto se muestra “Consulta el precio”.
      → `content/planes.ts` o CMS › Planes.
- [ ] Qué incluye cada plan (instalación, router/ONT, soporte, permanencia, etc.).
- [ ] Confirmar el plan destacado como “Más elegido” (hoy: 100 Mb).
- [ ] Promociones vigentes y condiciones (si las hay).
- [ ] Oferta empresarial: confirmar textos (canal dedicado, IP fija, soporte prioritario, SLA) y
      velocidades disponibles.

## Contacto

- [ ] **Número de WhatsApp**: ¿301 213 3151 o 300 788 8808? (por defecto: 301 213 3151,
      configurable en `NEXT_PUBLIC_WHATSAPP_NUMBER` o CMS › Datos de contacto).
- [ ] Días de atención (hoy solo se conoce el horario 8:00 a. m. – 6:00 p. m.; se asume lunes a sábado).
- [ ] Horario de soporte técnico si es distinto.
- [ ] Otras redes sociales (Instagram, TikTok…).

## Cobertura

- [ ] **Recibir del cliente la lista real de barrios por municipio con su estado** (cubierto, parcial,
      próximamente, sin cobertura) → reemplazar `data/barrios-cobertura.csv` y ejecutar
      `npm run cobertura:importar -- --reemplazar-demo`, o pegarla en _Studio › Importar barrios_
      marcando «Borrar antes los barrios de muestra». Hoy son de muestra (no se publican).
- [ ] Poner `SANITY_WRITE_TOKEN` (tipo Secret) en Vercel para guardar las solicitudes de cobertura en
      el panel (sin él solo llegan por correo).

## Prueba social

- [ ] **Nombres de las empresas cliente** de cada logo (image10 a image18 del sitio actual) y
      autorización para publicarlos.
- [ ] **Logos de clientes**: no se pudieron descargar del sitio actual desde el entorno de
      desarrollo; subirlos al CMS o a `public/clientes/`.
- [ ] Testimonios reales (nombre, barrio/empresa, texto y autorización). Hoy son de ejemplo.
- [ ] Cifras (número de usuarios, km de fibra, etc.) si se quieren publicar.

## Pagos

- [ ] **Medios de pago** aceptados (oficina, corresponsales, Nequi, Daviplata, transferencia…).
- [ ] Fechas de corte, fechas límite de pago y política de suspensión/reconexión.

## Empresa

- [ ] Razón social, NIT y registro TIC (MinTIC) para el pie de página y textos legales.
- [ ] Historia de la empresa (año de fundación, fundadores).
- [ ] Foto original en alta resolución del equipo técnico (la de /nosotros se recortó del flyer
      «Conoce nuestro equipo técnico 2023» de Facebook) y autorización de las personas que aparecen.
- [ ] Confirmar si «La Voz del Pueblo» (aparece en el flyer junto a la dirección) es el barrio de la
      oficina, para agregarlo a la dirección del sitio y de Google Maps.
- [ ] **Logo en alta resolución / vectorial (SVG o AI)**. El sitio usa el PNG suministrado por chat.
- [ ] Fotos de trabajos (las del sitio actual no se pudieron descargar desde el entorno de desarrollo).

## Legal

- [ ] Revisión legal de la **Política de tratamiento de datos** (Ley 1581 de 2012).
- [ ] Revisión legal de **Términos y condiciones**.
- [ ] Revisión de la página **Protección al usuario** (régimen CRC, Res. 5111 de 2017 y compilatoria
      5050 de 2016) y **contrato de servicio** en PDF para descarga.

## Técnico / cuentas

- [ ] Proyecto de Sanity (projectId, dataset) y token.
- [ ] **Correo de los formularios (Brevo)**: crear la cuenta en brevo.com, autenticar el dominio
      wiplus.com.co (DKIM/DMARC, sin tocar MX) o al menos verificar el remitente, crear la API key y
      poner en Vercel `BREVO_API_KEY`, `MAIL_FROM` (remitente verificado) y `MAIL_TO` (buzón de WIPLUS
      que recibe los formularios). Luego redeploy y prueba de envío. Mientras falte, los formularios
      piden escribir por WhatsApp.
- [ ] Servidor propio de test de velocidad (OpenSpeedTest, código abierto) dentro de la red de WIPLUS,
      p. ej. `test.wiplus.com.co`, para que el cliente mida su plan sin pasar por Bogotá. Hoy se usa el
      servidor público de openspeedtest.com (`components/sections/SpeedTest.tsx`).
- [ ] Claves de Cloudflare Turnstile.
- [ ] ID de Google Analytics 4.
- [ ] Acceso a Cloudflare (zona wiplus.com.co) y Google Search Console.
- [ ] Crear en Cloudflare el bucket R2 y la base D1 y poner el `database_id` real en `wrangler.jsonc`
      (ver README › Despliegue).

## Entrega final (Axentia)

- [ ] **Manual de uso del sistema** al cerrar el proyecto (PDF, lenguaje sencillo, con capturas),
      sobre todo del panel de Sanity (`/studio`), un capítulo por módulo:
      entrar al panel y publicar (borrador vs. publicado) · Datos de contacto y empresa · Planes hogar ·
      Avisos y promociones · Oferta flotante · Oferta empresarial · Cobertura (municipios, barrios,
      Importar barrios desde Excel, solicitudes y su gestión, configuración) · Preguntas frecuentes ·
      Testimonios · Clientes empresariales · Pagos. Además: formularios y a dónde llegan (tickets,
      radicados de PQR), tarjetas para compartir, qué hacer si algo falla y a quién llamar.
