import type { OfertaEmpresarial } from '@/lib/types'

/** Textos editables desde el CMS. TODO(WIPLUS): confirmar condiciones reales (SLA, IP fija, velocidades). */
export const ofertaEmpresarial: OfertaEmpresarial = {
  titulo: 'Internet para empresas en el Atlántico',
  descripcion:
    'Conectividad por fibra óptica para comercios, oficinas, colegios e instituciones de Sabanalarga, Luruaco, La Peña, Aguada de Pablo, Hibácharo, Leña y Palmar de Candelaria, con atención directa de nuestro equipo local.',
  beneficios: [
    {
      titulo: 'Canal dedicado',
      descripcion: 'Ancho de banda reservado para tu empresa, sin competir con otros usuarios.',
    },
    {
      titulo: 'IP fija',
      descripcion: 'Para cámaras, servidores, VPN, facturación electrónica y acceso remoto.',
    },
    {
      titulo: 'Soporte prioritario',
      descripcion: 'Atención preferencial y visitas técnicas priorizadas ante cualquier novedad.',
    },
    {
      titulo: 'Acuerdo de nivel de servicio (SLA)',
      descripcion: 'Compromisos de disponibilidad y tiempos de respuesta definidos en el contrato.',
    },
  ],
  velocidades: ['100 Mb', '200 Mb', '300 Mb', 'Más de 300 Mb', 'No estoy seguro'],
}
