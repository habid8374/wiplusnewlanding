/** Ilustración ligera en SVG (sin imágenes pesadas): hilos de fibra que llegan a una casa con Wi-Fi. */
export function FiberIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 360" className={className} role="img" aria-labelledby="ilustracion-fibra">
      <title id="ilustracion-fibra">
        Ilustración: fibra óptica llegando a una casa con señal Wi-Fi
      </title>
      <defs>
        <linearGradient id="fibra" x1="0" x2="1">
          <stop offset="0" stopColor="#00bbfe" stopOpacity="0" />
          <stop offset="0.5" stopColor="#00bbfe" />
          <stop offset="1" stopColor="#66d8ff" />
        </linearGradient>
        <linearGradient id="casa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d2e8ff" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M0 ${120 + i * 36} C 120 ${100 + i * 30}, 160 ${250 - i * 8}, 250 ${236 - i * 2}`}
          fill="none"
          stroke="url(#fibra)"
          strokeWidth={i === 2 ? 4 : 2.5}
          strokeLinecap="round"
          opacity={0.55 + i * 0.1}
        />
      ))}
      <g transform="translate(236 150)">
        <path d="M0 70 L80 10 L160 70 V190 H0 Z" fill="url(#casa)" />
        <path
          d="M-12 76 L80 4 L172 76"
          fill="none"
          stroke="#0a2a6e"
          strokeWidth="10"
          strokeLinejoin="round"
        />
        <rect x="58" y="120" width="44" height="70" rx="6" fill="#0a3d8a" />
        <rect x="20" y="92" width="30" height="26" rx="4" fill="#a6d1ff" />
        <rect x="110" y="92" width="30" height="26" rx="4" fill="#a6d1ff" />
      </g>
      <g
        transform="translate(316 70)"
        fill="none"
        stroke="#00bbfe"
        strokeLinecap="round"
        strokeWidth="9"
      >
        <circle cx="0" cy="44" r="7" fill="#00bbfe" stroke="none" />
        <path d="M-22 22 a31 31 0 0 1 44 0" />
        <path d="M-42 2 a59 59 0 0 1 84 0" opacity="0.8" />
        <path d="M-62 -18 a87 87 0 0 1 124 0" opacity="0.55" />
      </g>
    </svg>
  )
}
