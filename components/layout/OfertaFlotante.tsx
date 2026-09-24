'use client'

import { ArrowRight, Sparkles, Tag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ExampleBadge } from '@/components/ui/ExampleBadge'
import { track } from '@/lib/analytics'
import { formatCOP } from '@/lib/phone'
import type { OfertaFlotante as Oferta, OfertaItem } from '@/lib/types'
import { whatsappUrl } from '@/lib/whatsapp'
import icono from '@/public/brand/wiplus-icono-app.png'

/**
 * Logo de WIPLUS flotante (encima del botón de WhatsApp) con una cinta y un globo de mensaje.
 * Al pulsarlo abre un panel con las ofertas publicadas en CMS › Oferta flotante.
 */
export function OfertaFlotante({ oferta, whatsapp }: { oferta: Oferta; whatsapp: string }) {
  const [abierto, setAbierto] = useState(false)
  const [globo, setGlobo] = useState(false)
  const panelId = useId()
  const tituloId = useId()
  const contenedor = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  // El globo cerrado no vuelve a salir en la sesión, salvo que se publique una oferta nueva.
  const claveGlobo = `wiplus-oferta-globo:${oferta.version}`

  useEffect(() => {
    if (!oferta.mensaje) return
    let cerrado = false
    try {
      cerrado = sessionStorage.getItem(claveGlobo) === '1'
    } catch {
      // Almacenamiento bloqueado: se muestra igual.
    }
    if (cerrado) return
    const t = setTimeout(() => setGlobo(true), 1500)
    return () => clearTimeout(t)
  }, [claveGlobo, oferta.mensaje])

  const cerrarGlobo = () => {
    setGlobo(false)
    try {
      sessionStorage.setItem(claveGlobo, '1')
    } catch {
      // Sin almacenamiento: solo se oculta en esta vista.
    }
  }

  const cerrar = useCallback((devolverFoco = true) => {
    setAbierto(false)
    track('oferta_flotante', { accion: 'cerrar' })
    if (devolverFoco) boton.current?.focus()
  }, [])

  const abrir = () => {
    setAbierto(true)
    cerrarGlobo()
    track('oferta_flotante', { accion: 'abrir' })
  }

  useEffect(() => {
    if (!abierto) return
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrar()
    const onClickFuera = (e: PointerEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) cerrar(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClickFuera)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClickFuera)
    }
  }, [abierto, cerrar])

  return (
    <div
      ref={contenedor}
      className="fixed right-4 bottom-[5.5rem] z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-28"
    >
      {abierto && (
        <div
          ref={panel}
          id={panelId}
          role="dialog"
          aria-labelledby={tituloId}
          tabIndex={-1}
          className="w-[min(22rem,calc(100vw-2rem))] animate-fade-up overflow-hidden rounded-3xl bg-white shadow-card-hover ring-1 ring-line outline-none"
        >
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary-800 to-primary-600 py-3 pr-2 pl-4 text-white">
            <p id={tituloId} className="flex items-center gap-2 font-extrabold">
              <Tag className="size-4 text-accent-300" aria-hidden />
              {oferta.titulo}
              <ExampleBadge show={oferta.ejemplo} />
            </p>
            <button
              type="button"
              onClick={() => cerrar()}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
            >
              <X className="size-5" aria-hidden />
              <span className="sr-only">Cerrar ofertas</span>
            </button>
          </div>
          <ul className="flex snap-x [scrollbar-width:thin] gap-3 overflow-x-auto p-3">
            {oferta.items.map((item) => (
              <li key={item.id} className="w-[8.5rem] shrink-0 snap-start">
                <Tarjeta item={item} whatsapp={whatsapp} />
              </li>
            ))}
          </ul>
          {oferta.pie && (
            <p className="border-t border-line px-4 py-2.5 text-center text-sm font-semibold text-primary-900">
              {oferta.pie}
            </p>
          )}
        </div>
      )}

      {!abierto && globo && oferta.mensaje && (
        <div className="relative max-w-[15rem] animate-fade-up rounded-2xl bg-white py-2.5 pr-9 pl-3.5 text-sm font-semibold text-primary-900 shadow-card-hover ring-1 ring-line">
          <button type="button" onClick={abrir} className="text-left">
            {oferta.mensaje}{' '}
            <span className="whitespace-nowrap text-primary-600 underline underline-offset-2">
              Ver ofertas
            </span>
          </button>
          <button
            type="button"
            onClick={cerrarGlobo}
            className="absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-primary-900"
          >
            <X className="size-4" aria-hidden />
            <span className="sr-only">Cerrar mensaje</span>
          </button>
          {/* Pico del globo apuntando al logo */}
          <span
            aria-hidden
            className="absolute right-7 -bottom-1.5 size-3 rotate-45 bg-white ring-1 ring-line [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          />
        </div>
      )}

      <button
        ref={boton}
        type="button"
        onClick={() => (abierto ? cerrar() : abrir())}
        aria-expanded={abierto}
        aria-controls={abierto ? panelId : undefined}
        className="oferta-flota relative mr-1 size-16 rounded-2xl bg-white shadow-lg ring-4 ring-white transition-transform hover:scale-105 focus-visible:scale-105 sm:mr-0 sm:size-[4.5rem]"
      >
        <Image src={icono} alt="" fill sizes="72px" className="rounded-xl object-cover" />
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-gradient-to-r from-accent-500 to-primary-600 px-2 py-0.5 text-[0.625rem] font-extrabold tracking-wide whitespace-nowrap text-white uppercase shadow-md">
          <Sparkles className="size-3" aria-hidden />
          {oferta.insignia}
        </span>
        {!abierto && (
          <span aria-hidden className="absolute -right-1 -bottom-1 flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full bg-accent-500 ring-2 ring-white" />
          </span>
        )}
        <span className="sr-only">
          {abierto ? 'Cerrar ofertas de WIPLUS' : `${oferta.insignia}: ver ofertas de WIPLUS`}
        </span>
      </button>
    </div>
  )
}

