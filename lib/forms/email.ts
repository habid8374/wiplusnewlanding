import { FORM_LABELS, type FormType } from '@/lib/schemas/forms'

/** Etiquetas legibles de cada campo para el correo. */
const CAMPOS: Record<string, string> = {
  nombre: 'Nombre',
  titular: 'Titular',
  empresa: 'Empresa',
  nit: 'NIT',
  contacto: 'Contacto',
  contrato: 'Contrato / documento',
  celular: 'Celular',
  email: 'Correo',
  municipio: 'Municipio',
  barrio: 'Barrio',
  direccion: 'Dirección',
  plan: 'Plan de interés',
  velocidad: 'Velocidad requerida',
  tipo: 'Tipo de falla',
  asunto: 'Asunto',
  descripcion: 'Descripción',
  mensaje: 'Mensaje',
  tipoPqr: 'Tipo de PQR',
  documento: 'Documento',
  pretension: 'Lo que solicita',
}

const OMITIR = new Set(['aceptaPolitica', 'sitioWeb', 'turnstileToken'])

export function escapeHtml(v: unknown) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function layout(titulo: string, cuerpo: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f5f8fc;font-family:Arial,Helvetica,sans-serif;color:#08163c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f8fc;padding:24px 0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0a2a6e;padding:20px 24px;color:#ffffff;font-size:20px;font-weight:bold">WIPLUS <span style="color:#00bbfe">Comunicaciones</span></td></tr>
<tr><td style="padding:24px"><h1 style="margin:0 0 16px;font-size:20px;color:#0a2a6e">${escapeHtml(titulo)}</h1>${cuerpo}</td></tr>
<tr><td style="padding:16px 24px;background:#f5f8fc;font-size:12px;color:#475569">WIPLUS Comunicaciones · Calle 13 #17-04, Sabanalarga, Atlántico · atencionalcliente@wiplus.com.co</td></tr>
</table></td></tr></table></body></html>`
}

function tabla(datos: Record<string, unknown>) {
  const filas = Object.entries(datos)
    .filter(([k, v]) => !OMITIR.has(k) && v !== undefined && v !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #dbe3ee;font-weight:bold;width:40%;vertical-align:top">${escapeHtml(CAMPOS[k] ?? k)}</td><td style="padding:8px 12px;border-bottom:1px solid #dbe3ee;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${filas}</table>`
}

export function correoInterno(
  tipo: FormType,
  datos: Record<string, unknown>,
  extra: { ticket?: string; ip?: string; pagina?: string },
) {
  const etiqueta = tipo === 'pqr' ? 'Radicado' : 'Ticket'
  const titulo = `${FORM_LABELS[tipo]}${extra.ticket ? ` · ${etiqueta} ${extra.ticket}` : ''}`
  const celular = String(datos.celular ?? '')
  const cuerpo = `${extra.ticket ? `<p style="font-size:16px"><strong>${etiqueta}:</strong> <span style="font-family:monospace;font-size:18px">${escapeHtml(extra.ticket)}</span></p>` : ''}
${tabla(datos)}
<p style="margin-top:20px"><a href="https://wa.me/57${escapeHtml(celular)}" style="background:#15803d;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">Responder por WhatsApp</a></p>
<p style="font-size:12px;color:#475569;margin-top:16px">Aceptó la política de tratamiento de datos: sí · Enviado: ${escapeHtml(new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }))}</p>`
  return { subject: `[Web] ${titulo}`, html: layout(titulo, cuerpo) }
}

export function correoConfirmacion(
  tipo: FormType,
  datos: Record<string, unknown>,
  ticket?: string,
) {
  const nombre = String(datos.nombre ?? datos.titular ?? datos.contacto ?? '')
  const pqr = tipo === 'pqr'
  const titulo = pqr
    ? `Radicamos tu PQR · ${ticket}`
    : ticket
      ? `Recibimos tu reporte · Ticket ${ticket}`
      : 'Recibimos tu solicitud'
  const intro = pqr
    ? '<p>Recibimos tu petición, queja o recurso. Te responderemos dentro de los <strong>15 días hábiles</strong> siguientes, como lo establece el Régimen de Protección de los Usuarios de la CRC.</p>'
    : `<p>Gracias por escribirnos. Recibimos tu ${escapeHtml(FORM_LABELS[tipo].toLowerCase())} y un asesor te contactará en nuestro horario de atención (8:00 a. m. – 6:00 p. m.).</p>`
  const cuerpo = `<p>Hola ${escapeHtml(nombre)},</p>
${intro}
${ticket ? `<p style="font-size:16px">Tu número de ${pqr ? 'radicado' : 'ticket'} es <strong style="font-family:monospace">${escapeHtml(ticket)}</strong>. Guárdalo para hacer seguimiento.</p>` : ''}
<p>Este es un resumen de lo que nos enviaste:</p>${tabla(datos)}
<p style="margin-top:16px">Si necesitas algo más, respóndenos a este correo o escríbenos por WhatsApp.</p>`
  return { subject: `WIPLUS Comunicaciones: ${titulo}`, html: layout(titulo, cuerpo) }
}

