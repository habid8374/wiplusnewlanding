import type { StructureResolver } from 'sanity/structure'

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido WIPLUS')
    .items([
      singleton(S, 'siteSettings', 'Datos de contacto y empresa'),
      S.divider(),
      S.documentTypeListItem('plan').title('Planes hogar'),
      S.documentTypeListItem('aviso').title('Avisos y promociones'),
      singleton(S, 'ofertaEmpresarial', 'Oferta empresarial'),
      S.documentTypeListItem('municipio').title('Cobertura'),
      S.divider(),
      S.documentTypeListItem('faq').title('Preguntas frecuentes'),
      S.documentTypeListItem('testimonio').title('Testimonios'),
      S.documentTypeListItem('clienteEmpresarial').title('Clientes empresariales'),
      singleton(S, 'infoPagos', 'Pagos'),
    ])