function Tarjeta({ item, whatsapp }: { item: OfertaItem; whatsapp: string }) {
  const contenido = (
    <>
      <span className="relative block aspect-square overflow-hidden rounded-xl bg-surface">
        {item.imagen ? (
          <Image
            src={item.imagen.src}
            alt={item.imagen.alt}
            fill
            sizes="136px"
            className="object-contain p-1"
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <Tag className="size-8 text-primary-300" aria-hidden />
          </span>
        )}
      </span>
      <span className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-primary-900">
        {item.titulo}
      </span>
      <span className="mt-1 block text-sm font-extrabold text-primary-700">
        {item.precio != null ? (
          <>
            {formatCOP(item.precio)}
            {item.detallePrecio && (
              <span className="ml-1 text-xs font-semibold text-muted">{item.detallePrecio}</span>
            )}
          </>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold">
            Consulta el precio <ArrowRight className="size-3" aria-hidden />
          </span>
        )}
      </span>
    </>
  )
  const clase =
    'block h-full rounded-2xl border border-line p-2 transition-colors hover:border-primary-300 hover:bg-primary-50'
  const alPulsar = () => track('oferta_flotante', { accion: 'click_item', item: item.titulo })
  const enlace = item.enlace?.trim()

  if (enlace?.startsWith('/'))
    return (
      <Link href={enlace} className={clase} onClick={alPulsar}>
        {contenido}
      </Link>
    )
  const externo = enlace && /^https?:\/\//.test(enlace)
  return (
    <a
      href={
        externo
          ? enlace
          : whatsappUrl(whatsapp, `Hola WIPLUS, me interesa la oferta: ${item.titulo}`)
      }
      target="_blank"
      rel="noopener noreferrer"
      className={clase}
      onClick={alPulsar}
    >
      {contenido}
      <span className="sr-only"> (abre en una nueva pestaña)</span>
    </a>
  )
}
