import { cn } from '@/lib/cn'

/*
 * Dos árboles de Navidad clásicos (verde, rojo y dorado) asomados a medias en las esquinas
 * inferiores del pie de página. Solo se ven en temporada (<html data-navidad>); decorativos.
 * Las luces titilan con motion-safe (quietas con prefers-reduced-motion).
 */

const CX = 120

/** Un piso del árbol: triángulo con el borde inferior en ondas. */
function piso(arriba: number, base: number, mitad: number, ondas: number) {
  const ancho = (2 * mitad) / ondas
  let d = `M${CX} ${arriba} L${CX + mitad} ${base}`
  for (let i = 0; i < ondas; i++) {
    const x = CX + mitad - i * ancho
    d += ` Q${x - ancho / 2} ${base + 9} ${x - ancho} ${base}`
  }
  return `${d} Z`
}

/** Punto sobre una curva cuadrática (para repartir luces sobre la guirnalda). */
function enCurva(p0: number[], c: number[], p1: number[], t: number) {
  const u = 1 - t
  return [
    u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0],
    u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1],
  ]
}

const PISOS = [
  { arriba: 112, base: 278, mitad: 112, ondas: 7 },
  { arriba: 72, base: 214, mitad: 92, ondas: 6 },
  { arriba: 36, base: 152, mitad: 70, ondas: 5 },
  { arriba: 14, base: 92, mitad: 46, ondas: 4 },
]

/** Guirnaldas doradas: [inicio, control, fin] de cada curva. */
const GUIRNALDAS: number[][][] = [
  [
    [44, 236],
    [120, 266],
    [214, 222],
  ],
  [
    [46, 176],
    [128, 206],
    [196, 162],
  ],
  [
    [66, 118],
    [118, 142],
    [176, 106],
  ],
  [
    [88, 70],
    [124, 86],
    [154, 58],
  ],
]

const COLORES_LUZ = ['#ff3b3b', '#ffd23f', '#ffffff', '#3ddc84', '#4aa3ff']

const BOLAS: [number, number, number, 'roja' | 'dorada'][] = [
  [70, 256, 8, 'roja'],
  [168, 260, 8, 'dorada'],
  [120, 244, 7, 'dorada'],
  [200, 246, 7, 'roja'],
  [92, 196, 7, 'dorada'],
  [150, 192, 7, 'roja'],
  [62, 204, 6, 'roja'],
  [108, 132, 6, 'roja'],
  [146, 138, 6, 'dorada'],
  [84, 140, 5, 'dorada'],
  [128, 80, 5, 'roja'],
  [104, 72, 4.5, 'dorada'],
]

