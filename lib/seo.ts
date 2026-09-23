import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/env'
import { telE164 } from '@/lib/phone'
import type { Faq, Plan, SiteSettings } from '@/lib/types'

export const absoluteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`

/** Metadata por página: título único, descripción, canónica y Open Graph. */
export function pageMetadata({
  title,
  description,
  path,
  noIndex,
}: {
  title: string
  description: string
  path: string
  noIndex?: boolean
}): Metadata {
  const url = absoluteUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'es_CO',
      siteName: 'WIPLUS Comunicaciones',
    },
    twitter: { card: 'summary_large_image', title, description },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}

export function localBusinessJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#empresa`,
    name: s.nombre,
    description:
      'Proveedor de internet por fibra óptica para hogares y empresas en Sabanalarga y Luruaco, Atlántico.',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/wiplus-logo.png`,
    image: `${SITE_URL}/brand/wiplus-logo.png`,
    email: s.correo,
    telephone: s.telefonos[0] ? telE164(s.telefonos[0].numero) : undefined,
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: s.horario.diasSchema,
        opens: s.horario.abre,
        closes: s.horario.cierra,
      },
    ],
    areaServed: s.municipiosCobertura.map((m) => ({
      '@type': 'City',
      name: m,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Atlántico, Colombia' },
    })),
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

/** Product/Offer solo para planes con precio confirmado. */
export function planesJsonLd(planes: Plan[]) {
  return planes
    .filter((p) => p.precio != null)
    .map((p) => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `Internet fibra óptica ${p.velocidadMb} Mb — WIPLUS`,
      description: p.idealPara,
      brand: { '@type': 'Brand', name: 'WIPLUS Comunicaciones' },
      offers: {
        '@type': 'Offer',
        price: p.precio,
        priceCurrency: 'COP',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/planes-hogar#plan-${p.velocidadMb}`,
        seller: { '@id': `${SITE_URL}/#empresa` },
        areaServed: ['Sabanalarga', 'Luruaco'],
      },
    }))
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
