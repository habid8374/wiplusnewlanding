import { defineArrayMember, defineField, defineType } from 'sanity'

export const infoPagos = defineType({
  name: 'infoPagos',
  title: 'Pagos',
  type: 'document',
  fields: [
    defineField({
      name: 'medios',
      title: 'Medios de pago',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'medioPago',
          fields: [
            defineField({ name: 'nombre', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'descripcion', type: 'text', rows: 2 }),
            defineField({
              name: 'cuenta',
              title: 'Cuenta bancaria (opcional)',
              description: 'Se muestra destacada, con botón para copiar el número.',
              type: 'object',
              fields: [
                defineField({ name: 'banco', type: 'string' }),
                defineField({ name: 'tipo', title: 'Tipo (Ahorros / Corriente)', type: 'string' }),
                defineField({ name: 'numero', title: 'Número de cuenta', type: 'string' }),
                defineField({ name: 'titular', type: 'string' }),
              ],
            }),
            defineField({ name: 'ejemplo', type: 'boolean', initialValue: false }),
          ],
        }),
      ],
    }),
    defineField({ name: 'fechasCorte', title: 'Fechas de corte y pago', type: 'text', rows: 3 }),
    defineField({ name: 'notas', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
  ],
  preview: { prepare: () => ({ title: 'Pagos' }) },
})
