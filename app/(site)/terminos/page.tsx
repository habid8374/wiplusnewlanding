import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Términos y condiciones de planes y promociones',
  description:
    'Términos y condiciones de los planes de internet y promociones de WIPLUS Comunicaciones en Sabanalarga, Luruaco y sus alrededores (Atlántico).',
  path: '/terminos',
})

// TODO(WIPLUS): revisión legal y condiciones comerciales reales (permanencia, costos de instalación, reconexión).
export default async function TerminosPage() {
  const s = await getSiteSettings()
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Términos y condiciones', path: '/terminos' }]}
        title="Términos y condiciones"
        description="Condiciones generales de nuestros planes de internet y promociones."
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto prose-wiplus max-w-3xl">
          <LegalDraftNotice />

          <h2>1. Alcance</h2>
          <p>
            Estos términos aplican a los planes de internet ofrecidos por{' '}
            {s.razonSocial ?? s.nombre} en su sitio web y canales de venta. La relación con cada
            usuario se rige por el contrato de prestación de servicios y por el régimen de
            protección de usuarios de la CRC.
          </p>

          <h2>2. Cobertura y disponibilidad</h2>
          <p>
            Los planes están sujetos a disponibilidad técnica y de cobertura en la dirección de
            instalación, que se confirma antes de firmar el contrato. La información de cobertura
            del sitio es orientativa.
          </p>

          <h2>3. Velocidades</h2>
          <p>
            Las velocidades publicadas corresponden a la velocidad máxima contratada. La velocidad
            efectiva por Wi-Fi puede variar por factores como la distancia al router, obstáculos,
            interferencias, la capacidad de los dispositivos y el número de equipos conectados.
          </p>

          <h2>4. Precios</h2>
          <p>
            Los precios publicados son mensuales, en pesos colombianos e incluyen los impuestos
            aplicables, salvo que se indique lo contrario. Pueden cambiar; el precio aplicable es el
            vigente al momento de la contratación y se informa en el contrato.
          </p>

          <h2>5. Promociones</h2>
          <p>
            Cada promoción indica su vigencia, condiciones y restricciones. Las promociones no son
            acumulables salvo indicación expresa y aplican para las zonas con cobertura.
          </p>

          <h2>6. Permanencia mínima</h2>
          <p>
            Si un plan o promoción tiene cláusula de permanencia mínima, se informará de manera
            previa, clara y por escrito, y solo aplica si el usuario la acepta expresamente,
            conforme a la regulación de la CRC.
          </p>

          <h2>7. Pagos, suspensión y reconexión</h2>
          <p>
            El servicio se factura mensualmente. El no pago oportuno puede dar lugar a la suspensión
            del servicio, previo aviso. Consulta medios de pago y fechas en la página de{' '}
            <Link href="/pagos">Pagos</Link>.
          </p>

          <h2>8. Equipos</h2>
          <p>
            Los equipos entregados para la prestación del servicio (ONT/router) se entregan en las
            condiciones indicadas en el contrato y deben devolverse en buen estado al terminarlo.
          </p>

          <h2>9. Atención y PQR</h2>
          <p>
            Consulta tus derechos y cómo presentar peticiones, quejas y recursos en{' '}
            <Link href="/usuario">Protección al usuario</Link>.
          </p>

          <h2>10. Datos personales</h2>
          <p>
            El tratamiento de datos se rige por nuestra{' '}
            <Link href="/politica-de-datos">política de tratamiento de datos personales</Link>.
          </p>

          <h2 id="ley-679">11. Protección de menores (Ley 679 de 2001)</h2>
          <p>
            Está prohibido usar el servicio para alojar, difundir o enlazar material de abuso o
            explotación sexual de menores de edad. {s.razonSocial ?? s.nombre} bloquea las
            direcciones reportadas por las autoridades, puede suspender el servicio ante estos usos
            y denunciará cualquier caso del que tenga conocimiento. Deberes, prohibiciones y canales
            de denuncia en <Link href="/proteccion-infantil">Protección infantil</Link>.
          </p>
        </div>
      </Container>
    </>
  )
}
