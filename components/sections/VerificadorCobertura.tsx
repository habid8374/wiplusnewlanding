'use client'

import {
  ArrowRight,
  CircleCheck,
  CircleDashed,
  CircleMinus,
  Clock,
  FlaskConical,
  MessageCircleQuestion,
  Search,
} from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { TextField } from '@/components/forms/fields'
import { FormShell } from '@/components/forms/FormShell'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { track } from '@/lib/analytics'
import { crearBuscador } from '@/lib/cobertura/buscar'
import { cn } from '@/lib/cn'
import type { Barrio, ConfigCobertura, EstadoCobertura, Municipio } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'

type Resultado = { tipo: 'barrio'; barrio: Barrio } | { tipo: 'noAparece'; texto: string } | null

/** Presentación de cada estado: el color nunca va solo (siempre con icono y texto). */
const ESTADOS = {
  cubierto: {
    etiqueta: 'Con cobertura',
    Icono: CircleCheck,
    caja: 'bg-green-50 ring-green-200',
    icono: 'text-green-700',
    chip: 'bg-green-100 text-green-900',
  },
  parcial: {
    etiqueta: 'Cobertura parcial',
    Icono: CircleDashed,
    caja: 'bg-amber-50 ring-amber-200',
    icono: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-950',
  },
  proximamente: {
    etiqueta: 'Próximamente',
    Icono: Clock,
    caja: 'bg-primary-50 ring-primary-100',
    icono: 'text-primary-700',
    chip: 'bg-primary-100 text-primary-900',
  },
  sin_cobertura: {
    etiqueta: 'Sin cobertura por ahora',
    Icono: CircleMinus,
    caja: 'bg-slate-50 ring-slate-200',
    icono: 'text-slate-600',
    chip: 'bg-slate-200 text-slate-800',
  },
} satisfies Record<EstadoCobertura, unknown>

const reemplazar = (texto: string, barrio: string, municipio: string) =>
  texto.replaceAll('{barrio}', barrio).replaceAll('{municipio}', municipio)

/**
 * Verificador de cobertura por barrio: municipio (chips) + combobox accesible + resultado por estado.
 * `completo` (página /cobertura) sincroniza la URL (?municipio=…&barrio=…) para compartir el resultado.
 */
