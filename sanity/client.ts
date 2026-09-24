import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

/**
 * Consulta GROQ mediante la API HTTP de Sanity con fetch nativo
 * (más liviano que el SDK en el Worker y usa la caché de Next con etiquetas).
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  next: { revalidate: number; tags: string[] },
): Promise<T> {
  if (!isSanityConfigured) throw new Error('Sanity no está configurado')
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', query)
  url.searchParams.set('perspective', 'published')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v))
  const token = process.env.SANITY_API_READ_TOKEN
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next,
  })
  if (!res.ok) throw new Error(`Sanity respondió ${res.status}`)
  const json = (await res.json()) as { result: T }
  return json.result
}
