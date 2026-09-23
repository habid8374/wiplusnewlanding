'use client'

import type { ComponentProps, ReactNode } from 'react'
import { WhatsAppIcon } from '@/components/icons/brands'
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/button-styles'
import { track } from '@/lib/analytics'
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
