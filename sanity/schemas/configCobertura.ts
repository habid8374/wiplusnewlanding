import { defineField, defineType } from 'sanity'

const ayuda = 'Puedes usar {barrio} y {municipio}.'

/** Textos del verificador de cobertura (documento único). */
export const configCobertura = defineType({
  name: 'configCobertura',
  title: 'Cobertura: configuración',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título del verificador', type: 'string' }),
    defineField({
      name: 'msgCubierto',
      title: 'Mensaje: cubierto',
      description: ayuda,
      type: 'string',
    }),
    defineField({
      name: 'msgParcial',
      title: 'Mensaje: parcial',
      description: ayuda,
      type: 'string',
    }),
    defineField({
      name: 'msgProximamente',
      title: 'Mensaje: próximamente',
      description: ayuda,
      type: 'string',
    }),
    defineField({
      name: 'msgSinCobertura',
      title: 'Mensaje: sin cobertura',
      description: ayuda,
      type: 'string',
    }),
    defineField({ name: 'msgNoAparece', title: 'Mensaje: el barrio no aparece', type: 'string' }),
    defineField({
      name: 'mostrarAvisoDemo',
      title: 'Mostrar el aviso «Datos de muestra»',
      description: 'Solo aparece si el municipio tiene barrios marcados como muestra.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: { prepare: () => ({ title: 'Configuración de cobertura' }) },
})
