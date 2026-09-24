import { defineArrayMember, defineField, defineType } from 'sanity'
import { ejemploField } from './fields'

/** Documento único: burbuja flotante con el logo de WIPLUS que abre un panel de ofertas. */
export const ofertaFlotante = defineType({
  name: 'ofertaFlotante',
  title: 'Oferta flotante (burbuja)',
  type: 'document',
  fields: [
    defineField({
      name: 'activo',
      title: 'Mostrar en el sitio',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'insignia',
      title: 'Cinta sobre el logo',
      description: 'Muy corto, p. ej. «¡Ofertas!» o «¡Nuevo!».',
      type: 'string',
      initialValue: '¡Ofertas!',
      validation: (r) => r.required().max(12),
    }),
    defineField({
      name: 'mensaje',
      title: 'Mensaje junto al logo',
      description: 'Globo de texto que invita a abrir las ofertas. Vacío = no se muestra.',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: 'titulo',
      title: 'Título del panel',
      type: 'string',
      initialValue: 'Oferta destacada',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'items',
      title: 'Ofertas',
      type: 'array',
      validation: (r) => r.min(1).max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'ofertaItem',
          fields: [
            defineField({
              name: 'titulo',
              type: 'string',
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: 'imagen',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Texto alternativo',
                  type: 'string',
                  description: 'Describe la imagen, p. ej. «Router WiFi 6 blanco».',
                }),
              ],
            }),
            defineField({
              name: 'precio',
              title: 'Precio (COP, sin puntos)',
              description: 'Vacío = se muestra «Consulta el precio».',
              type: 'number',
              validation: (r) => r.min(0),
            }),
            defineField({
              name: 'detallePrecio',
              title: 'Texto junto al precio',
              description: 'Opcional, p. ej. «/mes» o «instalación incluida».',
              type: 'string',
            }),
            defineField({
              name: 'enlace',
              title: 'Enlace (ruta o URL)',
              description: 'Ej.: /planes-hogar. Vacío = abre WhatsApp preguntando por esta oferta.',
              type: 'string',
            }),
          ],
          preview: { select: { title: 'titulo', subtitle: 'precio', media: 'imagen' } },
        }),
      ],
    }),
    defineField({
      name: 'pie',
      title: 'Texto al pie del panel',
      type: 'string',
      validation: (r) => r.max(80),
    }),
    defineField({ name: 'desde', title: 'Mostrar desde', type: 'datetime' }),
    defineField({ name: 'hasta', title: 'Mostrar hasta', type: 'datetime' }),
    ejemploField,
  ],
  preview: {
    select: { title: 'titulo', activo: 'activo' },
    prepare: ({ title, activo }) => ({
      title: title || 'Oferta flotante',
      subtitle: activo ? 'Visible en el sitio' : 'Oculta',
    }),
  },
})
