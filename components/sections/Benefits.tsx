import { Award, Cable, Headset, Zap } from 'lucide-react'
import { Section } from '@/components/ui/Section'

export function Benefits({ anios }: { anios: number }) {
  const items = [
    {
      icon: Cable,
      titulo: 'Fibra hasta tu hogar',
      texto:
        'La fibra óptica llega directamente a tu casa: conexión estable incluso en horas pico.',
    },
    {
      icon: Headset,
      titulo: 'Soporte local en Sabanalarga',
      texto:
        'Técnicos de la región que conocen tu barrio y te atienden por WhatsApp, teléfono o en la oficina.',
    },
    {
      icon: Zap,
      titulo: 'Instalación rápida',
      texto: 'Verificamos tu dirección, agendamos la visita y te dejamos conectado sin vueltas.',
    },
    {
      icon: Award,
      titulo: `Más de ${anios} años de experiencia`,
      texto: 'Una empresa de la región que lleva años conectando hogares y empresas del Atlántico.',
    },
  ]
  return (
    <Section
      id="por-que-wiplus"
      eyebrow="¿Por qué WIPLUS?"
      title="Internet de la región, para la región"
      tone="surface"
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, titulo, texto }) => (
          <li key={titulo} className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon className="size-6" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-primary-900">{titulo}</h3>
            <p className="mt-2 text-muted">{texto}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
