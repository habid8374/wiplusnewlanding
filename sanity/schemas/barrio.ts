import { defineArrayMember, defineField, defineType } from 'sanity'
import { apiVersion } from '../env'

export const ESTADOS_COBERTURA = [
  { title: '🟢 Cubierto', value: 'cubierto' },
  { title: '🟡 Parcial', value: 'parcial' },
  { title: '🔵 Próximamente', value: 'proximamente' },
  { title: '⚪ Sin cobertura', value: 'sin_cobertura' },
]

export const barrio = defineType({
  name: 'barrio',
  title: 'Cobertura: barrio',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'municipio',
      type: 'reference',
      to: [{ type: 'municipio' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'nombre',
        // Único dentro del municipio (dos municipios pueden tener un «Centro»).
        isUnique: async (slug, ctx) => {
          const doc = ctx.document as { _id: string; municipio?: { _ref?: string } }
          const id = doc._id.replace(/^drafts\./, '')
          const n = await ctx
            .getClient({ apiVersion })
            .fetch<number>(
              'count(*[_type == "barrio" && slug.current == $slug && municipio._ref == $m && !(_id in [$id, "drafts." + $id])])',
              { slug, m: doc.municipio?._ref ?? '', id },
            )
          return n === 0
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tipo',
      type: 'string',
      initialValue: 'barrio',
      options: {
        list: [
          { title: 'Barrio', value: 'barrio' },
          { title: 'Urbanización', value: 'urbanizacion' },
          { title: 'Sector', value: 'sector' },
          { title: 'Vereda', value: 'vereda' },
          { title: 'Corregimiento', value: 'corregimiento' },
        ],
      },
    }),
    defineField({
      name: 'estado',
      type: 'string',
      options: { list: ESTADOS_COBERTURA, layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alias',
      title: 'Otros nombres',
      description: 'Cómo más lo conoce la gente (ayuda a que lo encuentren en el buscador).',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'notaPublica',
      title: 'Nota para el cliente',
      description: 'Se muestra en el resultado del verificador.',
      type: 'text',
      rows: 2,
      validation: (r) => r.max(300),
    }),
    defineField({
      name: 'notaInterna',
      title: 'Nota interna (solo equipo)',
      description: 'Nunca se muestra en el sitio.',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'demo',
      title: 'Dato de muestra',
      description: 'Márcalo si aún no es un barrio real. Se oculta en el sitio publicado.',
      type: 'boolean',
      initialValue: false,
    }),
    // Preparado para el futuro (sin lógica aún).
    defineField({ name: 'geometria', title: 'Geometría (GeoJSON)', type: 'text', hidden: true }),
    defineField({
      name: 'naps',
      title: 'Cajas NAP',
      type: 'array',
      hidden: true,
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nap',
          fields: [
            defineField({ name: 'codigo', type: 'string' }),
            defineField({ name: 'ubicacion', type: 'geopoint' }),
            defineField({ name: 'puertosLibres', type: 'number' }),
            defineField({ name: 'radioMetros', type: 'number' }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: 'Nombre', name: 'nombre', by: [{ field: 'nombre', direction: 'asc' }] }],
  preview: {
    select: { title: 'nombre', estado: 'estado', municipio: 'municipio.nombre', demo: 'demo' },
    prepare: ({ title, estado, municipio, demo }) => ({
      title: `${title}${demo ? ' [muestra]' : ''}`,
      subtitle: `${municipio ?? ''} · ${ESTADOS_COBERTURA.find((e) => e.value === estado)?.title ?? 'sin estado'}`,
    }),
  },
})
