import { FileDown } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { Container } from '@/components/ui/Container'
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Protección al usuario, derechos y PQR',
  description:
    'Derechos y deberes de los usuarios de internet según la CRC, cómo radicar peticiones, quejas y recursos (PQR) ante WIPLUS y cómo acudir a la SIC.',
  path: '/usuario',
})

export default async function UsuarioPage() {
  const sitio = await getSiteSettings()
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Protección al usuario', path: '/usuario' }]}
        title="Protección al usuario"
        description="Tus derechos y deberes como usuario de servicios de comunicaciones y cómo presentar una petición, queja o recurso (PQR)."
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto prose-wiplus max-w-3xl">
          <LegalDraftNotice />
          <p>
            WIPLUS Comunicaciones presta sus servicios conforme al Régimen de Protección de los
            Derechos de los Usuarios de Servicios de Comunicaciones expedido por la Comisión de
            Regulación de Comunicaciones (CRC), contenido en la Resolución CRC 5050 de 2016 y sus
            modificaciones (incluida la Resolución CRC 5111 de 2017), y bajo la vigilancia de la
            Superintendencia de Industria y Comercio (SIC).
          </p>

          <h2 id="derechos">Tus derechos</h2>
          <ul>
            <li>Recibir el servicio de forma continua y con la calidad ofrecida y contratada.</li>
            <li>
              Recibir información clara, veraz, suficiente y oportuna sobre los planes, tarifas,
              condiciones y restricciones antes de contratar.
            </li>
            <li>Recibir una copia del contrato y consultarlo en cualquier momento.</li>
            <li>
              Elegir libremente el plan y cambiarlo, así como terminar el contrato en cualquier
              momento, sujeto a las condiciones de permanencia mínima aceptadas expresamente, si las
              hay.
            </li>
            <li>
              Presentar peticiones, quejas, reclamos y recursos (PQR) por cualquiera de los canales
              de atención, sin costo, y recibir respuesta dentro de los{' '}
              <strong>15 días hábiles</strong> siguientes.
            </li>
            <li>
              Recibir un código único numérico (CUN) por cada PQR radicada para hacerle seguimiento.
            </li>
            <li>
              Recibir compensación cuando el servicio no esté disponible por causas imputables al
              operador, en los términos de la regulación.
            </li>
            <li>Que se protejan tus datos personales y tu privacidad.</li>
            <li>
              Acudir ante la Superintendencia de Industria y Comercio si no estás de acuerdo con la
              respuesta a tu recurso.
            </li>
          </ul>

          <h2 id="deberes">Tus deberes</h2>
          <ul>
            <li>Pagar oportunamente el servicio contratado.</li>
            <li>
              Hacer un uso adecuado de los equipos y de la red, y no manipular ni conectar elementos
              que afecten el servicio.
            </li>
            <li>
              Cuidar los equipos entregados en comodato o arriendo y devolverlos al terminar el
              contrato.
            </li>
            <li>Informar cualquier cambio en tus datos de contacto.</li>
            <li>
              No usar el servicio para actividades ilícitas, incluida la explotación sexual de
              menores (Ley 679 de 2001).
            </li>
            <li>
              Permitir el acceso del personal técnico identificado para instalación, mantenimiento o
              retiro de equipos.
            </li>
          </ul>

          <h2 id="pqr">Cómo presentar una PQR</h2>
          <p>Puedes radicar tu petición, queja o reclamo por cualquiera de estos canales:</p>
          <ul>
            <li>
              <strong>Oficina:</strong> {sitio.direccion.calle}, {sitio.direccion.municipio},{' '}
              {sitio.direccion.departamento} ({sitio.horario.dias}, {sitio.horario.texto}).
            </li>
            <li>
              <strong>Teléfonos:</strong>{' '}
              {sitio.telefonos.map((t, i) => (
                <span key={t.numero}>
                  {i > 0 && ' – '}
                  <CallLink numero={t.numero} ubicacion="usuario_pqr" />
                </span>
              ))}
              .
            </li>
            <li>
              <strong>Correo:</strong> <a href={`mailto:${sitio.correo}`}>{sitio.correo}</a>.
            </li>
            <li>
              <strong>WhatsApp:</strong>{' '}
              <WhatsAppLink
                numero={sitio.whatsapp}
                mensaje="Hola WIPLUS, quiero radicar una PQR. Mi número de contrato es: "
                ubicacion="usuario_pqr"
                variant="none"
                icon={false}
              >
                escríbenos aquí
              </WhatsAppLink>
              .
            </li>
            <li>
              <strong>Formulario web:</strong> para fallas técnicas usa el{' '}
              <Link href="/soporte#reportar-falla">reporte de fallas</Link>; para otros temas, el{' '}
              <Link href="/contacto">formulario de contacto</Link>.
            </li>
          </ul>
          <ol>
            <li>
              Indica tu nombre, número de documento o contrato, y describe claramente tu solicitud.
            </li>
            <li>
              Recibirás un <strong>CUN</strong> (código único numérico) para hacer seguimiento.
            </li>
            <li>
              Te responderemos dentro de los <strong>15 días hábiles</strong> siguientes. Si no
              respondemos en ese plazo, opera el silencio administrativo positivo a tu favor.
            </li>
          </ol>

          <h2 id="recursos">Recursos</h2>
          <p>
            Si no estás de acuerdo con la respuesta, puedes presentar{' '}
            <strong>recurso de reposición</strong> y, en subsidio, <strong>de apelación</strong>{' '}
            dentro de los <strong>10 días hábiles</strong> siguientes a la notificación de la
            decisión. Si WIPLUS confirma su decisión, el expediente se envía a la Superintendencia
            de Industria y Comercio (SIC) para que resuelva la apelación.
          </p>

          <h2 id="autoridades">Autoridades</h2>
          <ul>
            <li>
              Superintendencia de Industria y Comercio (SIC):{' '}
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">
                www.sic.gov.co
              </a>
            </li>
            <li>
              Comisión de Regulación de Comunicaciones (CRC):{' '}
              <a href="https://www.crcom.gov.co" target="_blank" rel="noopener noreferrer">
                www.crcom.gov.co
              </a>
            </li>
            <li>
              Consulta indicadores y compara operadores en{' '}
              <a href="https://www.postdata.gov.co" target="_blank" rel="noopener noreferrer">
                postdata.gov.co
              </a>
              .
            </li>
          </ul>

          <h2 id="contrato">Contrato de servicio</h2>
          {/* TODO(WIPLUS): suministrar el contrato único de servicios en PDF y publicarlo en public/documentos/. */}
          <p className="flex items-center gap-2">
            <FileDown className="size-5 text-primary-600" aria-hidden />
            El modelo de contrato estará disponible para descarga muy pronto. Mientras tanto,
            solicítalo por WhatsApp o en nuestra oficina.
          </p>
          <p>
            <WhatsAppLink
              numero={sitio.whatsapp}
              mensaje={mensajesWhatsApp.general()}
              ubicacion="usuario_contrato"
              size="sm"
            >
              Solicitar copia del contrato
            </WhatsAppLink>
          </p>
        </div>
      </Container>
    </>
  )
}
