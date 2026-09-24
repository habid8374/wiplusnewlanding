'use client'

import { useEffect, useRef } from 'react'

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
      language?: string
      appearance?: 'always' | 'execute' | 'interaction-only'
    },
  ) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

function loadScript() {
  if (window.turnstile) return Promise.resolve()
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('No se pudo cargar Turnstile'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

/**
 * Widget de Cloudflare Turnstile. Se carga solo cuando `active` es true
 * (primera interacción con el formulario) para no penalizar el rendimiento.
 */
export function Turnstile({
  siteKey,
  active,
  onToken,
  resetKey,
}: {
  siteKey: string
  active: boolean
  onToken: (token: string) => void
  resetKey: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  useEffect(() => {
    onTokenRef.current = onToken
  })

  useEffect(() => {
    if (!active || !siteKey || !ref.current) return
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile || widgetId.current) return
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          language: 'es',
          appearance: 'interaction-only',
          callback: (t) => onTokenRef.current(t),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        })
      })
      .catch(() => onTokenRef.current(''))
    return () => {
      cancelled = true
    }
  }, [active, siteKey])

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [resetKey])

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    },
    [],
  )

  if (!siteKey) return null
  return <div ref={ref} className="min-h-0" />
}
