import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Container } from './Container'

type Props = {
  id?: string
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  tone?: 'white' | 'surface' | 'navy'
  align?: 'left' | 'center'
  headingLevel?: 'h1' | 'h2'
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = 'white',
  align = 'center',
  headingLevel = 'h2',
}: Props) {
  const Heading = headingLevel
  const headingId = id ? `${id}-titulo` : undefined
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        'py-14 sm:py-20',
        tone === 'surface' && 'bg-surface',
        tone === 'navy' && 'bg-primary-900 text-white',
        className,
      )}
    >
      <Container>
        {(eyebrow || title || description) && (
          <div className={cn('mb-10 max-w-2xl', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && (
              <p
                className={cn(
                  'mb-2 text-sm font-bold tracking-wider uppercase',
                  tone === 'navy' ? 'text-accent-300' : 'text-primary-600',
                )}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <Heading
                id={headingId}
                className={cn(
                  'text-3xl font-extrabold tracking-tight text-balance sm:text-4xl',
                  tone === 'navy' ? 'text-white' : 'text-primary-900',
                )}
              >
                {title}
              </Heading>
            )}
            {description && (
              <p
                className={cn(
                  'mt-4 text-lg text-pretty',
                  tone === 'navy' ? 'text-primary-100' : 'text-muted',
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
