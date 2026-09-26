import type { InfoPagos } from '@/lib/types'

/** TODO(WIPLUS): demás medios de pago y fechas de corte. Todo lo marcado como ejemplo se oculta en producción. */
export const pagos: InfoPagos = {
  medios: [
    {
      id: 'bancolombia',
      nombre: 'Transferencia o consignación Bancolombia',
      descripcion:
        'Transfiere o consigna el valor de tu factura y envíanos el comprobante por WhatsApp con tu número de contrato.',
      cuenta: {
        banco: 'Bancolombia',
        tipo: 'Ahorros',
        numero: '12096593587',
        titular: 'Wiplus Comunicaciones',
      },
    },
    {
      id: 'oficina',
      nombre: 'En nuestra oficina',
      descripcion: 'Calle 13 #17-04, Sabanalarga, en horario de atención.',
      ejemplo: true,
    },
  ],
  fechasCorte: 'Consulta tu fecha de corte y fecha límite de pago en tu factura o por WhatsApp.',
  fechasEjemplo: true,
  notas: [
    'Envía siempre tu comprobante de transferencia o consignación por WhatsApp indicando tu número de contrato.',
    'Si pagas después de la fecha límite, el servicio puede suspenderse hasta que se registre el pago.',
  ],
}
