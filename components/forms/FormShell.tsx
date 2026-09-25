'use client'

import { CircleAlert, CircleCheck, LoaderCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { buttonClasses } from '@/components/ui/button-styles'
import { track } from '@/lib/analytics'
import { TURNSTILE_SITE_KEY } from '@/lib/env'
import type { FormResponse, FormType } from '@/lib/schemas/forms'
import { FORM_ENDPOINTS } from './endpoints'
import { FormErrorsContext } from './fields'
import { Turnstile } from './Turnstile'

const cargarEsquemas = () => import('@/lib/schemas/forms')

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'enviando' }
  | { tipo: 'exito'; mensaje: string; ticket?: string }
  | { tipo: 'error'; mensaje: string }

/**
 * Envoltura común de formularios: validación Zod en el cliente, honeypot, Turnstile,
 * aceptación de política de datos, estados de carga/éxito/error y evento form_submit.
 */
export function FormShell({
  tipo,
  titulo,
  descripcion,
  submitLabel = 'Enviar',
  exitoTitulo = '¡Recibimos tu solicitud!',
  etiquetaTicket = 'ticket',
  tituloComo: Titulo = 'h2',
  onEnviado,
  children,
  className,
}: {
  tipo: FormType
  titulo?: string
  descripcion?: ReactNode
  submitLabel?: string
  exitoTitulo?: string
  /** Cómo se nombra el número que devuelve el servidor («ticket», «radicado»). */
  etiquetaTicket?: string
  /** Nivel del título (h3 si el formulario va dentro de otra sección). */
  tituloComo?: 'h2' | 'h3'
  /** Se llama tras un envío exitoso (p. ej. para analítica propia). */
  onEnviado?: () => void
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [estado, setEstado] = useState<Estado>({ tipo: 'inicial' })
  const [errores, setErrores] = useState<Record<string, string | undefined>>({})
  const [activo, setActivo] = useState(false)
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>
    data.aceptaPolitica = data.aceptaPolitica === 'on'
    data.turnstileToken = token

    // Zod se carga bajo demanda para no inflar el JavaScript inicial de la página.
    const { erroresPorCampo, formSchemas } = await cargarEsquemas()
    const parsed = formSchemas[tipo].safeParse(data)
    if (!parsed.success) {
      const fieldErrors = erroresPorCampo(parsed.error)
      setErrores(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])))
      setEstado({ tipo: 'error', mensaje: 'Revisa los campos marcados.' })
      // Lleva el foco al primer campo con error.
      const first = Object.keys(fieldErrors)[0]
      requestAnimationFrame(() => form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus())
      return
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setErrores({})
      setEstado({
        tipo: 'error',
        mensaje: 'Estamos verificando que no eres un robot. Espera un momento e intenta de nuevo.',
      })
      return
    }

    setErrores({})
    setEstado({ tipo: 'enviando' })
    try {
      const res = await fetch(FORM_ENDPOINTS[tipo], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => null)) as FormResponse | null
      if (!res.ok || !json?.ok) {
        const errs = json && !json.ok ? json.errores : undefined
        if (errs) setErrores(Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v?.[0]])))
        setEstado({
          tipo: 'error',
          mensaje:
            json?.mensaje ??
            'No pudimos enviar el formulario. Intenta de nuevo o escríbenos por WhatsApp.',
        })
        setToken('')
        setResetKey((k) => k + 1)
        return
      }
      track('form_submit', { tipo })
      onEnviado?.()
      form.reset()
      setEstado({ tipo: 'exito', mensaje: json.mensaje, ticket: json.ticket })
    } catch {
      setEstado({
        tipo: 'error',
        mensaje: 'Hubo un problema de conexión. Intenta de nuevo o escríbenos por WhatsApp.',
      })
    }
  }

  if (estado.tipo === 'exito') {
    return (
      <div
        role="status"
        data-testid={`form-${tipo}-exito`}
        className="rounded-3xl border border-green-200 bg-green-50 p-6 text-center sm:p-8"
      >
        <CircleCheck className="mx-auto size-12 text-green-700" aria-hidden />
        <p className="mt-3 text-2xl font-extrabold text-primary-950">{exitoTitulo}</p>
        {estado.ticket && (
          <p className="mt-3 text-lg">
            Tu número de {etiquetaTicket} es{' '}
            <strong data-testid="ticket" className="font-mono text-primary-800">
              {estado.ticket}
            </strong>
            . Guárdalo para hacer seguimiento.
          </p>
        )}
        <p className="mt-3 text-muted">{estado.mensaje}</p>
        <button
          type="button"
          onClick={() => setEstado({ tipo: 'inicial' })}
          className={buttonClasses('outline', 'sm', 'mt-6')}
        >
          Enviar otro
        </button>
      </div>
    )
  }

  return (
    <FormErrorsContext.Provider value={errores}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        onFocusCapture={() => {
          if (!activo) void cargarEsquemas()
          setActivo(true)
        }}
        noValidate
        aria-labelledby={titulo ? `${id}-titulo` : undefined}
        data-testid={`form-${tipo}`}
        className={className ?? 'rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8'}
      >
        {titulo && (
          <Titulo
            id={`${id}-titulo`}
            className={
              Titulo === 'h2'
                ? 'text-2xl font-extrabold text-primary-900'
                : 'text-lg font-extrabold text-primary-900'
            }
          >
            {titulo}
          </Titulo>
        )}
        {descripcion && <p className="mt-2 text-muted">{descripcion}</p>}
        <p className="mt-2 text-xs text-muted">
          Los campos marcados con <span className="text-red-700">*</span> son obligatorios.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>

        {/* Honeypot: invisible para personas */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-sitio`}>No llenes este campo</label>
          <input id={`${id}-sitio`} name="sitioWeb" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="mt-5">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="aceptaPolitica"
              required
              aria-invalid={errores.aceptaPolitica ? true : undefined}
              aria-describedby={errores.aceptaPolitica ? `${id}-politica-error` : undefined}
              className="mt-0.5 size-5 shrink-0 accent-primary-600"
            />
            <span>
              Acepto la{' '}
              <Link
                href="/politica-de-datos"
                target="_blank"
                rel="noopener"
                className="font-semibold text-primary-700 underline"
              >
                política de tratamiento de datos personales
              </Link>{' '}
              de WIPLUS Comunicaciones (Ley 1581 de 2012). <span className="text-red-700">*</span>
            </span>
          </label>
          {errores.aceptaPolitica && (
            <p id={`${id}-politica-error`} className="mt-1 text-sm font-semibold text-red-700">
              {errores.aceptaPolitica}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            active={activo}
            onToken={setToken}
            resetKey={resetKey}
          />
        </div>

        <div aria-live="assertive" className="empty:hidden">
          {estado.tipo === 'error' && (
            <p
              data-testid={`form-${tipo}-error`}
              className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800 ring-1 ring-red-200"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {estado.mensaje}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={estado.tipo === 'enviando'}
          className={buttonClasses('primary', 'lg', 'mt-6 w-full sm:w-auto')}
        >
          {estado.tipo === 'enviando' ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            <>
              <Send className="size-5" aria-hidden />
              {submitLabel}
            </>
          )}
        </button>
      </form>
    </FormErrorsContext.Provider>
  )
}
