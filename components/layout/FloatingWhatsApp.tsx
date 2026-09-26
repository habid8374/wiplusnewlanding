'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { WhatsAppIcon } from '@/components/icons/brands'
import { mensajeParaRuta } from '@/lib/whatsapp'

/** Botón flotante propio (sin plugins) con mensaje según la página. */
export function FloatingWhatsApp({
  numero,
  numeroEmpresas,
}: {
  numero: string
  /** En la página de empresas se usa el WhatsApp de ventas empresariales. */
  numeroEmpresas?: string | null
}) {
  const pathname = usePathname()
  const empresas = pathname.startsWith('/planes-empresas') && numeroEmpresas
  return (
    <WhatsAppLink
      numero={empresas ? numeroEmpresas : numero}
      mensaje={mensajeParaRuta(pathname)}
      ubicacion="boton_flotante"
      variant="none"
      icon={false}
      data-testid="whatsapp-flotante"
      className="fixed right-4 bottom-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp-500 text-white shadow-lg ring-4 ring-white transition-transform hover:scale-105 focus-visible:scale-105 sm:right-6 sm:bottom-6 sm:size-16"
    >
      <WhatsAppIcon className="size-8 sm:size-9" />
      <span className="sr-only">Escríbenos por WhatsApp</span>
    </WhatsAppLink>
  )
}