export type EmailResult = { ok: boolean; simulado?: boolean }

type Correo = { from: string; to: string[]; subject: string; html: string; reply_to?: string }
type Enviar = (correo: Correo) => Promise<{ error: string | null }>

/**
 * Proveedor de correo según las variables de entorno: Brevo (BREVO_API_KEY) o Resend
 * (RESEND_API_KEY). Si están las dos, se usa Brevo. Sin ninguna, los correos se simulan.
 */
function proveedor(): Enviar | null {
  const brevo = process.env.BREVO_API_KEY
  if (brevo) return (c) => enviarBrevo(brevo, c)
  const resend = process.env.RESEND_API_KEY
  if (resend) return (c) => enviarResend(resend, c)
  return null
}

/** Quita comillas envolventes (valores copiados tal cual de .env.example a Vercel). */
const sinComillas = (v?: string) =>
  v
    ?.trim()
    .replace(/^(["'])(.*)\1$/, '$2')
    .trim()

export const hayProveedorCorreo = () => proveedor() !== null

export async function enviarCorreos(
  tipo: FormType,
  datos: Record<string, unknown>,
  extra: { ticket?: string; ip?: string },
): Promise<EmailResult> {
  const enviar = proveedor()
  const from =
    sinComillas(process.env.MAIL_FROM) || 'WIPLUS Comunicaciones <no-responder@wiplus.com.co>'
  const to = sinComillas(process.env.MAIL_TO) || 'atencionalcliente@wiplus.com.co'
  const emailUsuario = typeof datos.email === 'string' && datos.email ? datos.email : undefined

  if (!enviar) {
    console.info(`[formularios] Sin proveedor de correo: correo simulado (${tipo})`, {
      ticket: extra.ticket,
    })
    return { ok: true, simulado: true }
  }

  const interno = correoInterno(tipo, datos, extra)
  const { error } = await enviar({
    from,
    to: [to],
    subject: interno.subject,
    html: interno.html,
    ...(emailUsuario ? { reply_to: emailUsuario } : {}),
  })
  if (error) {
    console.error('[formularios] Error enviando correo interno', error)
    return { ok: false }
  }
  if (emailUsuario) {
    const conf = correoConfirmacion(tipo, datos, extra.ticket)
    const r = await enviar({
      from,
      to: [emailUsuario],
      subject: conf.subject,
      html: conf.html,
      reply_to: to,
    })
    if (r.error) console.error('[formularios] Error enviando confirmación', r.error)
  }
  return { ok: true }
}

/** Envío con la API REST de Resend (https://resend.com/docs/api-reference/emails/send-email). */
async function enviarResend(key: string, body: Correo): Promise<{ error: string | null }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return { error: `Resend ${res.status}: ${(await res.text()).slice(0, 200)}` }
    return { error: null }
  } catch (e) {
    return { error: String(e) }
  }
}

/** "Nombre <correo@dominio>" → { name, email } (formato de Brevo). */
function direccion(valor: string): { name?: string; email: string } {
  const m = valor.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
  return m ? { ...(m[1] ? { name: m[1] } : {}), email: m[2].trim() } : { email: valor.trim() }
}

/** Envío con la API REST de Brevo (https://developers.brevo.com/reference/sendtransacemail). */
async function enviarBrevo(key: string, c: Correo): Promise<{ error: string | null }> {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sender: direccion(c.from),
        to: c.to.map(direccion),
        subject: c.subject,
        htmlContent: c.html,
        ...(c.reply_to ? { replyTo: direccion(c.reply_to) } : {}),
      }),
    })
    if (!res.ok) return { error: `Brevo ${res.status}: ${(await res.text()).slice(0, 200)}` }
    return { error: null }
  } catch (e) {
    return { error: String(e) }
  }
}
