/** "301 213 3151" → "tel:+573012133151"; líneas cortas ("141", "123") → "tel:141". */
export function telHref(numero: string) {
  const digits = numero.replace(/\D/g, '')
  if (digits.length <= 6) return `tel:${digits}`
  return `tel:+${digits.length === 10 ? `57${digits}` : digits}`
}

/** "301 213 3151" → "+57 301 213 3151" (formato para schema.org) */
export function telE164(numero: string) {
  const digits = numero.replace(/\D/g, '')
  return `+${digits.length === 10 ? `57${digits}` : digits}`
}

export function formatCOP(valor: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor)
}

/** Número principal para llamar: el mismo del WhatsApp (300 788 8808); si no está, el primero. */
export function telefonoPrincipal(s: {
  whatsapp: string
  telefonos: { numero: string; etiqueta?: string }[]
}) {
  const wa = s.whatsapp.replace(/\D/g, '').replace(/^57/, '')
  return s.telefonos.find((t) => t.numero.replace(/\D/g, '') === wa) ?? s.telefonos[0]
}

const soloDigitos = (n: string) => n.replace(/\D/g, '').replace(/^57(?=\d{10}$)/, '')

/** Línea de clientes empresariales y corporativos (la del WhatsApp de empresas). */
export function telefonoEmpresas(s: {
  whatsappEmpresas?: string | null
  telefonos: { numero: string; etiqueta?: string }[]
}) {
  const emp = s.whatsappEmpresas ? soloDigitos(s.whatsappEmpresas) : ''
  return emp ? s.telefonos.find((t) => soloDigitos(t.numero) === emp) : undefined
}

/** Teléfonos para clientes hogar (todos menos la línea empresarial). */
export function telefonosClientes<T extends { numero: string; etiqueta?: string }>(s: {
  whatsappEmpresas?: string | null
  telefonos: T[]
}): T[] {
  const emp = telefonoEmpresas(s)
  const lista = s.telefonos.filter((t) => t !== emp)
  return lista.length ? lista : s.telefonos
}
