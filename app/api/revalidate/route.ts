import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { CONTENT_TAG } from '@/lib/content'

/**
 * Webhook de Sanity → revalidación on-demand.
 * Configurar en sanity.io/manage › API › Webhooks:
 *   URL: https://www.wiplus.com.co/api/revalidate · Método: POST · Proyección: {_type}
 *   Secreto: el mismo valor de SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { message: 'SANITY_REVALIDATE_SECRET no configurado' },
      { status: 500 },
    )
  }
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Firma inválida' }, { status: 401 })
    }
    // Invalida inmediatamente (un webhook no puede usar updateTag).
    if (body?._type) revalidateTag(body._type, { expire: 0 })
    revalidateTag(CONTENT_TAG, { expire: 0 })
    revalidatePath('/', 'layout')
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() })
  } catch (error) {
    console.error('[revalidate]', error)
    return NextResponse.json({ message: 'Error procesando el webhook' }, { status: 500 })
  }
}
