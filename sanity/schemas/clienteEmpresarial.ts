import { defineField, defineType } from 'sanity'
import { ejemploField, ordenField } from './fields'

export const clienteEmpresarial = defineType({
  name: 'clienteEmpresarial',
  title: 'Cliente empresarial',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sector', type: 'string' }),
    defineField({
      name: 'logo',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Ej.: “Logo de Ferretería El Progreso, cliente de WIPLUS”.',
          validation: (r) => r.required(),
        }),
      ],
    }),
    ordenField,
    ejemploField,
  ],
  preview: { select: { title: 'nombre', subtitle: 'sector', media: 'logo' } },
})
