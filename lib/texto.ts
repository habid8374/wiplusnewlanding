/** ["A", "B", "C"] → "A, B y C" (enumeración en español). */
export function listaNatural(items: readonly string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`
}
