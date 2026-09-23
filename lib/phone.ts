/** "301 213 3151" → "tel:+573012133151" */
export function telHref(numero: string) {
  const digits = numero.replace(/\D/g, '')
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
