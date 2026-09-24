import { defineArrayMember, defineField, defineType } from 'sanity'

export const ofertaEmpresarial = defineType({
  name: 'ofertaEmpresarial',
  title: 'Oferta empresarial',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', type: 'string' }),
    defineField({ name: 'descripcion', type: 'text', rows: 3 }),
    defineField({
      name: 'beneficios',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'beneficio',
          fields: [
            defineField({ name: 'titulo', type: 'string' }),
            defineField({ name: 'descripcion', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'velocidades',
      title: 'Velocidades del formulario de cotización',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Oferta empresarial' }) },
})
