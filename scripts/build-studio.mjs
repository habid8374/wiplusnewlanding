// Compila Sanity Studio como SPA estática en public/studio (servida en /studio).
// Así el Studio (varios MB) no forma parte del Worker de Cloudflare.
// Sin NEXT_PUBLIC_SANITY_PROJECT_ID genera una página informativa.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const out = join(process.cwd(), 'public', 'studio')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

if (!projectId) {
  console.log(
    '[studio] Sin NEXT_PUBLIC_SANITY_PROJECT_ID: se publica una página informativa en /studio.',
  )
  writeFileSync(
    join(out, 'index.html'),
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sanity Studio sin configurar</title></head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6">
<h1>Sanity Studio sin configurar</h1>
<p>Define <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> y <code>NEXT_PUBLIC_SANITY_DATASET</code> y vuelve a desplegar.
Mientras tanto, el sitio usa el contenido local de <code>/content</code>. Consulta el README.</p></body></html>`,
  )
  process.exit(0)
}

const tmp = mkdtempSync(join(tmpdir(), 'wiplus-studio-'))
const env = {
  ...process.env,
  SANITY_STUDIO_PROJECT_ID: projectId,
  SANITY_STUDIO_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  SANITY_STUDIO_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-01',
  SANITY_STUDIO_BASEPATH: '/studio',
}
const r = spawnSync('npx', ['sanity', 'build', tmp, '-y'], {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
})
if (r.status !== 0) process.exit(r.status ?? 1)

// Solo se copian los archivos propios del Studio (sanity build también copia la carpeta public/).
cpSync(join(tmp, 'index.html'), join(out, 'index.html'))
if (existsSync(join(tmp, 'static')))
  cpSync(join(tmp, 'static'), join(out, 'static'), { recursive: true })
rmSync(tmp, { recursive: true, force: true })
console.log('[studio] Studio compilado en public/studio')
