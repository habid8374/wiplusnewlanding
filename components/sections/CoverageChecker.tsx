'use client'

import { CircleCheck, Clock, MessageCircleQuestion, Search } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { cn } from '@/lib/cn'
import type { Municipio } from '@/lib/types'
import { mensajesWhatsApp } from '@/lib/whatsapp'

type Resultado =
  | { tipo: 'disponible' | 'proximamente'; barrio: string; municipio: string }
  | { tipo: 'consultar'; barrio: string; municipio: string }

const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\b(barrio|urbanizacion|urb\.?|vereda|b\/)\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Mini verificador: municipio + barrio → sí / próximamente / consúltanos. */
export function CoverageChecker({
  municipios,
  whatsapp,
  variant = 'card',
}: {
  municipios: Municipio[]
  whatsapp: string
  variant?: 'card' | 'plain'
}) {
  const id = useId()
  const [municipioId, setMunicipioId] = useState(municipios[0]?.id ?? '')
  const [barrio, setBarrio] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [error, setError] = useState('')
  const municipio = municipios.find((m) => m.id === municipioId)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = normalizar(barrio)
    if (!municipio) return
    if (q.length < 2) {
      setError('Escribe el nombre de tu barrio o vereda.')
      setResultado(null)
      return
    }
    setError('')
    const match = municipio.barrios.find((b) => {
      const n = normalizar(b.nombre)
      return n === q || n.includes(q) || q.includes(n)
    })
    setResultado(
      match
        ? {
            tipo:
              match.estado === 'proximamente'
                ? 'proximamente'
                : match.estado === 'cubierto'
                  ? 'disponible'
                  : 'consultar',
            barrio: match.nombre,
            municipio: municipio.nombre,
          }
        : { tipo: 'consultar', barrio: barrio.trim(), municipio: municipio.nombre },
    )
  }

  return (
    <div
      className={cn(
        variant === 'card' &&
          'rounded-3xl border border-line bg-white p-5 text-ink shadow-card sm:p-6',
      )}
    >
      <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-ayuda`}>
        <p id={`${id}-ayuda`} className="font-bold text-primary-900">
          ¿Llegamos a tu casa? Compruébalo en segundos
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,10rem)_1fr_auto]">
          <div>
            <label htmlFor={`${id}-municipio`} className="mb-1 block text-sm font-semibold">
              Municipio
            </label>
            <select
              id={`${id}-municipio`}
              value={municipioId}
              onChange={(e) => {
                setMunicipioId(e.target.value)
                setResultado(null)
              }}
              className="h-12 w-full rounded-xl border border-line bg-white px-3 text-base"
            >
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-barrio`} className="mb-1 block text-sm font-semibold">
              Barrio o vereda
            </label>
            <input
              id={`${id}-barrio`}
              value={barrio}
              onChange={(e) => setBarrio(e.target.value)}
              list={`${id}-lista`}
              autoComplete="off"
              placeholder="Ej.: el nombre de tu barrio"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-error` : undefined}
              className="h-12 w-full rounded-xl border border-line px-3 text-base"
            />
            <datalist id={`${id}-lista`}>
              {municipio?.barrios.map((b) => (
                <option key={b.nombre} value={b.nombre} />
              ))}
            </datalist>
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-full bg-primary-600 px-6 font-bold text-white hover:bg-primary-700"
          >
            <Search className="size-5" aria-hidden />
            Verificar
          </button>
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
      </form>

      <div aria-live="polite" className="empty:hidden">
        {resultado && (
          <div
            data-testid="resultado-cobertura"
            data-resultado={resultado.tipo}
            className={cn(
              'mt-5 rounded-2xl p-4 sm:p-5',
              resultado.tipo === 'disponible' && 'bg-green-50 ring-1 ring-green-200',
              resultado.tipo === 'proximamente' && 'bg-amber-50 ring-1 ring-amber-200',
              resultado.tipo === 'consultar' && 'bg-primary-50 ring-1 ring-primary-100',
            )}
          >
            <p className="flex items-start gap-2 font-bold text-primary-950">
              {resultado.tipo === 'disponible' && (
                <>
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-green-700" aria-hidden />
                  ¡Sí! Tenemos servicio en {resultado.barrio}, {resultado.municipio}.
                </>
              )}
              {resultado.tipo === 'proximamente' && (
                <>
                  <Clock className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
                  Muy pronto llegamos a {resultado.barrio}, {resultado.municipio}. Déjanos tus datos
                  y te avisamos.
                </>
              )}
              {resultado.tipo === 'consultar' && (
                <>
                  <MessageCircleQuestion
                    className="mt-0.5 size-5 shrink-0 text-primary-700"
                    aria-hidden
                  />
                  Tenemos servicio en {resultado.municipio}. Escríbenos y confirmamos la cobertura
                  en {resultado.barrio}.
                </>
              )}
            </p>
            <WhatsAppLink
              numero={whatsapp}
              mensaje={mensajesWhatsApp.cobertura(resultado.barrio, resultado.municipio)}
              ubicacion="verificador_cobertura"
              size="md"
              className="mt-4"
            >
              {resultado.tipo === 'disponible' ? 'Quiero contratar' : 'Confirmar por WhatsApp'}
            </WhatsAppLink>
          </div>
        )}
      </div>
    </div>
  )
}
