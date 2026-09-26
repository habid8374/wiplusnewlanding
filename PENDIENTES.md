# PENDIENTES — información que debe suministrar WIPLUS

Cada punto tiene un `TODO(WIPLUS)` en el código (búscalo con `grep -rn "TODO(WIPLUS)"`).
Todo lo marcado como contenido de ejemplo se ve con la etiqueta **[EJEMPLO]** en desarrollo y se
puede reemplazar desde el CMS (`/studio`) sin programador.

## Comercial

- [x] Planes y precios (volante oficial): 100 Mb $60.000 · 150 Mb $70.000 · 200 Mb $90.000 ·
      250 Mb $120.000 · 300 Mb $140.000.
- [ ] **Valor de la suscripción (instalación)**: en el volante está en blanco.
- [ ] Qué incluye cada plan (router/ONT, soporte, permanencia, etc.).
- [ ] Confirmar el plan destacado (hoy: 200 Mb, etiqueta «Recomendado»).
- [ ] Promociones vigentes y condiciones (si las hay).
- [ ] Oferta empresarial: confirmar textos (canal dedicado, IP fija, soporte prioritario, SLA) y
      velocidades disponibles.

## Contacto

- [x] WhatsApp general 300 788 8808; llamadas 301 213 3151; ventas empresariales por WhatsApp
      301 213 3151 (CMS › Datos de contacto). Si en Vercel existe `NEXT_PUBLIC_WHATSAPP_NUMBER` con el
      número anterior, cambiarlo a 573007888808 o borrarlo.
- [x] Correo público: wipluscomunicaciones@gmail.com. Confirmar si los formularios también deben
      llegar ahí (variable `MAIL_TO` en Vercel).
- [ ] Días de atención (hoy solo se conoce el horario 8:00 a. m. – 6:00 p. m.; se asume lunes a sábado).
- [ ] Horario de soporte técnico si es distinto.
- [x] Instagram: @wipluscomunicaciones1.
- [ ] TikTok u otras redes (si las hay).

## Cobertura

- [x] SEO local: página por zona (/cobertura/<zona>) con título, descripción, tarjeta para compartir y
      datos estructurados propios; todas en el sitemap.
- [ ] En la ficha de Google Business Profile, agregar las 7 zonas como «Áreas de servicio».

- [x] Barrios de muestra borrados de Sanity y aviso «Datos de muestra» apagado (sitio en producción).
- [ ] **Recibir del cliente la lista real de barrios por municipio con su estado** (cubierto, parcial,
      próximamente, sin cobertura) → reemplazar `data/barrios-cobertura.csv` y ejecutar
      `npm run cobertura:importar -- --reemplazar-demo`, o pegarla en _Studio › Importar barrios_
      marcando «Borrar antes los barrios de muestra». Hoy son de muestra (no se publican).
- [ ] Poner `SANITY_WRITE_TOKEN` (tipo Secret) en Vercel para guardar las solicitudes de cobertura en
      el panel (sin él solo llegan por correo).

- [ ] Coordenadas (centro del mapa) de La Peña, Aguada de Pablo, Hibácharo, Leña y Palmar de
      Candelaria, para mostrar su mapa en /cobertura (`content/municipios.ts` o CMS › Cobertura ›
      Municipios › Ubicación). Confirmar si se nombran como municipios o corregimientos.

## Prueba social

- [x] Clientes corporativos: SuperGIROS, Lewis Energy Group, Berboj Salud IPS,
      Howard Gardner Bilingual School, Inversiones Noreña, Elecnor y Deltec S.A.
- [x] Logos de SuperGIROS, Lewis Energy Group, Berboj Salud IPS, Howard Gardner, Inversiones Noreña,
      Deltec y Elecnor. Los de Berboj e Inversiones Noreña se redibujaron: reemplazarlos si envían el original.
- [ ] Testimonios reales (nombre, barrio/empresa, texto y autorización). Hoy son de ejemplo.
- [ ] Cifras (número de usuarios, km de fibra, etc.) si se quieren publicar.

## Pagos

- [x] Portal de clientes (WispHub) enlazado en «Mi factura» (barra superior, menú, pie) y en /pagos.
- [ ] Confirmar la dirección exacta del portal de clientes de WIPLUS en WispHub (hoy: https://wisphub.net).
      Se cambia en CMS › Datos de contacto › Portal de clientes.

- [x] Cuenta de ahorros Bancolombia 12096593587 (Wiplus Comunicaciones), comprobante por WhatsApp.
- [ ] **Otros medios de pago** aceptados (oficina, corresponsales, Nequi, Daviplata, transferencia…).
- [ ] Fechas de corte, fechas límite de pago y política de suspensión/reconexión.

## Enlaces de interés

- [x] CiberPaz (MinTIC) con su logo en el pie de página.
- [x] Ley 679 de 2001: página /proteccion-infantil (deberes, prohibiciones, prevención) y canales de
      denuncia (Te Protejo, ICBF 141, Centro Cibernético Policial, Fiscalía 122, En TIC Confío+) en el
      pie de todo el sitio; cláusula 11 en /terminos.
- [ ] Confirmar la herramienta de filtrado/bloqueo de URL (listado DIJIN/MinTIC) que usa la red y que
      el contrato de servicio incluya la cláusula de la Ley 679. Revisión legal del texto.
- [x] Logos de Te Protejo, ICBF, Centro Cibernético Policial, Fiscalía y En TIC Confío+.

## Empresa

- [x] Razón social WIPLUS COMUNICACIONES DE COLOMBIA SAS, NIT 901194958-0.
- [ ] Registro TIC (MinTIC) para los textos legales.
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

- [x] Proyecto de Sanity (k3vbxtev, dataset production) y token de escritura.
- [x] Dominio: www.wiplus.com.co apunta a Vercel (A 216.198.79.1 en cPanel; `wiplus.com.co` redirige
      a www). El correo sigue en el hosting de cPanel: **no cancelar el hosting**.
- [x] Correo de los formularios con Brevo: dominio autenticado (brevo-code, DKIM brevo1/brevo2,
      DMARC con rua), `BREVO_API_KEY`, `MAIL_FROM` y `MAIL_TO` en Vercel. Probado: llega sin spam.
- [x] Google Search Console: propiedad de dominio verificada por DNS (TXT) y sitemap enviado
      (21 páginas, «Correcto»).
- [x] Sanity › API › CORS origins: `https://www.wiplus.com.co` agregado (/studio en el dominio).
- [ ] Borrar el WordPress viejo del hosting (solo la instalación, desde Softaculous) cuando se
      confirme que todo funciona. Hay copia con All-in-One WP Migration.
- [ ] Servidor propio de test de velocidad (OpenSpeedTest, código abierto) dentro de la red de WIPLUS,
      p. ej. `test.wiplus.com.co`, para que el cliente mida su plan sin pasar por Bogotá. Hoy se usa el
      servidor público de openspeedtest.com (`components/sections/SpeedTest.tsx`).
- [x] Claves de Cloudflare Turnstile (formularios probados en el dominio).
- [ ] ID de Google Analytics 4.
- [ ] Acceso a Cloudflare (solo si se migra el despliegue a Cloudflare Workers).
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
