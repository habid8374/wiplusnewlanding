// Prepara las fotos de las tarjetas para compartir (assets/og/fotos/*.png):
// recorte 420×630, degradado a azul de marca hacia la izquierda y paleta reducida para que cada
// tarjeta pese menos de ~300 KB (límite práctico de WhatsApp). Uso: node scripts/og-fotos.mjs
import sharp from 'sharp'

const W = 420
const H = 630
const FOTOS = [
  ['public/equipo/equipo-tecnico-wiplus.jpg', 'equipo', 48, 'centre'],
  ['public/hero/fibra-puntas-luz.jpg', 'fibra-puntas', 32, 'attention'],
  ['public/hero/fibra-rack-conectores.jpg', 'fibra-rack', 40, 'attention'],
  ['public/hero/fibra-luz-azul.jpg', 'fibra-luz', 32, 'attention'],
]
const degradado = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#08163c" stop-opacity="1"/>
    <stop offset="0.35" stop-color="#08163c" stop-opacity="0.55"/>
    <stop offset="0.7" stop-color="#08163c" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`)

for (const [src, nombre, colores, posicion] of FOTOS) {
  const base = await sharp(src)
    .resize({ width: W, height: H, fit: 'cover', position: posicion })
    .blur(0.6)
    .toBuffer()
  const info = await sharp(base)
    .composite([{ input: degradado }])
    .png({ palette: true, colors: colores, dither: 0, compressionLevel: 9 })
    .toFile(`assets/og/fotos/${nombre}.png`)
  console.log(`${nombre}.png ${Math.round(info.size / 1024)} KB`)
}
