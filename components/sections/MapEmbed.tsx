'use client'

import { MapPin, Navigation } from 'lucide-react'
import { useState } from 'react'
import { buttonClasses } from '@/components/ui/button-styles'

/**
 * Mapa de Google Maps con fachada: no carga el iframe hasta que el usuario lo pide.
 * Así no se penaliza el rendimiento ni se cargan terceros (ni sus cookies) sin interacción.
 * Usa el mapa incrustable de Google sin API key, centrado por coordenadas (buscar por texto
 * ubicaba mal los municipios). `marcador={false}` centra el mapa sin poner pin.
 */
export function MapEmbed({
  lat,
  lng,
  zoom = 15,
  titulo,
  direccion,
  marcador = true,
  enlace,
  consulta,
}: {
  lat: number
  lng: number
  zoom?: number
  titulo: string
  direccion?: string
  marcador?: boolean
  /** Enlace propio para «Cómo llegar» (p. ej. el de la ficha en Google Maps). */
  enlace?: string
  /** Búsqueda para el mapa en lugar de coordenadas (p. ej. el nombre de la ficha de Google). */
  consulta?: string
}) {
  const [cargar, setCargar] = useState(false)
  const punto = `${lat},${lng}`
  const src = consulta
    ? `https://maps.google.com/maps?q=${encodeURIComponent(consulta)}&z=${zoom}&hl=es&output=embed`
    : marcador
      ? `https://maps.google.com/maps?q=${punto}&z=${zoom}&hl=es&output=embed`
      : `https://maps.google.com/maps?ll=${punto}&z=${zoom}&hl=es&output=embed`
  const gmaps =
    enlace ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion ?? punto)}`

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
        {cargar ? (
          <iframe
            title={titulo}
            src={src}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,var(--color-primary-100),var(--color-surface))] p-6 text-center">
            <MapPin className="size-10 text-primary-600" aria-hidden />
            <p className="font-bold text-primary-900">{titulo}</p>
            <button
              type="button"
              onClick={() => setCargar(true)}
              className={buttonClasses('primary', 'sm')}
            >
              Mostrar mapa
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
        {direccion && <span className="text-muted">{direccion}</span>}
        <a
          href={gmaps}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary-700 hover:underline"
        >
          <Navigation className="size-4" aria-hidden />
          Cómo llegar
          <span className="sr-only"> (abre Google Maps en una nueva pestaña)</span>
        </a>
      </div>
    </div>
  )
}