function Arbol({ id, className }: { id: string; className?: string }) {
  const luces = GUIRNALDAS.flatMap(([p0, c, p1], g) =>
    Array.from({ length: 7 - g }, (_, i) => enCurva(p0, c, p1, (i + 0.5) / (7 - g))),
  )
  return (
    <svg viewBox="0 0 240 320" aria-hidden focusable="false" className={className}>
      <defs>
        <linearGradient id={`${id}-hoja`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#1f9d4c" />
          <stop offset="0.55" stopColor="#0f7a37" />
          <stop offset="1" stopColor="#0a5426" />
        </linearGradient>
        <radialGradient id={`${id}-roja`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="0.45" stopColor="#d4142e" />
          <stop offset="1" stopColor="#7a0a18" />
        </radialGradient>
        <radialGradient id={`${id}-dorada`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff3c2" />
          <stop offset="0.45" stopColor="#e3b23c" />
          <stop offset="1" stopColor="#8a6212" />
        </radialGradient>
        <filter id={`${id}-brillo`} x="-1" y="-1" width="3" height="3">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* tronco y regalos */}
      <rect x="106" y="270" width="28" height="34" rx="3" fill="#5b3a1e" />
      <g>
        <rect x="58" y="284" width="40" height="30" rx="3" fill="#c8102e" />
        <rect x="74" y="284" width="8" height="30" fill="#f2c94c" />
        <rect x="58" y="294" width="40" height="7" fill="#f2c94c" />
        <path d="M78 284 q-12 -12 -16 -2 q6 4 16 2 q12 -12 16 -2 q-6 4 -16 2" fill="#f2c94c" />
        <rect x="144" y="290" width="34" height="24" rx="3" fill="#0f7a37" />
        <rect x="157" y="290" width="7" height="24" fill="#c8102e" />
        <rect x="144" y="298" width="34" height="6" fill="#c8102e" />
        <rect x="182" y="296" width="24" height="18" rx="2" fill="#f5f5f5" />
        <rect x="191" y="296" width="6" height="18" fill="#c8102e" />
      </g>

      {/* pisos del árbol */}
      {PISOS.map((p, i) => (
        <path key={i} d={piso(p.arriba, p.base, p.mitad, p.ondas)} fill={`url(#${id}-hoja)`} />
      ))}
      {/* sombra suave bajo cada piso */}
      {PISOS.slice(1).map((p, i) => (
        <path
          key={i}
          d={`M${CX - p.mitad + 6} ${p.base + 2} Q${CX} ${p.base + 16} ${CX + p.mitad - 6} ${p.base + 2}`}
          stroke="#063d1b"
          strokeOpacity="0.35"
          strokeWidth="4"
          fill="none"
        />
      ))}

      {/* guirnaldas doradas */}
      {GUIRNALDAS.map(([p0, c, p1], i) => (
        <path
          key={i}
          d={`M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`}
          stroke="#f2c94c"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      ))}

      {/* bolas rojas y doradas */}
      {BOLAS.map(([x, y, r, tipo], i) => (
        <g key={i}>
          <rect x={x - r * 0.35} y={y - r - 3} width={r * 0.7} height="4" rx="1" fill="#c9c9c9" />
          <circle cx={x} cy={y} r={r} fill={`url(#${id}-${tipo})`} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.22} fill="#fff" opacity="0.8" />
        </g>
      ))}

      {/* luces de colores (titilan) */}
      {luces.map(([x, y], i) => {
        const color = COLORES_LUZ[i % COLORES_LUZ.length]
        const retraso = `${((i * 0.37) % 1.8).toFixed(2)}s`
        return (
          <g
            key={i}
            className="motion-safe:animate-titila"
            style={{ animationDelay: retraso, transformOrigin: `${x}px ${y}px` }}
          >
            <circle cx={x} cy={y} r="6" fill={color} opacity="0.45" filter={`url(#${id}-brillo)`} />
            <circle cx={x} cy={y} r="2.6" fill={color} />
          </g>
        )
      })}

      {/* estrella dorada */}
      <g>
        <circle
          cx={CX}
          cy="14"
          r="16"
          fill="#ffd54a"
          opacity="0.55"
          filter={`url(#${id}-brillo)`}
        />
        <polygon
          points={Array.from({ length: 10 }, (_, i) => {
            const r = i % 2 ? 7 : 16
            const a = -Math.PI / 2 + (i * Math.PI) / 5
            return `${(CX + Math.cos(a) * r).toFixed(1)},${(14 + Math.sin(a) * r).toFixed(1)}`
          }).join(' ')}
          fill="#ffd54a"
          stroke="#e3a21a"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  )
}

export function ArbolesNavidad() {
  const tam = 'h-56 w-auto opacity-50 sm:h-80 sm:opacity-75 xl:h-[34rem] xl:opacity-100'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden navidad:block"
    >
      <Arbol id="arbol-izq" className={cn('absolute bottom-0 left-0 -translate-x-1/2', tam)} />
      <Arbol id="arbol-der" className={cn('absolute right-0 bottom-0 translate-x-1/2', tam)} />
    </div>
  )
}
