'use client'

/**
 * Configuración de Sanity Studio, montado en /studio.
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, singletonTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  name: 'wiplus',
  title: 'WIPLUS Comunicaciones',
  projectId: projectId || 'sin-configurar',
  dataset,
  schema: {
    types: schemaTypes,
    // Los documentos únicos no se pueden crear desde "Nuevo documento"
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
})
