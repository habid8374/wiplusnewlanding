import { defineField, defineType } from 'sanity'
import { ejemploField } from './fields'

export const aviso = defineType({
  name: 'aviso',
  title: 'Aviso / promoción (banner)',
  type: 'document',
  fields: [
    defineField({ name: 'texto', type: 'string', validation: (r) => r.required().max(140) }),
    defineField({
      name: 'enlace',
      type: 'object',
      fields: [
        defineField({ name: 'texto', type: 'string' }),
        defineField({ name: 'href', title: 'URL o ruta (ej. /planes-hogar)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'tono',
      type: 'string',
      initialValue: 'promo',
      options: { list: ['info', 'promo', 'alerta'], layout: 'radio' },
    }),
    defineField({ name: 'activo', type: 'boolean', initialValue: true }),
    defineField({ name: 'desde', type: 'datetime' }),
    defineField({ name: 'hasta', type: 'datetime' }),
    ejemploField,
  ],
  preview: { select: { title: 'texto', subtitle: 'tono' } },
})
