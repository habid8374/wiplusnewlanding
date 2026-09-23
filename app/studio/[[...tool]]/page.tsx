import { isSanityConfigured } from '@/sanity/env'
import { Studio } from './Studio'

export { metadata, viewport } from 'next-sanity/studio'
export const dynamic = 'force-static'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 font-sans">
        <h1 className="text-2xl font-bold">Sanity Studio sin configurar</h1>
        <p className="mt-4">
          Define <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> y{' '}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> y vuelve a desplegar. Mientras tanto, el sitio usa
          el contenido local de <code>/content</code>. Consulta el README.
        </p>
      </main>
    )
  }
  return <Studio />
}
