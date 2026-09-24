import type { Faq } from '@/lib/types'

/**
 * Preguntas frecuentes. Redactadas sin comprometer datos no confirmados (tiempos, costos, permanencia).
 * TODO(WIPLUS): revisar respuestas y completar tiempos de instalación, costos y condiciones reales.
 */
export const faqs: Faq[] = [
  {
    id: 'instalacion',
    pregunta: '¿Cómo es el proceso de instalación?',
    respuesta:
      'Escríbenos por WhatsApp o llena el formulario con tu dirección. Verificamos la cobertura, te confirmamos el plan y agendamos la visita de nuestros técnicos, que llevan la fibra óptica hasta tu casa y dejan el servicio funcionando.',
    categorias: ['general', 'planes'],
  },
  {
    id: 'permanencia',
    pregunta: '¿Hay cláusula de permanencia?',
    respuesta:
      'Las condiciones de permanencia, si aplican, dependen del plan o la promoción y siempre se informan por escrito antes de firmar el contrato, como lo exige la Comisión de Regulación de Comunicaciones (CRC). Pregúntanos por las condiciones vigentes.',
    categorias: ['general', 'planes'],
  },
  {
    id: 'pagos',
    pregunta: '¿Cuáles son las formas de pago?',
    respuesta:
      'Puedes consultar los medios de pago disponibles y las fechas de corte en la página de Pagos. Si tienes dudas con tu factura, escríbenos por WhatsApp.',
    categorias: ['general', 'pagos'],
  },
  {
    id: 'fallas',
    pregunta: '¿Qué hago si mi internet falla?',
    respuesta:
      'Primero reinicia el equipo (ONT/router): desconéctalo 30 segundos y vuelve a conectarlo. Revisa que los cables estén bien conectados y que la luz PON esté encendida. Si la falla continúa, repórtala en la página de Soporte o por WhatsApp y te damos un número de ticket.',
    categorias: ['general', 'soporte'],
  },
  {
    id: 'cambio-plan',
    pregunta: '¿Puedo cambiar de plan?',
    respuesta:
      'Sí. Escríbenos por WhatsApp con tu número de contrato y el plan que quieres; te contamos las condiciones y desde cuándo se aplica el cambio.',
    categorias: ['general', 'planes'],
  },
  {
    id: 'cobertura',
    pregunta: '¿Tienen cobertura en mi barrio?',
    respuesta:
      'Tenemos servicio en Sabanalarga y Luruaco (Atlántico) y seguimos ampliando la red. Busca tu barrio en la página de Cobertura o envíanos tu dirección por WhatsApp y te confirmamos.',
    categorias: ['general', 'cobertura'],
  },
  {
    id: 'velocidad',
    pregunta: '¿Qué velocidad necesito?',
    respuesta:
      'Depende de cuántas personas y dispositivos se conectan a la vez. Para navegar y redes sociales, 30 o 40 Mb suelen ser suficientes; para familias con TV inteligente, estudio y teletrabajo, recomendamos 80 o 100 Mb.',
    categorias: ['planes'],
  },
  {
    id: 'wifi',
    pregunta: '¿La velocidad es la misma por Wi-Fi y por cable?',
    respuesta:
      'Por cable obtienes la velocidad más estable. Por Wi-Fi la velocidad puede variar según la distancia al router, las paredes y la cantidad de equipos conectados. Si necesitas mejor cobertura Wi-Fi en casa, cuéntanos y te asesoramos.',
    categorias: ['planes', 'soporte'],
  },
  {
    id: 'pqr',
    pregunta: '¿Cómo presento una petición, queja o reclamo (PQR)?',
    respuesta:
      'Puedes radicarla por correo, por teléfono, por WhatsApp o en nuestra oficina de la Calle 13 #17-04 en Sabanalarga. Consulta el paso a paso y tus derechos en la página de Protección al usuario.',
    categorias: ['soporte'],
  },
  {
    id: 'empresas-ip',
    pregunta: '¿Ofrecen IP fija y canal dedicado para empresas?',
    respuesta:
      'Sí, tenemos soluciones para empresas. Solicita una cotización con la velocidad que necesitas y un asesor te contacta.',
    categorias: ['empresas'],
  },
]
