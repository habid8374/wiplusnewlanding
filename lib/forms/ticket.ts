/** Genera un número de ticket tipo WP-AAAAMMDD-XXXX (fecha de Colombia, sufijo aleatorio). */
export function generarTicket(fecha = new Date(), prefijo = 'WP') {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(fecha)
    .replace(/-/g, '')
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sin 0/O/1/I para evitar confusiones
  const bytes = crypto.getRandomValues(new Uint8Array(4))
  const sufijo = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join('')
  return `${prefijo}-${ymd}-${sufijo}`
}
