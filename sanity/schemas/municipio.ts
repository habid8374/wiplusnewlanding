import { defineArrayMember, defineField, defineType } from 'sanity'
import { ordenField } from './fields'

export const municipio = defineType({
  name: 'municipio',
  title: 'Cobertura: municipio',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'departamento', type: 'string', initialValue: 'Atlántico' }),
    defineField({ name: 'geo', title: 'Ubicación (centro del mapa)', type: 'geopoint' }),
    defineField({
      name: 'barrios',
      title: 'Barrios y veredas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'barrio',
          fields: [
            defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'estado',
              type: 'string',
              initialValue: 'disponible',
              options: {
                list: [
                  { title: 'Con servicio', value: 'disponible' },
                  { title: 'Próximamente', value: 'proximamente' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'ejemplo',
              title: 'Ejemplo',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: { select: { title: 'nombre', subtitle: 'estado' } },
        }),
      ],
    }),
    ordenField,
  ],
})
