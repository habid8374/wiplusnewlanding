/**
 * Enlaces de WhatsApp con mensaje prellenado. Único lugar donde se construyen URLs de wa.me.
 */

export const mensajesWhatsApp = {
  general: () => 'Hola WIPLUS, quiero información sobre sus planes de internet.',
  contratar: () =>
    'Hola WIPLUS, quiero contratar internet por fibra óptica. ¿Me pueden dar información?',
  plan: (velocidadMb: number) =>
    `Hola WIPLUS, me interesa el plan de ${velocidadMb} Mb. ¿Me pueden dar información?`,
  cobertura: (barrio?: string, municipio?: string) =>
    barrio && municipio
      ? `Hola, quiero saber si tienen cobertura en el barrio ${barrio}, ${municipio}.`
      : 'Hola, quiero saber si tienen cobertura en mi barrio.',
  coberturaZona: (municipio: string) =>
    `Hola WIPLUS, quiero saber si tienen cobertura de internet en mi dirección en ${municipio}.`,
  coberturaContratar: (barrio: string, municipio: string) =>
    `Hola WIPLUS, estoy en el barrio ${barrio}, ${municipio} y quiero contratar internet.`,
  coberturaParcial: (barrio: string, municipio: string) =>
    `Hola WIPLUS, estoy en el barrio ${barrio}, ${municipio}. Quiero confirmar si llegan a mi dirección: `,
  empresas: () => 'Hola, quiero una cotización de internet para mi empresa.',
  soporte: () => 'Hola, tengo una falla con mi servicio. Mi número de contrato es: ',
  pqr: () => 'Hola WIPLUS, quiero radicar una PQR. Mi número de contrato es: ',
  controlParental: () =>
    'Hola WIPLUS, quiero ayuda para configurar el control parental o el filtro familiar en mi internet.',
  comprobante: () => 'Hola WIPLUS, envío el comprobante de mi pago. Mi número de contrato es: ',
  pagos: () =>
    'Hola WIPLUS, quiero información sobre cómo pagar mi factura. Mi número de contrato es: ',
} as const

/** Normaliza a solo dígitos con indicativo de Colombia. */
export function normalizarNumero(numero: string) {
  const digits = numero.replace(/\D/g, '')
  return digits.length === 10 ? `57${digits}` : digits
}

export function whatsappUrl(numero: string, mensaje?: string) {
  const base = `https://wa.me/${normalizarNumero(numero)}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

/** Mensaje del botón flotante según la página. */
export function mensajeParaRuta(pathname: string) {
  if (pathname.startsWith('/planes-empresas')) return mensajesWhatsApp.empresas()
  if (pathname.startsWith('/soporte')) return mensajesWhatsApp.soporte()
  if (pathname.startsWith('/cobertura')) return mensajesWhatsApp.cobertura()
  if (pathname.startsWith('/pagos')) return mensajesWhatsApp.pagos()
  if (pathname.startsWith('/usuario') || pathname.startsWith('/pqr')) return mensajesWhatsApp.pqr()
  if (pathname.startsWith('/planes-hogar')) return mensajesWhatsApp.contratar()
  return mensajesWhatsApp.general()
}
