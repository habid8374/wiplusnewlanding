import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Datos de contacto y empresa',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre comercial',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'eslogan', title: 'Eslogan', type: 'string' }),
    defineField({
      name: 'telefonos',
      title: 'Teléfonos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'telefono',
          fields: [
            defineField({
              name: 'numero',
              title: 'Número (ej. 301 213 3151)',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'etiqueta', title: 'Etiqueta', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (solo dígitos con 57)',
      type: 'string',
      validation: (r) => r.regex(/^57\d{10}$/, { name: 'número colombiano' }),
    }),
    defineField({ name: 'correo', title: 'Correo', type: 'string' }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'object',
      fields: [
        defineField({ name: 'calle', type: 'string' }),
        defineField({ name: 'municipio', type: 'string' }),
        defineField({ name: 'departamento', type: 'string' }),
        defineField({ name: 'pais', type: 'string' }),
      ],
    }),
    defineField({
      name: 'horario',
      title: 'Horario de atención',
      type: 'object',
      fields: [
        defineField({ name: 'texto', title: 'Texto visible', type: 'string' }),
        defineField({ name: 'dias', title: 'Días (texto visible)', type: 'string' }),
        defineField({ name: 'abre', title: 'Abre (HH:MM)', type: 'string' }),
        defineField({ name: 'cierra', title: 'Cierra (HH:MM)', type: 'string' }),
      ],
    }),
    defineField({
      name: 'redes',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({ name: 'facebook', type: 'url' }),
        defineField({ name: 'instagram', type: 'url' }),
        defineField({ name: 'tiktok', type: 'url' }),
      ],
    }),
    defineField({ name: 'experienciaAnios', title: 'Años de experiencia', type: 'number' }),
    defineField({ name: 'mision', title: 'Misión', type: 'text', rows: 3 }),
    defineField({ name: 'vision', title: 'Visión', type: 'text', rows: 3 }),
    defineField({ name: 'razonSocial', title: 'Razón social', type: 'string' }),
    defineField({ name: 'nit', title: 'NIT', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Datos de contacto y empresa' }) },
})
