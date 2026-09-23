import { defineArrayMember, defineField, defineType } from 'sanity'
import { ejemploField, ordenField } from './fields'

export const plan = defineType({
  name: 'plan',
  title: 'Plan hogar',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'velocidadMb',
      title: 'Velocidad (Mb)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'precio',
      title: 'Precio mensual (COP)',
      description: 'Déjalo vacío para mostrar “Consulta el precio”.',
      type: 'number',
      validation: (r) => r.positive().integer(),
    }),
    defineField({ name: 'destacado', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({
      name: 'etiqueta',
      title: 'Etiqueta (ej. Más elegido, Promoción)',
      type: 'string',
    }),
    defineField({ name: 'idealPara', title: 'Ideal para', type: 'string' }),
    defineField({
      name: 'beneficios',
      title: 'Qué incluye',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    ordenField,
    ejemploField,
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: {
    select: { title: 'nombre', precio: 'precio', destacado: 'destacado' },
    prepare: ({ title, precio, destacado }) => ({
      title: `${title}${destacado ? ' ★' : ''}`,
      subtitle: precio ? `$${Number(precio).toLocaleString('es-CO')}/mes` : 'Sin precio (consulta)',
    }),
  },
})
