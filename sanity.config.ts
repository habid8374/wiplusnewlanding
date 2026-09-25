/**
 * Configuración de Sanity Studio, publicado como SPA estática en /studio (ver scripts/build-studio.mjs).
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, singletonTypes } from './sanity/schemas'
import { structure } from './sanity/structure'
import { importarBarriosTool } from './sanity/tools/ImportarBarrios'

export default defineConfig({
  basePath: '/studio',
  name: 'wiplus',
  title: 'WIPLUS Comunicaciones',
  projectId: projectId || 'sin-configurar',
  dataset,
  schema: {
    types: schemaTypes,
    // Los documentos únicos no se pueden crear desde "Nuevo documento"
    templates: (templates) => [
      ...templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
      // «Nuevo barrio» desde la lista de un municipio: el municipio queda elegido.
      {
        id: 'barrio-en-municipio',
        title: 'Barrio en este municipio',
        schemaType: 'barrio',
        parameters: [{ name: 'municipioId', type: 'string' }],
        value: ({ municipioId }: { municipioId: string }) => ({
          municipio: { _type: 'reference', _ref: municipioId },
          estado: 'cubierto',
          tipo: 'barrio',
        }),
      },
    ],
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
  tools: (anteriores) => [...anteriores, importarBarriosTool],
})
