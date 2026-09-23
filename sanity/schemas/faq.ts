import { defineArrayMember, defineField, defineType } from 'sanity'
import { ejemploField, ordenField } from './fields'

export const faq = defineType({
  name: 'faq',
  title: 'Pregunta frecuente',
  type: 'document',
  fields: [
    defineField({ name: 'pregunta', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'respuesta', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'categorias',
      title: 'Dónde se muestra',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Inicio (general)', value: 'general' },
          { title: 'Planes', value: 'planes' },
          { title: 'Soporte', value: 'soporte' },
          { title: 'Pagos', value: 'pagos' },
          { title: 'Cobertura', value: 'cobertura' },
          { title: 'Empresas', value: 'empresas' },
        ],
      },
    }),
    ordenField,
    ejemploField,
  ],
  preview: { select: { title: 'pregunta' } },
})
