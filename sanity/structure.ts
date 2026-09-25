import type { StructureResolver } from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id))

const ESTADOS_GESTION = [
  ['nueva', 'Nuevas'],
  ['contactada', 'Contactadas'],
  ['instalada', 'Instaladas'],
  ['descartada', 'Descartadas'],
] as const

/** Grupo «Cobertura»: municipios, barrios, solicitudes y configuración. */
const cobertura = (S: Parameters<StructureResolver>[0]) =>
  S.listItem()
    .title('Cobertura')
    .id('cobertura')
    .child(
      S.list()
        .title('Cobertura')
        .items([
          S.documentTypeListItem('municipio').title('Municipios'),
          S.listItem()
            .title('Barrios por municipio')
            .id('barrios-por-municipio')
            .child(
              S.documentTypeList('municipio')
                .title('Elige el municipio')
                .child((municipioId) =>
                  S.documentList()
                    .title('Barrios')
                    .schemaType('barrio')
                    .filter('_type == "barrio" && municipio._ref == $municipioId')
                    .params({ municipioId })
                    .defaultOrdering([{ field: 'nombre', direction: 'asc' }])
                    .initialValueTemplates([
                      S.initialValueTemplateItem('barrio-en-municipio', { municipioId }),
                    ]),
                ),
            ),
          S.documentTypeListItem('barrio').title('Todos los barrios'),
          S.listItem()
            .title('Barrios con cobertura parcial')
            .id('barrios-parciales')
            .child(
              S.documentList()
                .title('Cobertura parcial')
                .schemaType('barrio')
                .filter('_type == "barrio" && estado == "parcial"'),
            ),
          S.divider(),
          S.listItem()
            .title('Solicitudes')
            .id('solicitudes')
            .child(
              S.list()
                .title('Solicitudes')
                .items([
                  S.listItem()
                    .title('Todas')
                    .id('solicitudes-todas')
                    .child(
                      S.documentList()
                        .title('Todas las solicitudes')
                        .schemaType('solicitudCobertura')
                        .filter('_type == "solicitudCobertura"')
                        .defaultOrdering([{ field: 'creadoEn', direction: 'desc' }]),
                    ),
                  ...ESTADOS_GESTION.map(([valor, titulo]) =>
                    S.listItem()
                      .title(titulo)
                      .id(`solicitudes-${valor}`)
                      .child(
                        S.documentList()
                          .title(`Solicitudes: ${titulo.toLowerCase()}`)
                          .schemaType('solicitudCobertura')
                          .filter(
                            '_type == "solicitudCobertura" && coalesce(estadoGestion, "nueva") == $e',
                          )
                          .params({ e: valor })
                          .defaultOrdering([{ field: 'creadoEn', direction: 'desc' }]),
                      ),
                  ),
                ]),
            ),
          S.divider(),
          singleton(S, 'configCobertura', 'Configuración de cobertura'),
        ]),
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido WIPLUS')
    .items([
      singleton(S, 'siteSettings', 'Datos de contacto y empresa'),
      S.divider(),
      S.documentTypeListItem('plan').title('Planes hogar'),
      S.documentTypeListItem('aviso').title('Avisos y promociones'),
      singleton(S, 'ofertaFlotante', 'Oferta flotante (burbuja)'),
      singleton(S, 'ofertaEmpresarial', 'Oferta empresarial'),
      cobertura(S),
      S.divider(),
      S.documentTypeListItem('faq').title('Preguntas frecuentes'),
      S.documentTypeListItem('testimonio').title('Testimonios'),
      S.documentTypeListItem('clienteEmpresarial').title('Clientes empresariales'),
      singleton(S, 'infoPagos', 'Pagos'),
    ])
