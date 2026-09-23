import { createClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // la caché la maneja Next (ISR + revalidación por etiquetas)
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      perspective: 'published',
    })
  : null
