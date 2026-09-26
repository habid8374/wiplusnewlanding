'use client'

import { TextField } from '@/components/forms/fields'
import { FormShell } from '@/components/forms/FormShell'
import { track } from '@/lib/analytics'
import type { Barrio, Municipio } from '@/lib/types'

/** Formulario de solicitud del verificador (se carga aparte: trae Turnstile y la validación). */
export function FormularioSolicitud({
  motivo,
  titulo,
  municipio,
  barrio,
  barrioInicial,
  conDireccion,
  className,
}: {
  motivo: 'barrio_no_aparece' | 'avisame' | 'parcial_confirmar'
  titulo: string
  municipio: Municipio
  barrio?: Barrio
  barrioInicial?: string
  conDireccion?: boolean
  className: string
}) {
  return (
    <FormShell
      tipo="solicitudCobertura"
      titulo={titulo}
      tituloComo="h3"
      submitLabel={motivo === 'avisame' ? 'Avísame' : 'Enviar'}
      exitoTitulo="¡Listo, recibimos tus datos!"
      onEnviado={() => track('cobertura_solicitud', { tipo: motivo })}
      className={className}
    >
      <input type="hidden" name="motivo" value={motivo} />
      <input type="hidden" name="municipio" value={municipio.nombre} />
      {barrio && (
        <>
          <input type="hidden" name="barrio" value={barrio.nombre} />
          <input type="hidden" name="barrioId" value={barrio.id} />
        </>
      )}
      <TextField name="nombre" label="Nombre" required autoComplete="name" />
      <TextField
        name="celular"
        label="Celular"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      {!barrio && (
        <TextField
          name="barrio"
          label="Barrio o vereda"
          required
          defaultValue={barrioInicial}
          autoComplete="address-level3"
        />
      )}
      {conDireccion && (
        <TextField
          name="direccion"
          label="Dirección"
          autoComplete="street-address"
          className={barrio ? 'sm:col-span-2' : undefined}
        />
      )}
    </FormShell>
  )
}
