import 'server-only'
import { apiVersion, dataset, projectId } from '@/sanity/env'

/**
 * Guarda una solicitud del verificador de cobertura en Sanity (tipo «solicitudCobertura»).
 * Usa SANITY_WRITE_TOKEN, que solo existe en el servidor. Sin token o sin Sanity, no guarda
 * (la solicitud igual llega por correo) y lo registra.
 */
export async function guardarSolicitudCobertura(datos: Record<string, unknown>): Promise<boolean> {
  const token = process.env.SANITY_WRITE_TOKEN
  if (!projectId || !token) {
    console.warn('[cobertura] Sanity sin SANITY_WRITE_TOKEN: la solicitud solo se envía por correo')
    return false
  }
  const texto = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  const barrioId = texto(datos.barrioId)
  const doc = {
    _type: 'solicitudCobertura',
    tipo: datos.motivo,
    estadoGestion: 'nueva',
    nombre: texto(datos.nombre),
    celular: texto(datos.celular),
    email: texto(datos.email),
    municipio: texto(datos.municipio),
    barrio: texto(datos.barrio),
    direccion: texto(datos.direccion),
    aceptaPolitica: datos.aceptaPolitica === true,
    creadoEn: new Date().toISOString(),
    ...(barrioId ? { barrioRef: { _type: 'reference', _ref: barrioId, _weak: true } } : {}),
  }
  try {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: [{ create: doc }] }),
      },
    )
    if (!res.ok) {
      console.error(`[cobertura] Sanity respondió ${res.status} al guardar la solicitud`)
      return false
    }
    return true
  } catch (error) {
    console.error('[cobertura] Error guardando la solicitud', String(error))
    return false
  }
}