export function VerificadorCobertura({
  municipios,
  config,
  whatsapp,
  variante = 'completo',
}: {
  municipios: Municipio[]
  config: ConfigCobertura
  whatsapp: string
  variante?: 'completo' | 'compacto'
}) {
  const id = useId()
  const listaId = `${id}-lista`
  const inputRef = useRef<HTMLInputElement>(null)
  const [municipioSlug, setMunicipioSlug] = useState(municipios[0]?.slug ?? '')
  const [texto, setTexto] = useState('')
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(-1)
  const [resultado, setResultado] = useState<Resultado>(null)
  const [aviso, setAviso] = useState('')

  const municipio = municipios.find((m) => m.slug === municipioSlug) ?? municipios[0]
  const buscador = useMemo(() => crearBuscador(municipio?.barrios ?? []), [municipio])
  const sugerencias = useMemo(() => (texto.trim() ? buscador.buscar(texto) : []), [buscador, texto])
  const hayDemo = config.mostrarAvisoDemo && !!municipio?.barrios.some((b) => b.demo)
  const numero = municipio?.whatsapp || whatsapp
  const mostrarLista = abierto && sugerencias.length > 0

  function actualizarUrl(m: Municipio, b?: Barrio) {
    if (variante !== 'completo') return
    const url = new URL(window.location.href)
    url.searchParams.set('municipio', m.slug)
    if (b) url.searchParams.set('barrio', b.slug)
    else url.searchParams.delete('barrio')
    window.history.replaceState(null, '', url)
  }

  function elegir(b: Barrio, m: Municipio | undefined = municipio) {
    if (!m) return
    setTexto(b.nombre)
    setAbierto(false)
    setActivo(-1)
    setAviso('')
    setResultado({ tipo: 'barrio', barrio: b })
    actualizarUrl(m, b)
    track('verificar_cobertura', { municipio: m.nombre, barrio: b.nombre, estado: b.estado })
  }

  function noAparece() {
    if (!municipio) return
    setAbierto(false)
    setAviso('')
    setResultado({ tipo: 'noAparece', texto: texto.trim() })
    actualizarUrl(municipio)
    track('cobertura_no_aparece', { municipio: municipio.nombre, texto_buscado: texto.trim() })
  }

  function verificar() {
    const exacto = buscador.exacto(texto)
    if (exacto) return elegir(exacto)
    if (sugerencias.length) {
      setAbierto(true)
      setActivo(0)
      setAviso('Elige tu barrio en la lista o pulsa «¿No encuentras tu barrio?».')
      return
    }
    if (texto.trim().length >= 2) return noAparece()
    setAviso('Escribe el nombre de tu barrio o vereda.')
    inputRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAbierto(true)
      setActivo((i) => Math.min(i + 1, sugerencias.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActivo((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (mostrarLista && activo >= 0 && sugerencias[activo]) elegir(sugerencias[activo])
      else verificar()
    } else if (e.key === 'Escape') {
      if (mostrarLista) setAbierto(false)
      else setTexto('')
      setActivo(-1)
    }
  }

  // URL compartida: /cobertura?municipio=sabanalarga&barrio=centro muestra el mismo resultado.
  useEffect(() => {
    if (variante !== 'completo') return
    const params = new URLSearchParams(window.location.search)
    const m = municipios.find((x) => x.slug === params.get('municipio'))
    if (!m) return
    const b = m.barrios.find((x) => x.slug === params.get('barrio'))
    // Se difiere para no actualizar el estado dentro del efecto de forma síncrona.
    queueMicrotask(() => {
      setMunicipioSlug(m.slug)
      if (b) elegir(b, m)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir la página
  }, [])

  if (!municipio) return null

  return (
    <div
      className={cn(
        'rounded-3xl border border-line bg-white p-5 text-ink shadow-card',
        variante === 'completo' && 'sm:p-8',
      )}
      data-testid="verificador-cobertura"
    >
      <p className="font-bold text-primary-900 sm:text-lg">{config.titulo}</p>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-semibold">Municipio</legend>
        <div className="flex flex-wrap gap-2">
          {municipios.map((m) => (
            <label key={m.id} className="cursor-pointer">
              <input
                type="radio"
                name={`${id}-municipio`}
                value={m.slug}
                checked={m.slug === municipio.slug}
                onChange={() => {
                  setMunicipioSlug(m.slug)
                  setTexto('')
                  setResultado(null)
                  setAviso('')
                  actualizarUrl(m)
                }}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border-2 border-line px-4 font-semibold text-primary-900 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-500">
                {m.nombre}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor={`${id}-barrio`} className="mb-1 block text-sm font-semibold">
          Barrio o vereda
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              id={`${id}-barrio`}
              type="text"
              role="combobox"
              aria-expanded={mostrarLista}
              aria-controls={listaId}
              aria-autocomplete="list"
              aria-activedescendant={
                mostrarLista && activo >= 0 ? `${listaId}-${activo}` : undefined
              }
              aria-describedby={aviso ? `${id}-aviso` : undefined}
              autoComplete="off"
              placeholder="Escribe tu barrio…"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value)
                setAbierto(true)
                setActivo(-1)
                setAviso('')
              }}
              onKeyDown={onKeyDown}
              onBlur={() => setAbierto(false)}
              onFocus={() => texto && setAbierto(true)}
              className="h-12 w-full rounded-xl border border-line px-3 text-base"
            />
            <ul
              id={listaId}
              role="listbox"
              aria-label={`Barrios de ${municipio.nombre}`}
              hidden={!mostrarLista}
              className="absolute inset-x-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-card-hover"
            >
              {sugerencias.map((b, i) => {
                const e = ESTADOS[b.estado]
                return (
                  <li
                    key={b.id}
                    id={`${listaId}-${i}`}
                    role="option"
                    aria-selected={i === activo}
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => elegir(b)}
                    className={cn(
                      'flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5',
                      i === activo ? 'bg-primary-50' : 'hover:bg-surface',
                    )}
                  >
                    <span className="min-w-0 truncate font-semibold text-primary-950">
                      {b.nombre}
                    </span>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
                        e.chip,
                      )}
                    >
                      <e.Icono className="size-3.5" aria-hidden />
                      {e.etiqueta}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <button
            type="button"
            onClick={verificar}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 font-bold text-white hover:bg-primary-700"
          >
            <Search className="size-5" aria-hidden />
            Verificar
          </button>
        </div>
        {aviso && (
          <p id={`${id}-aviso`} className="mt-2 text-sm font-semibold text-primary-800">
            {aviso}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={noAparece}
            className="text-sm font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-900"
          >
            ¿No encuentras tu barrio?
          </button>
          {hayDemo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
              <FlaskConical className="size-3.5" aria-hidden />
              Datos de muestra — cobertura por confirmar
            </span>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && (
          <TarjetaResultado
            key={resultado.tipo === 'barrio' ? resultado.barrio.id : `no-${resultado.texto}`}
            resultado={resultado}
            municipio={municipio}
            config={config}
            numero={numero}
          />
        )}
      </div>
    </div>
  )
}

function TarjetaResultado({
  resultado,
  municipio,
  config,
  numero,
}: {
  resultado: NonNullable<Resultado>
  municipio: Municipio
  config: ConfigCobertura
  numero: string
}) {
  const claseForm = 'mt-4 rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5'

  if (resultado.tipo === 'noAparece') {
    return (
      <div
        data-testid="resultado-cobertura"
        data-estado="no_aparece"
        className="mt-5 rounded-2xl bg-primary-50 p-4 ring-1 ring-primary-100 sm:p-5"
      >
        <p className="flex items-start gap-2 font-bold text-primary-950">
          <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-primary-700" aria-hidden />
          {config.mensajes.noAparece}
        </p>
        <FormularioSolicitud
          motivo="barrio_no_aparece"
          titulo={`Tu barrio en ${municipio.nombre}`}
          municipio={municipio}
          barrioInicial={resultado.texto}
          conDireccion
          className={claseForm}
        />
      </div>
    )
  }

  const { barrio } = resultado
  const e = ESTADOS[barrio.estado]
  const mensaje = reemplazar(config.mensajes[barrio.estado], barrio.nombre, municipio.nombre)

  return (
    <div
      data-testid="resultado-cobertura"
      data-estado={barrio.estado}
      className={cn('mt-5 rounded-2xl p-4 ring-1 sm:p-5', e.caja)}
    >
      <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
        <e.Icono className={cn('size-4', e.icono)} aria-hidden />
        {e.etiqueta} · {barrio.nombre}, {municipio.nombre}
      </p>
      <p className="mt-2 text-lg font-extrabold text-primary-950">{mensaje}</p>
      {barrio.notaPublica && <p className="mt-1 text-muted">{barrio.notaPublica}</p>}

      {barrio.estado === 'cubierto' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <WhatsAppLink
            numero={numero}
            mensaje={mensajesWhatsApp.coberturaContratar(barrio.nombre, municipio.nombre)}
            ubicacion="cobertura"
            size="md"
          >
            Contratar por WhatsApp
          </WhatsAppLink>
          <ButtonLink href="/planes-hogar" variant="outline" size="md">
            Ver planes
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      )}

      {barrio.estado === 'parcial' && (
        <>
          <WhatsAppLink
            numero={numero}
            mensaje={mensajesWhatsApp.coberturaParcial(barrio.nombre, municipio.nombre)}
            ubicacion="cobertura"
            size="md"
            className="mt-4"
          >
            Confirmar por WhatsApp
          </WhatsAppLink>
          <FormularioSolicitud
            motivo="parcial_confirmar"
            titulo="O déjanos tu dirección y te confirmamos"
            municipio={municipio}
            barrio={barrio}
            conDireccion
            className={claseForm}
          />
        </>
      )}

      {(barrio.estado === 'proximamente' || barrio.estado === 'sin_cobertura') && (
        <FormularioSolicitud
          motivo="avisame"
          titulo="Avísame cuando lleguen"
          municipio={municipio}
          barrio={barrio}
          className={claseForm}
        />
      )}
    </div>
  )
}

function FormularioSolicitud({
  motivo,
  titulo,
  municipio,
  barrio,
  barrioInicial,
  conDireccion,
  className,
}: {
  motivo: 'barrio_no_aparece' | 'avisame' | 'parcial_confirmar'
  titulo: string
  municipio: Municipio
  barrio?: Barrio
  barrioInicial?: string
  conDireccion?: boolean
  className: string
}) {
  return (
    <FormShell
      tipo="solicitudCobertura"
      titulo={titulo}
      tituloComo="h3"
      submitLabel={motivo === 'avisame' ? 'Avísame' : 'Enviar'}
      exitoTitulo="¡Listo, recibimos tus datos!"
      onEnviado={() => track('cobertura_solicitud', { tipo: motivo })}
      className={className}
    >
      <input type="hidden" name="motivo" value={motivo} />
      <input type="hidden" name="municipio" value={municipio.nombre} />
      {barrio && (
        <>
          <input type="hidden" name="barrio" value={barrio.nombre} />
          <input type="hidden" name="barrioId" value={barrio.id} />
        </>
      )}
      <TextField name="nombre" label="Nombre" required autoComplete="name" />
      <TextField
        name="celular"
        label="Celular"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      {!barrio && (
        <TextField
          name="barrio"
          label="Barrio o vereda"
          required
          defaultValue={barrioInicial}
          autoComplete="address-level3"
        />
      )}
      {conDireccion && (
        <TextField
          name="direccion"
          label="Dirección"
          autoComplete="street-address"
          className={barrio ? 'sm:col-span-2' : undefined}
        />
      )}
    </FormShell>
  )
}
