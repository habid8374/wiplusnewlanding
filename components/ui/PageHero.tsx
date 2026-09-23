import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'
import { Container } from './Container'

/** Encabezado de páginas internas (con migas de pan y H1). */
export function PageHero({
  title,
  description,
  crumbs,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  crumbs: Crumb[]
  children?: ReactNode
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-accent-500/20 blur-3xl"
      />
      <Container className="relative py-10 sm:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-pretty text-primary-100">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </div>
  )
}
