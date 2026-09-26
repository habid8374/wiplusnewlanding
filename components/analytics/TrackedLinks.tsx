'use client'

import { ArrowUpRight, ReceiptText } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { WhatsAppIcon } from '@/components/icons/brands'
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/button-styles'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { telHref } from '@/lib/phone'
import { whatsappUrl } from '@/lib/whatsapp'

type BaseProps = Omit<ComponentProps<'a'>, 'href'> & {
  ubicacion: string
  children?: ReactNode
  variant?: ButtonVariant | 'none'
  size?: ButtonSize
}

/** Enlace a WhatsApp con mensaje prellenado y evento click_whatsapp. */
export function WhatsAppLink({
  numero,
  mensaje,
  ubicacion,
  plan,
  children,
  variant = 'whatsapp',
  size,
  className,
  icon = true,
  onClick,
  ...props
}: BaseProps & { numero: string; mensaje: string; plan?: string; icon?: boolean }) {
  return (
    <a
      href={whatsappUrl(numero, mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      data-evento="click_whatsapp"
      className={variant === 'none' ? className : buttonClasses(variant, size, className)}
      onClick={(e) => {
        track('click_whatsapp', { ubicacion, ...(plan ? { plan } : {}) })
        onClick?.(e)
      }}
      {...props}
    >
      {icon && <WhatsAppIcon className="size-5 shrink-0" />}
      {children ?? 'Escríbenos por WhatsApp'}
      <span className="sr-only"> (abre WhatsApp en una nueva pestaña)</span>
    </a>
  )
}

/** Enlace tel: con evento click_llamada. */
export function CallLink({
  numero,
  ubicacion,
  children,
  variant = 'none',
  size,
  className,
  onClick,
  ...props
}: BaseProps & { numero: string }) {
  return (
    <a
      href={telHref(numero)}
      className={variant === 'none' ? className : buttonClasses(variant, size, className)}
      onClick={(e) => {
        track('click_llamada', { ubicacion, numero })
        onClick?.(e)
      }}
      {...props}
    >
      {children ?? numero}
    </a>
  )
}

/**
 * Botón al portal de clientes (WispHub: factura y pagos), con evento click_portal_clientes.
 * `destacado` = botón con degradado; `none` = solo las clases que se pasen.
 */
export function PortalClientesLink({
  href,
  ubicacion,
  children,
  variant = 'destacado',
  className,
  onClick,
  ...props
}: Omit<BaseProps, 'variant' | 'size'> & { href: string; variant?: 'destacado' | 'none' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-evento="click_portal_clientes"
      data-testid={`portal-clientes-${ubicacion}`}
      className={cn(
        variant === 'destacado' &&
          'group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-700 px-6 font-bold text-white shadow-lg ring-1 shadow-primary-900/20 ring-white/20 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
      onClick={(e) => {
        track('click_portal_clientes', { ubicacion })
        onClick?.(e)
      }}
      {...props}
    >
      {children ?? (
        <>
          <ReceiptText className="size-5 shrink-0" aria-hidden />
          Mi factura y pagos
          <ArrowUpRight
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </>
      )}
      <span className="sr-only"> (portal de clientes, abre en una nueva pestaña)</span>
    </a>
  )
}
