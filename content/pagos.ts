import type { InfoPagos } from '@/lib/types'

/** TODO(WIPLUS): medios de pago reales y fechas de corte. Todo lo marcado como ejemplo se oculta en producción. */
export const pagos: InfoPagos = {
  medios: [
    {
      id: 'oficina',
      nombre: 'En nuestra oficina',
      descripcion: 'Calle 13 #17-04, Sabanalarga, en horario de atención.',
      ejemplo: true,
    },
    {
      id: 'transferencia',
      nombre: 'Transferencia o billetera digital',
      descripcion: 'Solicita los datos de pago por WhatsApp y envía el comprobante.',
      ejemplo: true,
    },
  ],
  fechasCorte: 'Consulta tu fecha de corte y fecha límite de pago en tu factura o por WhatsApp.',
  fechasEjemplo: true,
  notas: [
    'Envía siempre tu comprobante de pago por WhatsApp indicando tu número de contrato.',
    'Si pagas después de la fecha límite, el servicio puede suspenderse hasta que se registre el pago.',
  ],
}
