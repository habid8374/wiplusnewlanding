import { defineField, defineType } from 'sanity'
import { ejemploField, ordenField } from './fields'

export const testimonio = defineType({
  name: 'testimonio',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'contexto', title: 'Barrio / empresa / cargo', type: 'string' }),
    defineField({ name: 'texto', type: 'text', rows: 4, validation: (r) => r.required().max(400) }),
    ordenField,
    ejemploField,
  ],
  preview: { select: { title: 'nombre', subtitle: 'contexto' } },
})
