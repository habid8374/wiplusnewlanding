import 'server-only'

import { cache } from 'react'
import * as local from '@/content'
import { SHOW_EXAMPLES, WHATSAPP_OVERRIDE } from '@/lib/env'
import type {
  Aviso,
  ConfigCobertura,
  OfertaFlotante,
  ClienteEmpresarial,
  Faq,
  FaqCategoria,
  Foto,
  InfoPagos,
  Municipio,
  OfertaEmpresarial,
  Plan,
  SiteSettings,
  Testimonio,
} from '@/lib/types'
import { slugify } from '@/lib/cobertura/csv'
import { sanityFetch } from '@/sanity/client'
import { isSanityConfigured } from '@/sanity/env'

/**
 * Capa única de acceso al contenido.
 *  1. Si Sanity está configurado, consulta el CMS (caché de Next con etiquetas; /api/revalidate la invalida).
 *  2. Si no hay CMS, la consulta falla o viene vacía, usa el respaldo local de /content.
 *  3. Filtra el contenido marcado como `ejemplo` cuando el sitio corre en producción.
 */

export const CONTENT_TAG = 'sanity'
const REVALIDATE_SECONDS = 3600

async function fromSanity<T>(query: string, tag: string, params: Record<string, unknown> = {}) {
  if (!isSanityConfigured) return null
  try {
    const data = await sanityFetch<T>(query, params, {
      revalidate: REVALIDATE_SECONDS,
      tags: [CONTENT_TAG, tag],
    })
    if (data == null || (Array.isArray(data) && data.length === 0)) return null
    return data
  } catch (error) {
    console.error(
      `[content] Error consultando Sanity (${tag}); se usa el respaldo local: ${String((error as Error)?.message ?? error).slice(0, 160)}`,
    )
    return null
  }
}

const visible = <T extends { ejemplo?: boolean }>(items: T[]) =>
  SHOW_EXAMPLES ? items : items.filter((i) => !i.ejemplo)

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const cms = await fromSanity<Partial<SiteSettings>>(
    `*[_id == "siteSettings"][0]{nombre, eslogan, telefonos[]{numero, etiqueta}, whatsapp, correo, direccion, horario{texto, dias, abre, cierra}, redes, experienciaAnios, mision, vision, razonSocial, nit}`,
    'siteSettings',
  )
  const merged: SiteSettings = {
    ...local.sitio,
    ...stripNulls(cms ?? {}),
    direccion: { ...local.sitio.direccion, ...stripNulls(cms?.direccion ?? {}) },
    horario: { ...local.sitio.horario, ...stripNulls(cms?.horario ?? {}) },
    redes: { ...local.sitio.redes, ...stripNulls(cms?.redes ?? {}) },
  }
  if (WHATSAPP_OVERRIDE) merged.whatsapp = WHATSAPP_OVERRIDE
  return merged
})

export const getPlanes = cache(async (): Promise<Plan[]> => {
  const cms = await fromSanity<Plan[]>(
    `*[_type == "plan"] | order(orden asc, velocidadMb asc){"id": _id, nombre, velocidadMb, "precio": coalesce(precio, null), "destacado": coalesce(destacado, false), etiqueta, "idealPara": coalesce(idealPara, ""), "beneficios": coalesce(beneficios, []), "orden": coalesce(orden, 10), ejemplo}`,
    'plan',
  )
  return visible(cms ?? local.planes).sort(
    (a, b) => a.orden - b.orden || a.velocidadMb - b.velocidadMb,
  )
})

export const getFaqs = cache(async (categoria?: FaqCategoria): Promise<Faq[]> => {
  const cms = await fromSanity<Faq[]>(
    `*[_type == "faq"] | order(orden asc){"id": _id, pregunta, respuesta, "categorias": coalesce(categorias, ["general"]), ejemplo}`,
    'faq',
  )
  const all = visible(cms ?? local.faqs)
  return categoria ? all.filter((f) => f.categorias.includes(categoria)) : all
})

export const getTestimonios = cache(async (): Promise<Testimonio[]> => {
  const cms = await fromSanity<Testimonio[]>(
    `*[_type == "testimonio"] | order(orden asc){"id": _id, nombre, "contexto": coalesce(contexto, ""), texto, ejemplo}`,
    'testimonio',
  )
  return visible(cms ?? local.testimonios)
})

export const getClientes = cache(async (): Promise<ClienteEmpresarial[]> => {
  const cms = await fromSanity<ClienteEmpresarial[]>(
    `*[_type == "clienteEmpresarial"] | order(orden asc){"id": _id, nombre, sector, "logo": select(defined(logo.asset) => {"src": logo.asset->url, "alt": coalesce(logo.alt, "Logo de " + nombre), "width": logo.asset->metadata.dimensions.width, "height": logo.asset->metadata.dimensions.height}, null), ejemplo}`,
    'clienteEmpresarial',
  )
  return visible(cms ?? local.clientes)
})

/**
 * Municipios activos con sus barrios. Solo campos públicos: notaInterna, geometría y cajas NAP
 * nunca se consultan (no llegan al navegador). Los barrios de muestra se ocultan en producción.
 */
