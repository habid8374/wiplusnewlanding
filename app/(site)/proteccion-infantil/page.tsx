import { ExternalLink, Phone, ShieldAlert } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CallLink, WhatsAppLink } from '@/components/analytics/TrackedLinks'
import { Container } from '@/components/ui/Container'
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { getEnlacesInteres, getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { mensajesWhatsApp } from '@/lib/whatsapp'

export const metadata: Metadata = pageMetadata({
  title: 'Protección infantil en internet: Ley 679 de 2001',
  description:
    'Tolerancia cero con la explotación y el abuso sexual de menores. Cómo denunciar (Te Protejo, ICBF 141, Policía, Fiscalía), qué exige la Ley 679 de 2001 y cómo proteger a tus hijos en internet.',
  path: '/proteccion-infantil',
})

// TODO(WIPLUS): confirmar la herramienta de filtrado y bloqueo que usa la red y revisar el texto con asesoría legal.
export default async function ProteccionInfantilPage() {
  const [sitio, enlaces] = await Promise.all([getSiteSettings(), getEnlacesInteres()])
  const denuncias = enlaces.filter((e) => e.denuncia)

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Protección infantil', path: '/proteccion-infantil' }]}
        title="Tolerancia cero con la explotación sexual infantil"
        description="Si conoces material de abuso sexual de niños, niñas o adolescentes en internet, denúncialo. Es deber de todos ayudar con este problema."
      />

      <Section
        id="denunciar"
        eyebrow="Denuncia ahora"
        title="¿Dónde denunciar?"
        description="Las denuncias son confidenciales. No descargues, guardes ni compartas el material: solo reporta el enlace."
      >
        <ul className="grid gap-5 sm:grid-cols-2">
          {denuncias.map((e) => (
            <li
              key={e.id}
              className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card"
            >
              <ShieldAlert className="size-8 text-primary-600" aria-hidden />
              <h3 className="mt-3 text-lg font-bold text-primary-900">{e.nombre}</h3>
              {e.descripcion && <p className="mt-2 text-muted">{e.descripcion}</p>}
              <div className="mt-auto flex flex-wrap gap-3 pt-5">
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary-600 px-5 font-bold text-white hover:bg-primary-700"
                >
                  Ir a denunciar
                  <ExternalLink className="size-4" aria-hidden />
                  <span className="sr-only"> en {e.nombre} (abre en una nueva pestaña)</span>
                </a>
                {e.linea && (
                  <CallLink
                    numero={e.linea}
                    ubicacion={`proteccion_${e.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary-600 px-5 font-bold text-primary-700 hover:bg-primary-50"
                  >
                    <Phone className="size-4" aria-hidden />
                    Línea {e.linea}
                  </CallLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Container className="pb-12 sm:pb-16">
        <div className="mx-auto prose-wiplus max-w-3xl">
          <LegalDraftNotice />

          <h2 id="ley-679">La Ley 679 de 2001</h2>
          <p>
            La Ley 679 de 2001 y sus decretos reglamentarios (entre ellos el Decreto 1524 de 2002)
            buscan prevenir y combatir la explotación, la pornografía y el turismo sexual con
            menores de edad. Obliga a los proveedores de internet, como{' '}
            {sitio.razonSocial ?? sitio.nombre}, a:
          </p>
          <h3>1. Implementar técnicas de bloqueo</h3>
          <ul>
            <li>Disponer de filtros que bloqueen las URL con contenido pornográfico de menores.</li>
            <li>
              Verificar permanentemente el listado de URL generado por la DIJIN (Policía Nacional) y
              publicado por el Ministerio TIC, y bloquear todas las direcciones que contenga.
            </li>
            <li>
              Informar, cuando una URL esté bloqueada, que no es accesible debido a una herramienta
              de selección de contenido.
            </li>
          </ul>
          <h3>2. Incorporar sistemas de seguridad en la red</h3>
          <p>
            Contar con sistemas que eviten el acceso no autorizado a la red y prevengan la difusión
            de material de abuso sexual de menores.
          </p>
          <h3>3. Mantener información disponible para los usuarios</h3>
          <p>
            Sobre los mecanismos de prevención para evitar el acceso a pornografía, la existencia y
            el alcance de esta ley, y enlaces para denunciar ante las autoridades (arriba en esta
            página y en el pie de todo el sitio).
          </p>

          <h2 id="prohibiciones">Prohibiciones para proveedores y usuarios</h2>
          <p>Según el artículo 7 de la Ley 679 de 2001, está prohibido:</p>
          <ul>
            <li>
              Alojar imágenes, textos, documentos o archivos audiovisuales que impliquen directa o
              indirectamente actividades sexuales con menores de edad.
            </li>
            <li>
              Alojar material pornográfico, en especial imágenes o videos, cuando existan indicios
              de que las personas fotografiadas o filmadas son menores de edad.
            </li>
            <li>
              Alojar vínculos (links) a sitios que contengan o distribuyan material pornográfico
              relativo a menores de edad.
            </li>
          </ul>

          <h2 id="deberes">Deberes</h2>
          <p>Según el artículo 8, proveedores y usuarios de redes deben:</p>
          <ul>
            <li>
              Denunciar ante las autoridades cualquier acto criminal contra menores de edad del que
              tengan conocimiento, incluida la difusión de material pornográfico asociado a menores.
            </li>
            <li>
              Combatir con todos los medios técnicos a su alcance la difusión de material
              pornográfico con menores de edad.
            </li>
            <li>Abstenerse de usar las redes para divulgar material ilegal con menores de edad.</li>
            <li>
              Establecer mecanismos técnicos de bloqueo con los que los usuarios puedan protegerse a
              sí mismos o a sus hijos de material ilegal, ofensivo o indeseable relacionado con
              menores de edad.
            </li>
          </ul>
          <p>
            El incumplimiento de estos deberes y prohibiciones acarrea multas y sanciones. Estas
            condiciones también hacen parte de los{' '}
            <Link href="/terminos#ley-679">términos del servicio</Link>.
          </p>

          <h2 id="prevencion">Cómo proteger a los menores en casa</h2>
          <ul>
            <li>
              Activa el control parental de cada dispositivo: Google Family Link (Android), Tiempo
              en pantalla (iPhone y iPad) o Microsoft Family Safety (Windows y Xbox).
            </li>
            <li>
              Usa versiones para niños de las aplicaciones, como YouTube Kids, y la búsqueda segura
              (SafeSearch) de Google.
            </li>
            <li>
              Configura en tu router un DNS con filtro familiar, que bloquea contenido para adultos
              en todos los equipos de la casa. Si necesitas ayuda, nuestro equipo técnico te guía.
            </li>
            <li>
              Ubica computadores y consolas en espacios comunes y habla con tus hijos sobre los
              riesgos: no compartir fotos ni datos con desconocidos y contar a un adulto si algo los
              incomoda.
            </li>
          </ul>
          <p>
            Más consejos en{' '}
            <a href="https://www.enticconfio.gov.co" target="_blank" rel="noopener noreferrer">
              En TIC Confío+
            </a>{' '}
            del Ministerio TIC.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <WhatsAppLink
            numero={sitio.whatsapp}
            mensaje={mensajesWhatsApp.controlParental()}
            ubicacion="proteccion_infantil"
          >
            Pedir ayuda para configurar el control parental
          </WhatsAppLink>
        </div>
      </Container>
    </>
  )
}
