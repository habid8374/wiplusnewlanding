/**
 * FASE 2 — Portal de clientes (NO implementado).
 * Tipos base reservados para: consulta y pago de facturas (PSE/Nequi vía Wompi o ePayco),
 * conciliación con el sistema de gestión, tickets con seguimiento y notificaciones.
 * Ver ARQUITECTURA.md › Fase 2.
 */

export type ClienteId = string & { readonly __brand: 'ClienteId' }
export type ContratoId = string & { readonly __brand: 'ContratoId' }

export type Cliente = {
  id: ClienteId
  documento: { tipo: 'CC' | 'CE' | 'NIT' | 'PP'; numero: string }
  nombre: string
  celular: string
  email?: string
  contratos: ContratoId[]
}

export type EstadoServicio = 'activo' | 'suspendido' | 'retirado' | 'en_instalacion'

export type Contrato = {
  id: ContratoId
  clienteId: ClienteId
  planId: string // referencia a Plan.id del CMS
  direccion: string
  municipio: string
  barrio: string
  estado: EstadoServicio
  fechaInicio: string // ISO 8601
  permanenciaHasta?: string | null
}

export type EstadoFactura = 'pendiente' | 'pagada' | 'vencida' | 'anulada'

export type Factura = {
  id: string
  contratoId: ContratoId
  periodo: string // "2026-09"
  valor: number // COP
  fechaEmision: string
  fechaLimite: string
  estado: EstadoFactura
  urlPdf?: string
}

export type PasarelaPago = 'wompi' | 'epayco'
export type MetodoPago = 'PSE' | 'NEQUI' | 'TARJETA' | 'BANCOLOMBIA_QR' | 'EFECTIVO'
export type EstadoPago = 'creado' | 'pendiente' | 'aprobado' | 'rechazado' | 'anulado' | 'error'

export type Pago = {
  id: string
  facturaId: string
  pasarela: PasarelaPago
  metodo: MetodoPago
  referencia: string // referencia única enviada a la pasarela
  valor: number
  estado: EstadoPago
  creadoEn: string
  actualizadoEn: string
  /** Id de la transacción en la pasarela (para conciliación). */
  transaccionExterna?: string
}

export type EstadoTicket = 'abierto' | 'en_proceso' | 'visita_programada' | 'resuelto' | 'cerrado'

export type Ticket = {
  numero: string // WP-AAAAMMDD-XXXX (mismo formato del formulario actual)
  contratoId?: ContratoId
  tipo: 'Sin servicio' | 'Internet lento' | 'Intermitente' | 'Otro'
  descripcion: string
  estado: EstadoTicket
  historial: { fecha: string; estado: EstadoTicket; nota?: string }[]
  cun?: string // Código Único Numérico (CRC) para PQR
}

export type CanalNotificacion = 'whatsapp' | 'sms' | 'email'

export type Notificacion = {
  clienteId: ClienteId
  canal: CanalNotificacion
  plantilla: 'factura_emitida' | 'pago_recibido' | 'recordatorio_pago' | 'ticket_actualizado'
  datos: Record<string, string | number>
}
