import { NextResponse } from 'next/server'
import { IS_PRODUCTION_SITE } from '@/lib/env'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { erroresPorCampo, formSchemas, type FormResponse, type FormType } from '@/lib/schemas/forms'
import { enviarCorreos, hayProveedorCorreo } from './email'
import { generarTicket } from './ticket'
import { verificarTurnstile } from './turnstile'

const MAX_BODY = 16_000

function responder(body: FormResponse, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers })
}

/** Lógica común de todos los formularios (route handlers en app/api/*). */
export async function handleForm(tipo: FormType, req: Request) {
  const ip = clientIp(req.headers)

  const limite = rateLimit(`${tipo}:${ip}`)
  if (!limite.ok) {
    return responder(
      {
        ok: false,
        mensaje:
          'Recibimos muchos envíos desde tu conexión. Intenta de nuevo en unos minutos o escríbenos por WhatsApp.',
      },
      429,
      { 'Retry-After': String(limite.retryAfter) },
    )
  }

  let raw: unknown
  try {
    const text = await req.text()
    if (text.length > MAX_BODY)
      return responder({ ok: false, mensaje: 'La solicitud es demasiado grande.' }, 413)
    raw = JSON.parse(text)
  } catch {
    return responder({ ok: false, mensaje: 'Solicitud inválida.' }, 400)
  }

  // Honeypot: si viene lleno, respondemos "éxito" sin procesar (no damos pistas al bot).
  if (
    raw &&
    typeof raw === 'object' &&
    'sitioWeb' in raw &&
    (raw as { sitioWeb?: unknown }).sitioWeb
  ) {
    return responder({ ok: true, mensaje: 'Gracias, te contactaremos pronto.' })
  }

  const parsed = formSchemas[tipo].safeParse(raw)
  if (!parsed.success) {
    return responder(
      { ok: false, mensaje: 'Revisa los campos marcados.', errores: erroresPorCampo(parsed.error) },
      400,
    )
  }
  const datos = parsed.data as Record<string, unknown>

  const captcha = await verificarTurnstile(String(datos.turnstileToken ?? ''), ip)
  if (!captcha.ok) {
    return responder(
      {
        ok: false,
        mensaje: 'No pudimos verificar que no eres un robot. Recarga la página e intenta de nuevo.',
      },
      400,
    )
  }

  const ticket =
    tipo === 'falla'
      ? generarTicket()
      : tipo === 'pqr'
        ? generarTicket(new Date(), 'PQR')
        : undefined

  if (!hayProveedorCorreo() && IS_PRODUCTION_SITE) {
    console.error('[formularios] Falta BREVO_API_KEY o RESEND_API_KEY en producción')
    return responder(
      {
        ok: false,
        mensaje:
          'No pudimos enviar tu solicitud en este momento. Por favor escríbenos por WhatsApp.',
      },
      503,
    )
  }

  try {
    const envio = await enviarCorreos(tipo, datos, { ticket, ip })
    if (!envio.ok) {
      return responder(
        {
          ok: false,
          mensaje: 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.',
        },
        502,
      )
    }
  } catch (error) {
    console.error('[formularios] Error inesperado', error)
    return responder(
      {
        ok: false,
        mensaje: 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.',
      },
      500,
    )
  }

  return responder({
    ok: true,
    ticket,
    mensaje:
      tipo === 'pqr'
        ? 'Radicamos tu PQR. Te responderemos dentro de los 15 días hábiles siguientes por el medio de contacto que nos diste.'
        : ticket
          ? 'Nuestro equipo técnico revisará tu caso y te contactará por celular.'
          : 'Un asesor te contactará pronto en nuestro horario de atención.',
  })
}
