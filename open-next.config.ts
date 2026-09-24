// Configuración de OpenNext para Cloudflare Workers.
// Caché: R2 (páginas ISR) + D1 (etiquetas para revalidateTag del webhook de Sanity) + Durable Object (cola de revalidación).
// Docs: https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue'
import d1NextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: d1NextTagCache,
  queue: doQueue,
})
