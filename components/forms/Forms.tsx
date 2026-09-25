'use client'

import { MUNICIPIOS, TIPOS_FALLA, TIPOS_PQR } from '@/lib/schemas/constants'
import { SelectField, TextAreaField, TextField } from './fields'
import { FormShell } from './FormShell'

const full = 'sm:col-span-2'

export function SolicitudForm({ planes, planInicial }: { planes: string[]; planInicial?: string }) {
  return (
    <FormShell
      tipo="solicitud"
      titulo="Solicita tu instalación"
      descripcion="Déjanos tus datos y un asesor te contacta para confirmar cobertura y agendar la visita."
      submitLabel="Solicitar servicio"
    >
      <TextField name="nombre" label="Nombre completo" required autoComplete="name" />
      <TextField
        name="celular"
        label="Celular"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="301 213 3151"
      />
      <SelectField name="municipio" label="Municipio" required options={MUNICIPIOS} />
      <TextField name="barrio" label="Barrio o vereda" required />
      <TextField
        name="direccion"
        label="Dirección"
        required
        autoComplete="street-address"
        className={full}
      />
      <SelectField
        name="plan"
        label="Plan de interés"
        required
        options={[...planes, 'Aún no sé, quiero asesoría']}
        defaultValue={planInicial ?? ''}
      />
      <TextField
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        hint="Te enviamos una copia de tu solicitud."
      />
    </FormShell>
  )
}

export function EmpresasForm({ velocidades }: { velocidades: string[] }) {
  return (
    <FormShell
      tipo="empresas"
      titulo="Solicita una cotización"
      descripcion="Cuéntanos qué necesita tu empresa y te enviamos una propuesta."
      submitLabel="Pedir cotización"
      exitoTitulo="¡Recibimos tu solicitud de cotización!"
    >
      <TextField name="empresa" label="Empresa" required autoComplete="organization" />
      <TextField name="nit" label="NIT" inputMode="numeric" />
      <TextField name="contacto" label="Nombre de contacto" required autoComplete="name" />
      <TextField
        name="celular"
        label="Celular"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      <TextField
        name="email"
        label="Correo electrónico"
        required
        type="email"
        autoComplete="email"
      />
      <SelectField name="velocidad" label="Velocidad requerida" required options={velocidades} />
      <TextAreaField
        name="mensaje"
        label="Mensaje"
        className={full}
        placeholder="Número de sedes, usuarios, servicios que necesitas (IP fija, canal dedicado…)"
      />
    </FormShell>
  )
}

export function FallaForm() {
  return (
    <FormShell
      tipo="falla"
      titulo="Reporta una falla"
      descripcion="Te damos un número de ticket para hacer seguimiento."
      submitLabel="Reportar falla"
      exitoTitulo="¡Reporte recibido!"
    >
      <TextField name="titular" label="Nombre del titular" required autoComplete="name" />
      <TextField name="contrato" label="N.º de contrato o documento" required />
      <TextField
        name="celular"
        label="Celular de contacto"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      <SelectField name="tipo" label="Tipo de falla" required options={TIPOS_FALLA} />
      <TextAreaField
        name="descripcion"
        label="Describe la falla"
        required
        className={full}
        placeholder="¿Desde cuándo? ¿Qué luces ves en el equipo? ¿Ya lo reiniciaste?"
      />
      <TextField
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        className={full}
        hint="Te enviamos el número de ticket."
      />
    </FormShell>
  )
}

export function ContactoForm() {
  return (
    <FormShell
      tipo="contacto"
      titulo="Escríbenos"
      submitLabel="Enviar mensaje"
      exitoTitulo="¡Mensaje enviado!"
    >
      <TextField name="nombre" label="Nombre completo" required autoComplete="name" />
      <TextField
        name="celular"
        label="Celular"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      <TextField name="email" label="Correo electrónico" type="email" autoComplete="email" />
      <TextField name="asunto" label="Asunto" required />
      <TextAreaField name="mensaje" label="Mensaje" required className={full} />
    </FormShell>
  )
}

export function PqrForm() {
  return (
    <FormShell
      tipo="pqr"
      titulo="Radica tu PQR"
      descripcion="Peticiones, quejas, reclamos y recursos. Te damos un número de radicado para hacer seguimiento."
      submitLabel="Radicar PQR"
      exitoTitulo="¡PQR radicada!"
      etiquetaTicket="radicado"
    >
      <SelectField
        name="tipoPqr"
        label="Tipo de PQR"
        required
        options={TIPOS_PQR}
        className={full}
      />
      <TextField name="titular" label="Nombre del titular" required autoComplete="name" />
      <TextField name="documento" label="N.º de documento" required inputMode="numeric" />
      <TextField name="contrato" label="N.º de contrato" hint="Si lo tienes a mano." />
      <TextField
        name="celular"
        label="Celular de contacto"
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
      />
      <TextField
        name="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        hint="Te enviamos el número de radicado."
      />
      <SelectField name="municipio" label="Municipio" required options={MUNICIPIOS} />
      <TextAreaField
        name="descripcion"
        label="Hechos"
        required
        className={full}
        placeholder="Cuéntanos qué pasó, desde cuándo y, si aplica, el número de factura."
      />
      <TextAreaField
        name="pretension"
        label="¿Qué solicitas?"
        className={full}
        placeholder="Ej.: ajuste en la factura, visita técnica, cambio de plan…"
      />
    </FormShell>
  )
}
