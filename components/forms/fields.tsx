'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const FormErrorsContext = createContext<Record<string, string | undefined>>({})

const inputBase =
  'w-full rounded-xl border bg-white px-3 text-base text-ink placeholder:text-slate-500 transition-colors focus:border-primary-500 aria-[invalid=true]:border-red-600'

function FieldWrapper({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-primary-950">
        {label}
        {required ? (
          <span className="text-red-700" aria-hidden>
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (opcional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-ayuda`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

type Common = {
  name: string
  label: string
  required?: boolean
  hint?: string
  className?: string
}

export function TextField({
  name,
  label,
  required,
  hint,
  className,
  type = 'text',
  ...rest
}: Common & Omit<React.ComponentProps<'input'>, 'name' | 'required'>) {
  const id = useId()
  const error = useContext(FormErrorsContext)[name]
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-ayuda` : undefined}
        className={cn(inputBase, 'h-12 border-line')}
        {...rest}
      />
    </FieldWrapper>
  )
}

export function SelectField({
  name,
  label,
  required,
  hint,
  className,
  options,
  placeholder = 'Selecciona una opción',
  ...rest
}: Common & { options: readonly string[]; placeholder?: string } & Omit<
    React.ComponentProps<'select'>,
    'name' | 'required'
  >) {
  const id = useId()
  const error = useContext(FormErrorsContext)[name]
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-ayuda` : undefined}
        className={cn(inputBase, 'h-12 border-line')}
        defaultValue={rest.defaultValue ?? ''}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}

export function TextAreaField({
  name,
  label,
  required,
  hint,
  className,
  ...rest
}: Common & Omit<React.ComponentProps<'textarea'>, 'name' | 'required'>) {
  const id = useId()
  const error = useContext(FormErrorsContext)[name]
  return (
    <FieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        name={name}
        required={required}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-ayuda` : undefined}
        className={cn(inputBase, 'border-line py-3')}
        {...rest}
      />
    </FieldWrapper>
  )
}