export const getCobertura = cache(async (): Promise<Municipio[]> => {
  const cms = await fromSanity<Municipio[]>(
    `*[_type == "municipio" && coalesce(activo, true)] | order(orden asc){"id": _id, "slug": coalesce(slug.current, ""), nombre, "departamento": coalesce(departamento, "Atlántico"), "geo": select(defined(geo.lat) => {"lat": geo.lat, "lng": geo.lng}, null), whatsapp, "barrios": *[_type == "barrio" && municipio._ref == ^._id && defined(estado)] | order(nombre asc){"id": _id, "slug": coalesce(slug.current, ""), nombre, "tipo": coalesce(tipo, "barrio"), estado, "alias": coalesce(alias, []), notaPublica, "demo": coalesce(demo, false)}}`,
    'barrio',
  )
  const { mostrarMuestras } = await getConfigCobertura()
  return (cms ?? local.cobertura).map((m) => ({
    ...m,
    slug: m.slug || slugify(m.nombre),
    barrios: m.barrios
      .filter((b) => SHOW_EXAMPLES || mostrarMuestras || !b.demo)
      .map((b) => ({ ...b, slug: b.slug || slugify(b.nombre) })),
  }))
})

export const getConfigCobertura = cache(async (): Promise<ConfigCobertura> => {
  const cms = await fromSanity<Record<string, string | boolean | null>>(
    `*[_id == "configCobertura"][0]{titulo, msgCubierto, msgParcial, msgProximamente, msgSinCobertura, msgNoAparece, mostrarAvisoDemo, mostrarMuestras}`,
    'configCobertura',
  )
  const base = local.configCobertura
  const texto = (v: unknown, d: string) => (typeof v === 'string' && v.trim() ? v : d)
  return {
    titulo: texto(cms?.titulo, base.titulo),
    mensajes: {
      cubierto: texto(cms?.msgCubierto, base.mensajes.cubierto),
      parcial: texto(cms?.msgParcial, base.mensajes.parcial),
      proximamente: texto(cms?.msgProximamente, base.mensajes.proximamente),
      sin_cobertura: texto(cms?.msgSinCobertura, base.mensajes.sin_cobertura),
      noAparece: texto(cms?.msgNoAparece, base.mensajes.noAparece),
    },
    mostrarAvisoDemo:
      typeof cms?.mostrarAvisoDemo === 'boolean' ? cms.mostrarAvisoDemo : base.mostrarAvisoDemo,
    mostrarMuestras: cms?.mostrarMuestras === true,
  }
})

/** Burbuja flotante de ofertas: solo si está activa, dentro de sus fechas y con al menos una oferta. */
export const getOfertaFlotante = cache(async (): Promise<OfertaFlotante | null> => {
  const cms = await fromSanity<OfertaFlotante>(
    `*[_id == "ofertaFlotante" && activo == true][0]{"version": _rev, "insignia": coalesce(insignia, "¡Ofertas!"), mensaje, "titulo": coalesce(titulo, "Oferta destacada"), pie, desde, hasta, ejemplo, "items": coalesce(items[defined(titulo)]{"id": _key, titulo, precio, detallePrecio, enlace, "imagen": select(defined(imagen.asset) => {"src": imagen.asset->url, "alt": coalesce(imagen.alt, titulo), "width": imagen.asset->metadata.dimensions.width, "height": imagen.asset->metadata.dimensions.height}, null)}, [])}`,
    'ofertaFlotante',
  )
  const oferta = cms ?? local.ofertaFlotante
  const now = Date.now()
  if (
    !oferta ||
    oferta.items.length === 0 ||
    (oferta.ejemplo && !SHOW_EXAMPLES) ||
    (oferta.desde && Date.parse(oferta.desde) > now) ||
    (oferta.hasta && Date.parse(oferta.hasta) < now)
  )
    return null
  return oferta
})

export const getAvisoActivo = cache(async (): Promise<Aviso | null> => {
  const cms = await fromSanity<Aviso[]>(
    `*[_type == "aviso" && activo == true]{"id": _id, texto, enlace, "tono": coalesce(tono, "promo"), activo, desde, hasta, ejemplo}`,
    'aviso',
  )
  const now = Date.now()
  return (
    visible(cms ?? local.avisos).find(
      (a) =>
        a.activo &&
        (!a.desde || Date.parse(a.desde) <= now) &&
        (!a.hasta || Date.parse(a.hasta) >= now),
    ) ?? null
  )
})

export const getInfoPagos = cache(async (): Promise<InfoPagos> => {
  const cms = await fromSanity<InfoPagos>(
    `*[_id == "infoPagos"][0]{"medios": coalesce(medios[]{"id": _key, nombre, "descripcion": coalesce(descripcion, ""), ejemplo}, []), fechasCorte, "notas": coalesce(notas, [])}`,
    'infoPagos',
  )
  const data = cms ?? local.pagos
  return {
    ...data,
    // Un documento recién creado en el Studio llega vacío: se completa con el respaldo local.
    medios: visible(data.medios.length ? data.medios : local.pagos.medios),
    fechasCorte: data.fechasCorte || local.pagos.fechasCorte,
    notas: data.notas.length ? data.notas : local.pagos.notas,
  }
})

export const getOfertaEmpresarial = cache(async (): Promise<OfertaEmpresarial> => {
  const cms = await fromSanity<Partial<OfertaEmpresarial>>(
    `*[_id == "ofertaEmpresarial"][0]{titulo, descripcion, beneficios[]{titulo, descripcion}, velocidades}`,
    'ofertaEmpresarial',
  )
  return { ...local.ofertaEmpresarial, ...stripNulls(cms ?? {}) }
})

export const getFotos = cache(async (): Promise<Foto[]> => visible(local.fotos))

function stripNulls<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ) as Partial<T>
}
