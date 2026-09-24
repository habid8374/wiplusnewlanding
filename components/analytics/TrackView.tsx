'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { track } from '@/lib/analytics'

/** Dispara `ver_plan` una sola vez cuando la tarjeta es visible al menos en un 60 %. */
export function TrackPlanView({
  plan,
  ubicacion,
  children,
  className,
}: {
  plan: string
  ubicacion: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track('ver_plan', { plan, ubicacion })
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [plan, ubicacion])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
