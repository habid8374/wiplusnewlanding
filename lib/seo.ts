import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/env'
import { telE164, telefonoPrincipal } from '@/lib/phone'
import { OG_ALT } from '@/lib/og-alt'
import { ogImagePath } from '@/lib/og-pages'
import type { Faq, Plan, SiteSettings } from '@/lib/types'
import { listaNatural } from '@/lib/texto'

/** Municipio o corregimiento servido, dentro del Atlántico (schema.org). */
const zona = (nombre: string) => ({
  '@type': 'Place',
  name: `${nombre}, Atlántico`,
  containedInPlace: { '@type': 'AdministrativeArea', name: 'Atlántico, Colombia' },
})

/**
 * Tarjeta para compartir de una ruta: la del inicio (app/opengraph-image.tsx) o la propia de su
 * sección (/og/<slug>, ver lib/og-pages.ts).
 */
function ogImage(path: string, titulo: string) {
  const url = ogImagePath(path)
  const alt = url === '/opengraph-image' ? OG_ALT : `${titulo} — WIPLUS Comunicaciones`
  return { url, width: 1200, height: 630, alt, type: 'image/png' }
}

export const absoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`

/** Metadata por página: título único, descripción, canónica y Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  noIndex,
  absoluteTitle,
}: {
  title: string
  description: string
  path: string
  noIndex?: boolean
  /** true = el título ya incluye la marca (no se aplica la plantilla "%s | WIPLUS…") */
  absoluteTitle?: boolean
}): Metadata {
  const url = absoluteUrl(path)
  const fullTitle = absoluteTitle ? title : `${title} | WIPLUS Comunicaciones`
  const imagen = ogImage(path, title)
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      locale: 'es_CO',
      siteName: 'WIPLUS Comunicaciones',
      // Explícito: al definir openGraph por página, Next no hereda la imagen de app/opengraph-image.
      images: [imagen],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [
        { url: imagen.url === '/opengraph-image' ? '/twitter-image' : imagen.url, alt: imagen.alt },
      ],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}

export function localBusinessJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#empresa`,
    name: s.nombre,
    description: `Proveedor de internet por fibra óptica para hogares y empresas en ${listaNatural(s.municipiosCobertura)} (Atlántico).`,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/wiplus-logo.png`,
    image: `${SITE_URL}/brand/wiplus-logo.png`,
    email: s.correo,
    telephone: telefonoPrincipal(s) ? telE164(telefonoPrincipal(s).numero) : undefined,
    contactPoint: s.telefonos.map((t) => ({
      '@type': 'ContactPoint',
      telephone: telE164(t.numero),
      contactType: 'customer service',
      areaServed: 'CO',
      availableLanguage: 'Spanish',
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion.calle,
      addressLocality: s.direccion.municipio,
      addressRegion: s.direccion.departamento,
      addressCountry: 'CO',
    },
    geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng },
    ...(s.mapsUrl ? { hasMap: s.mapsUrl } : {}),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: s.horario.diasSchema,
        opens: s.horario.abre,
        closes: s.horario.cierra,
      },
    ],
    areaServed: s.municipiosCobertura.map(zona),
    sameAs: Object.values(s.redes).filter(Boolean),
    ...(s.nit ? { taxID: s.nit } : {}),
    ...(s.razonSocial ? { legalName: s.razonSocial } : {}),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#sitio`,
    url: SITE_URL,
    name: 'WIPLUS Comunicaciones',
    inLanguage: 'es-CO',
    publisher: { '@id': `${SITE_URL}/#empresa` },
  }
}

/**
 * Planes de internet como `Service` con catálogo de ofertas (no `Product`): un plan de internet es un
 * servicio, y `Product` hace que Google lo trate como ficha de comerciante (pide imagen, envío,
 * devoluciones y reseñas, que no aplican). Solo planes con precio confirmado.
 */
export function planesJsonLd(planes: Plan[], zonas: string[]) {
  const conPrecio = planes.filter((p) => p.precio != null)
  if (!conPrecio.length) return []
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/planes-hogar#servicio`,
    serviceType: 'Internet por fibra óptica para el hogar',
    name: 'Planes de internet hogar WIPLUS',
    url: `${SITE_URL}/planes-hogar`,
    provider: { '@id': `${SITE_URL}/#empresa` },
    areaServed: zonas.map(zona),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planes de internet hogar',
      itemListElement: conPrecio.map((p) => ({
        '@type': 'Offer',
        name: p.nombre,
        description: p.idealPara,
        price: p.precio,
        priceCurrency: 'COP',
        url: `${SITE_URL}/planes-hogar#plan-${p.velocidadMb}`,
        itemOffered: {
          '@type': 'Service',
          name: `Internet fibra óptica ${p.velocidadMb} Mb`,
        },
      })),
    },
  }
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: f.respuesta },
    })),
  }
}

/** Servicio de internet en una zona (páginas /cobertura/<zona>). */
export function servicioZonaJsonLd(nombre: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Internet por fibra óptica',
    name: `Internet por fibra óptica en ${nombre}`,
    url: absoluteUrl(`/cobertura/${slug}`),
    provider: { '@id': `${SITE_URL}/#empresa` },
    areaServed: zona(nombre),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}
