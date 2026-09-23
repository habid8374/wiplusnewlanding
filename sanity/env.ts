export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-01'

/** El CMS está activo solo si hay projectId. Si no, el sitio usa el respaldo local en /content. */
export const isSanityConfigured = projectId.length > 0
