import { defineField, defineType } from 'sanity'
import { ordenField } from './fields'

export const municipio = defineType({
  name: 'municipio',
  title: 'Cobertura: municipio',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'nombre' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'departamento', type: 'string', initialValue: 'Atlántico' }),
    defineField({
      name: 'activo',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp del municipio (opcional)',
      description: 'Formato 573001234567. Vacío = se usa el WhatsApp general del sitio.',
      type: 'string',
      validation: (r) => r.regex(/^57\d{10}$/, { name: 'número colombiano' }),
    }),
    defineField({
      name: 'coberturaTotal',
      title: 'Cobertura en todo el municipio',
      description:
        'Activo: el verificador responde «¡Sí llegamos!» aunque el barrio no esté en la lista (los barrios de la lista conservan su estado). Apágalo si solo hay red en algunos barrios.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'geo', title: 'Ubicación (centro del mapa)', type: 'geopoint' }),
    ordenField,
    // Modelo anterior (barrios dentro del municipio). Se conserva oculto para no mostrar
    // «campo desconocido»; los barrios ahora son documentos «barrio».
    defineField({
      name: 'barrios',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'nombre', type: 'string' }] }],
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'nombre', subtitle: 'departamento', activo: 'activo' },
    prepare: ({ title, subtitle, activo }) => ({
      title,
      subtitle: `${subtitle ?? ''}${activo === false ? ' · oculto' : ''}`,
    }),
  },
})
