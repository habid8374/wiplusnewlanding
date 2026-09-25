import type { ConfigCobertura } from '@/lib/types'

/** Textos por defecto del verificador (se reemplazan desde CMS › Cobertura › Configuración). */
export const configCobertura: ConfigCobertura = {
  titulo: '¿Llegamos a tu casa? Compruébalo en segundos',
  mensajes: {
    cubierto: '¡Sí llegamos a {barrio}!',
    parcial: 'Tenemos red en parte de {barrio}.',
    proximamente: 'Muy pronto llegaremos a {barrio}.',
    sin_cobertura: 'Aún no llegamos a {barrio}, pero queremos saber que te interesa.',
    noAparece: 'Cuéntanos dónde estás y te confirmamos.',
  },
  mostrarAvisoDemo: true,
}
