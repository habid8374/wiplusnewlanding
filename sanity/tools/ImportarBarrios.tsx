/**
 * Herramienta del Studio: pegar filas copiadas de Excel / Google Sheets (o texto CSV), revisar la
 * vista previa y crear o actualizar los barrios. Usa la sesión del editor: no necesita tokens.
 */
import { UploadIcon } from '@sanity/icons/Upload'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  TextArea,
} from '@sanity/ui'
import { useMemo, useState } from 'react'
import { useClient, type Tool } from 'sanity'
import { COLUMNAS, idBarrio, leerCobertura } from '../../lib/cobertura/csv'
import { enLotes, mutacionesBarrio, mutacionesMunicipios } from '../../lib/cobertura/mutaciones'
import { apiVersion } from '../env'

const ESTADO_TONO = {
  cubierto: 'positive',
  parcial: 'caution',
  proximamente: 'primary',
  sin_cobertura: 'default',
} as const

type Resultado = { creados: number; actualizados: number; borrados: number } | null

function ImportarBarrios() {
  const client = useClient({ apiVersion })
  const [texto, setTexto] = useState('')
  const [reemplazarDemo, setReemplazarDemo] = useState(false)
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState<Resultado>(null)
  const [error, setError] = useState('')
  const { filas, errores } = useMemo(() => leerCobertura(texto), [texto])

  async function importar() {
    setImportando(true)
    setError('')
    setResultado(null)
    try {
      let borrados = 0
      if (reemplazarDemo) {
        const demos = await client.fetch<string[]>('*[_type == "barrio" && demo == true]._id')
        for (const lote of enLotes(demos)) {
          await client.mutate(lote.map((id) => ({ delete: { id } })))
        }
        borrados = demos.length
      }
      const existentes = new Set(await client.fetch<string[]>('*[_type == "barrio"]._id'))
      const mutaciones = [...mutacionesMunicipios(filas), ...filas.flatMap(mutacionesBarrio)]
      for (const lote of enLotes(mutaciones)) {
        // Las mutaciones son objetos planos de la API de Sanity (createIfNotExists, patch).
        await client.mutate(lote as Parameters<typeof client.mutate>[0])
      }
      const creados = filas.filter((f) => !existentes.has(idBarrio(f.municipio, f.barrio))).length
      setResultado({ creados, actualizados: filas.length - creados, borrados })
    } catch (e) {
      setError(`No se pudo importar: ${(e as Error).message}`)
    } finally {
      setImportando(false)
    }
  }

  return (
    <Container width={3} padding={4}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading as="h1" size={3}>
            Importar barrios
          </Heading>
          <Text muted>
            Copia las filas en Excel o Google Sheets (Ctrl + C) y pégalas abajo (Ctrl + V). Puedes
            incluir la fila de títulos. Columnas en este orden: <b>{COLUMNAS.join(', ')}</b>.
          </Text>
          <Text muted size={1}>
            Estado: cubierto, parcial, proximamente o sin_cobertura. Tipo: barrio, urbanizacion,
            sector, vereda o corregimiento. Alias separados con «|». Demo: sí o no. Si un barrio ya
            existe se actualiza (su nota interna no se toca).
          </Text>
        </Stack>

        <TextArea
          rows={10}
          value={texto}
          onChange={(e) => {
            setTexto(e.currentTarget.value)
            setResultado(null)
          }}
          placeholder={'Sabanalarga\tCentro\tbarrio\tcubierto\tEl Centro\t\tno'}
          style={{ fontFamily: 'monospace' }}
        />

        {texto.trim() && (
          <Card padding={3} radius={2} tone={errores.length ? 'caution' : 'positive'} border>
            <Text size={1}>
              {filas.length} filas listas para importar
              {errores.length ? ` · ${errores.length} con error (no se importarán)` : ''}.
            </Text>
          </Card>
        )}

        {errores.length > 0 && (
          <Card padding={3} radius={2} tone="critical" border>
            <Stack gap={2}>
              {errores.slice(0, 50).map((e) => (
                <Text key={`fila-${e.fila}`} size={1}>
                  Fila {e.fila}: {e.mensaje}
                </Text>
              ))}
            </Stack>
          </Card>
        )}

        {filas.length > 0 && (
          <Card radius={2} border style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Municipio', 'Barrio', 'Tipo', 'Estado', 'Alias', 'Nota pública', 'Demo'].map(
                    (t) => (
                      <th key={t} style={{ textAlign: 'left', padding: 8 }}>
                        {t}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filas.slice(0, 300).map((f) => (
                  <tr
                    key={idBarrio(f.municipio, f.barrio)}
                    style={{ borderTop: '1px solid #8883' }}
                  >
                    <td style={{ padding: 8 }}>{f.municipio}</td>
                    <td style={{ padding: 8 }}>{f.barrio}</td>
                    <td style={{ padding: 8 }}>{f.tipo}</td>
                    <td style={{ padding: 8 }}>
                      <Badge tone={ESTADO_TONO[f.estado]}>{f.estado}</Badge>
                    </td>
                    <td style={{ padding: 8 }}>{f.alias.join(', ')}</td>
                    <td style={{ padding: 8 }}>{f.notaPublica}</td>
                    <td style={{ padding: 8 }}>{f.demo ? 'sí' : 'no'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <Flex align="center" gap={3} as="label">
          <Checkbox
            checked={reemplazarDemo}
            onChange={(e) => setReemplazarDemo(e.currentTarget.checked)}
          />
          <Text size={1}>
            Borrar antes los barrios de muestra (úsalo al cargar la lista real del cliente)
          </Text>
        </Flex>

        <Box>
          <Button
            icon={UploadIcon}
            text={importando ? 'Importando…' : `Importar ${filas.length} barrios`}
            tone="primary"
            disabled={!filas.length || importando}
            onClick={importar}
          />
        </Box>

        {resultado && (
          <Card padding={3} radius={2} tone="positive" border>
            <Text>
              Listo: {resultado.creados} barrios creados y {resultado.actualizados} actualizados
              {resultado.borrados ? `; ${resultado.borrados} de muestra borrados` : ''}. El sitio se
              actualiza en unos segundos.
            </Text>
          </Card>
        )}
        {error && (
          <Card padding={3} radius={2} tone="critical" border>
            <Text>{error}</Text>
          </Card>
        )}
      </Stack>
    </Container>
  )
}

export const importarBarriosTool: Tool = {
  name: 'importar-barrios',
  title: 'Importar barrios',
  icon: UploadIcon,
  component: ImportarBarrios,
}
