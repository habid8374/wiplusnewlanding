import { defineField, defineType } from 'sanity'

/** Solicitudes que llegan desde el verificador de cobertura del sitio. */
export const solicitudCobertura = defineType({
  name: 'solicitudCobertura',
  title: 'Cobertura: solicitud',
  type: 'document',
  // Los datos los escribe el sitio; el equipo solo cambia el estado de gestión.
  fields: [
    defineField({
      name: 'estadoGestion',
      title: 'Estado de gestión',
      type: 'string',
      initialValue: 'nueva',
      options: {
        list: [
          { title: 'Nueva', value: 'nueva' },
          { title: 'Contactada', value: 'contactada' },
          { title: 'Instalada', value: 'instalada' },
          { title: 'Descartada', value: 'descartada' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tipo',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Su barrio no aparece', value: 'barrio_no_aparece' },
          { title: 'Avísame cuando lleguen', value: 'avisame' },
          { title: 'Confirmar dirección (parcial)', value: 'parcial_confirmar' },
          { title: 'Quiere contratar', value: 'quiero_contratar' },
        ],
      },
    }),
    defineField({ name: 'nombre', type: 'string', readOnly: true }),
    defineField({ name: 'celular', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'municipio', type: 'string', readOnly: true }),
    defineField({ name: 'barrio', type: 'string', readOnly: true }),
    defineField({
      name: 'barrioRef',
      title: 'Barrio (registro)',
      type: 'reference',
      to: [{ type: 'barrio' }],
      // Débil: borrar un barrio (p. ej. los de muestra) no queda bloqueado por sus solicitudes.
      weak: true,
      readOnly: true,
    }),
    defineField({ name: 'direccion', title: 'Dirección', type: 'string', readOnly: true }),
    defineField({ name: 'aceptaPolitica', type: 'boolean', readOnly: true }),
    defineField({ name: 'creadoEn', title: 'Recibida', type: 'datetime', readOnly: true }),
  ],
  orderings: [
    { title: 'Más recientes', name: 'recientes', by: [{ field: 'creadoEn', direction: 'desc' }] },
  ],
  preview: {
    select: {
      nombre: 'nombre',
      barrio: 'barrio',
      municipio: 'municipio',
      tipo: 'tipo',
      estado: 'estadoGestion',
    },
    prepare: ({ nombre, barrio, municipio, tipo, estado }) => ({
      title: `${nombre ?? 'Sin nombre'} — ${barrio ?? ''}, ${municipio ?? ''}`,
      subtitle: `${tipo ?? ''} · ${estado ?? 'nueva'}`,
    }),
  },
})
