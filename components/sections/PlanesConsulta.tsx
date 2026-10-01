import { Phone, Wifi } from 'lucide-react'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { listaNatural } from '@/lib/texto'
import { mensajesWhatsApp } from '@/lib/whatsapp'

/**
 * Zonas sin precios publicados: rango de velocidades y «Consulta el precio» con WhatsApp y llamada
 * (regla del proyecto: precio desconocido ⇒ «Consulta el precio» + WhatsApp).
 */
export function PlanesConsulta({
  zonas,
  desdeMb,
  hastaMb,
  whatsapp,
  telefono,
  ubicacion,
}: {
  zonas: string[]
  desdeMb: number
  hastaMb: number
  whatsapp: string
  telefono?: string
  ubicacion: string
}) {
  const lugar = listaNatural(zonas)
  return (
    <article className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-6 text-center shadow-card sm:p-8">
      <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Wifi className="size-7" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-bold tracking-wider text-primary-600 uppercase">
        Fibra óptica en {lugar}
      </p>
      <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
        Planes desde {desdeMb} hasta {hastaMb} Mb
      </h3>
      <p className="mt-3 text-xl font-extrabold text-primary-900">Consulta el precio</p>
      <p className="mt-1 text-muted">
        Te damos los precios y te ayudamos a elegir tu plan por WhatsApp o en nuestras líneas de
        atención.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <WhatsAppLink
          numero={whatsapp}
          mensaje={mensajesWhatsApp.planesZona(zonas.length === 1 ? zonas[0] : undefined)}
          ubicacion={ubicacion}
          size="md"
        >
          Consultar por WhatsApp
        </WhatsAppLink>
        {telefono && (
          <CallLink
            numero={telefono}
            ubicacion={ubicacion}
            variant="outline"
            size="md"
            aria-label={`Llamar al ${telefono}`}
          >
            <Phone className="size-4" aria-hidden />
            Llamar al {telefono}
          </CallLink>
        )}
      </div>
    </article>
  )
}
