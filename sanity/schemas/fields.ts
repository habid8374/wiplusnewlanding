import { defineField } from 'sanity'

export const ejemploField = defineField({
  name: 'ejemplo',
  title: 'Contenido de ejemplo',
  description:
    'Márcalo si este elemento aún es de relleno. Se muestra con la etiqueta [EJEMPLO] en pruebas y se oculta en producción.',
  type: 'boolean',
  initialValue: false,
})

export const ordenField = defineField({
  name: 'orden',
  title: 'Orden',
  description: 'Número menor aparece primero.',
  type: 'number',
  initialValue: 10,
})
