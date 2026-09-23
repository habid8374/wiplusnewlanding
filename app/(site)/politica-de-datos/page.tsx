import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice'
import { PageHero } from '@/components/ui/PageHero'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Política de tratamiento de datos personales',
  description:
    'Política de tratamiento de datos personales de WIPLUS Comunicaciones conforme a la Ley 1581 de 2012: finalidades, derechos de los titulares y canales de atención.',
  path: '/politica-de-datos',
})

// TODO(WIPLUS): revisión legal de esta plantilla; completar razón social, NIT y fecha de vigencia.
export default async function PoliticaDatosPage() {
  const s = await getSiteSettings()
  const responsable = s.razonSocial ?? s.nombre
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Política de datos', path: '/politica-de-datos' }]}
        title="Política de tratamiento de datos personales"
        description="Cómo recolectamos, usamos y protegemos tu información, conforme a la Ley 1581 de 2012."
      />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto prose-wiplus max-w-3xl">
          <LegalDraftNotice />

          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Razón social:</strong> {responsable}
              {s.nit ? ` — NIT ${s.nit}` : ''}
            </li>
            <li>
              <strong>Dirección:</strong> {s.direccion.calle}, {s.direccion.municipio},{' '}
              {s.direccion.departamento}, Colombia
            </li>
            <li>
              <strong>Correo:</strong> <a href={`mailto:${s.correo}`}>{s.correo}</a>
            </li>
            <li>
              <strong>Teléfonos:</strong> {s.telefonos.map((t) => t.numero).join(' – ')}
            </li>
          </ul>

          <h2>2. Marco legal</h2>
          <p>
            Esta política se expide en cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto
            1377 de 2013 (compilado en el Decreto Único 1074 de 2015) y demás normas que las
            modifiquen o complementen.
          </p>

          <h2>3. Datos que recolectamos</h2>
          <p>
            Nombre, número de identificación, número de contrato, teléfono, correo electrónico,
            dirección de instalación, municipio y barrio, información de facturación y pagos, e
            información técnica del servicio. En el sitio web también recolectamos datos de
            navegación mediante cookies de analítica, solo si las aceptas.
          </p>

          <h2>4. Finalidades del tratamiento</h2>
          <ul>
            <li>Atender solicitudes de servicio, cotizaciones y verificaciones de cobertura.</li>
            <li>Celebrar, ejecutar y administrar el contrato de prestación de servicios.</li>
            <li>
              Instalar, mantener y dar soporte técnico al servicio, y gestionar reportes de fallas.
            </li>
            <li>Facturar, recaudar y gestionar la cartera.</li>
            <li>Atender peticiones, quejas, reclamos y recursos (PQR).</li>
            <li>
              Enviar información comercial sobre nuestros servicios y promociones, cuando lo
              autorices.
            </li>
            <li>Realizar encuestas de satisfacción y mejorar nuestros servicios y el sitio web.</li>
            <li>Cumplir obligaciones legales y requerimientos de autoridades competentes.</li>
          </ul>

          <h2>5. Derechos de los titulares</h2>
          <p>Como titular de los datos tienes derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar tus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y Comercio por infracciones a
              la ley.
            </li>
            <li>
              Revocar la autorización y solicitar la supresión de tus datos cuando no exista un
              deber legal o contractual de conservarlos.
            </li>
            <li>Acceder gratuitamente a tus datos personales.</li>
          </ul>

          <h2>6. Procedimiento para consultas y reclamos</h2>
          <p>
            Envía tu solicitud a <a href={`mailto:${s.correo}`}>{s.correo}</a> o radícala en nuestra
            oficina, indicando tu nombre, identificación, descripción de la solicitud, dirección de
            notificación y documentos de soporte.
          </p>
          <ul>
            <li>
              <strong>Consultas:</strong> se responden en máximo 10 días hábiles, prorrogables por 5
              días hábiles más, informando el motivo.
            </li>
            <li>
              <strong>Reclamos:</strong> se responden en máximo 15 días hábiles, prorrogables por 8
              días hábiles más, informando el motivo.
            </li>
          </ul>

          <h2>7. Seguridad de la información</h2>
          <p>
            Adoptamos medidas técnicas, humanas y administrativas razonables para proteger tus datos
            contra pérdida, consulta, uso o acceso no autorizado. Los formularios del sitio se
            transmiten de forma cifrada (HTTPS).
          </p>

          <h2>8. Transferencia y transmisión</h2>
          <p>
            Podemos transmitir datos a proveedores que nos prestan servicios (por ejemplo, correo
            electrónico, alojamiento web y analítica), quienes deben tratarlos de acuerdo con esta
            política y únicamente para las finalidades autorizadas.
          </p>

          <h2>9. Cookies</h2>
          <p>
            Usamos cookies de analítica (Google Analytics) solo si las aceptas en el aviso de
            cookies. Puedes cambiar tu decisión borrando los datos del sitio en tu navegador.
          </p>

          <h2>10. Vigencia</h2>
          {/* TODO(WIPLUS): fecha de entrada en vigencia. */}
          <p>
            Esta política rige a partir de su publicación y las bases de datos se conservarán
            mientras sea necesario para cumplir las finalidades descritas y las obligaciones
            legales.
          </p>
        </div>
      </Container>
    </>
  )
}
