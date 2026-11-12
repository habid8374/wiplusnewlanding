'use client'

import { useEffect, useRef } from 'react'

/*
 * Nieve navideña de WIPLUS dibujada en un <canvas> fijo (decorativo, no recibe clics).
 * Capas:
 *  1. Luces de señal: puntos cian que suben despacio, como bokeh.
 *  2. Guirnalda de fibra óptica bajo el menú: un cable que cuelga con física real, con pulsos
 *     de luz que lo recorren y bombillos azul/cian/blanco. Se mece al pasar el mouse o el dedo.
 *  3. Bolas de Navidad azules y plateadas colgando de la guirnalda (péndulos).
 *  4. Nieve: copos suaves y cristales de seis puntas que giran; algunos destellan.
 *  5. Dos o cuatro cristales grandes y desenfocados en primer plano.
 * La guirnalda se desvanece al bajar por la página. Se pausa con la pestaña oculta.
 */

type Rgb = readonly [number, number, number]
const CIAN: Rgb = [0, 187, 254]
const AZUL: Rgb = [46, 149, 255]
const BLANCO: Rgb = [255, 255, 255]
const BOMBILLOS: Rgb[] = [CIAN, BLANCO, AZUL]
const rgba = (c: Rgb, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`
const azar = (min: number, max: number) => min + Math.random() * (max - min)

/** Copo redondo y suave, con borde azul hielo para que se vea también sobre fondos blancos. */
function spriteCopo(r: number) {
  const c = document.createElement('canvas')
  const t = Math.ceil(2 * r + 4)
  c.width = c.height = t
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(t / 2, t / 2, 0, t / 2, t / 2, r + 1)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.8, 'rgba(140,190,235,0.55)')
  grad.addColorStop(1, 'rgba(140,190,235,0)')
  g.fillStyle = grad
  g.beginPath()
  g.arc(t / 2, t / 2, r + 1, 0, Math.PI * 2)
  g.fill()
  return c
}

/** Cristal de nieve de seis brazos con ramitas; `desenfoque` para los de primer plano. */
function spriteCristal(r: number, desenfoque = 0) {
  const margen = Math.ceil(r * 0.6) + desenfoque * 2
  const t = Math.ceil(2 * r + 2 * margen)
  const c = document.createElement('canvas')
  c.width = c.height = t
  const g = c.getContext('2d')!
  g.translate(t / 2, t / 2)
  if (desenfoque) g.filter = `blur(${desenfoque}px)`
  const trazar = () => {
    for (let i = 0; i < 6; i++) {
      g.save()
      g.rotate((i * Math.PI) / 3)
      g.beginPath()
      g.moveTo(0, 0)
      g.lineTo(0, -r)
      for (const [pos, largo] of [
        [0.38, 0.3],
        [0.62, 0.24],
        [0.82, 0.14],
      ]) {
        const y = -r * pos
        const l = r * largo * 0.72
        g.moveTo(0, y)
        g.lineTo(-l, y - l)
        g.moveTo(0, y)
        g.lineTo(l, y - l)
      }
      g.stroke()
      g.restore()
    }
    g.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6
      g.lineTo(Math.cos(a) * r * 0.16, Math.sin(a) * r * 0.16)
    }
    g.closePath()
    g.stroke()
  }
  g.lineCap = 'round'
  g.lineJoin = 'round'
  // Primero un trazo azul con brillo (contorno), luego el blanco encima
  g.strokeStyle = 'rgba(2, 110, 200, 0.5)'
  g.lineWidth = Math.max(1.6, r / 6.5)
  g.shadowColor = 'rgba(0, 150, 220, 0.6)'
  g.shadowBlur = r / 3
  trazar()
  g.shadowBlur = 0
  g.strokeStyle = 'rgba(255, 255, 255, 0.98)'
  g.lineWidth = Math.max(1, r / 11)
  trazar()
  const centro = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.35)
  centro.addColorStop(0, 'rgba(255,255,255,0.95)')
  centro.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = centro
  g.beginPath()
  g.arc(0, 0, r * 0.35, 0, Math.PI * 2)
  g.fill()
  return c
}

/** Destello de cuatro puntas. */
function destello(g: CanvasRenderingContext2D, x: number, y: number, r: number, alfa: number) {
  g.save()
  g.globalAlpha = alfa
  g.fillStyle = '#fff'
  g.beginPath()
  g.moveTo(x, y - r)
  g.quadraticCurveTo(x, y, x + r, y)
  g.quadraticCurveTo(x, y, x, y + r)
  g.quadraticCurveTo(x, y, x - r, y)
  g.quadraticCurveTo(x, y, x, y - r)
  g.fill()
  g.restore()
}

type Copo = {
  x: number
  y: number
  vy: number
  fase: number
  amp: number
  frec: number
  brillo: boolean
  cristal: boolean
  sprite: number
  rot: number
  vr: number
}
type Grande = {
  x: number
  y: number
  vy: number
  fase: number
  rot: number
  vr: number
  alfa: number
  sprite: number
}
type Luz = { x: number; y: number; r: number; fase: number; vel: number; vy: number; color: Rgb }
type Punto = { x: number; y: number; px: number; py: number }
type Cable = { pts: Punto[]; seg: number; x0: number; x1: number; pulso: number; velPulso: number }
type Bola = {
  cable: number
  i: number
  largo: number
  r: number
  th: number
  w: number
  vxPrev: number
  plata: boolean
  fase: number
}

export function NieveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const g = canvas.getContext('2d')
    if (!g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let ancho = 0
    let alto = 0
    let raf = 0
    let antes = performance.now()
    let scrollAntes = window.scrollY

    const copos = [1.6, 2.2, 3].map(spriteCopo)
    const cristales = [7, 10, 14, 19].map((r) => spriteCristal(r))
    const cristalesGrandes = [34, 46].map((r) => spriteCristal(r, 3))
    let nieve: Copo[] = []
    let grandes: Grande[] = []
    let luces: Luz[] = []
    let cables: Cable[] = []
    let bolas: Bola[] = []
    const puntero = { x: -999, y: -999, t: -99, vx: 0, vy: 0 }

    const bordeMenu = () => {
      const h = document.querySelector('header')
      return h ? h.getBoundingClientRect().bottom : ancho < 1024 ? 64 : 72
    }
    const nuevoCopo = (arriba: boolean): Copo => ({
      x: azar(0, ancho),
      y: arriba ? azar(-40, -5) : azar(0, alto),
      vy: azar(18, 46),
      fase: azar(0, Math.PI * 2),
      amp: azar(8, 26),
      frec: azar(0.4, 1.1),
      brillo: Math.random() < 0.25,
      cristal: Math.random() < 0.55,
      sprite: Math.floor(azar(0, 4)),
      rot: azar(0, Math.PI * 2),
      vr: azar(-0.6, 0.6),
    })
    const nuevoGrande = (arriba: boolean): Grande => ({
      x: azar(0, ancho),
      y: arriba ? azar(-120, -60) : azar(0, alto),
      vy: azar(22, 34),
      fase: azar(0, Math.PI * 2),
      rot: azar(0, Math.PI * 2),
      vr: azar(-0.3, 0.3),
      alfa: azar(0.3, 0.55),
      sprite: Math.floor(azar(0, cristalesGrandes.length)),
    })
    const nuevaLuz = (): Luz => ({
      x: azar(0, ancho),
      y: azar(0, alto),
      r: azar(6, ancho < 640 ? 14 : 20),
      fase: azar(0, Math.PI * 2),
      vel: azar(0.6, 1.6),
      vy: azar(-6, -2),
      color: Math.random() < 0.7 ? CIAN : BLANCO,
    })

    const preparar = () => {
      ancho = window.innerWidth
      alto = window.innerHeight
      canvas.width = ancho * dpr
      canvas.height = alto * dpr
      canvas.style.width = `${ancho}px`
      canvas.style.height = `${alto}px`
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const movil = ancho < 640
      nieve = Array.from(
        { length: movil ? 16 : Math.round(Math.min(55, Math.max(22, ancho / 26))) },
        () => nuevoCopo(false),
      )
      grandes = Array.from({ length: movil ? 2 : 4 }, () => nuevoGrande(false))
      luces = Array.from({ length: movil ? 10 : 18 }, nuevaLuz)
      // Guirnalda: 2–4 tramos de cable colgando del borde del menú
      const tramos = movil ? 2 : ancho < 1024 ? 3 : 4
      const nPuntos = movil ? 16 : 22
      const largoTramo = ancho / tramos
      const holgura = movil ? 1.016 : 1.022
      const y = bordeMenu()
      cables = Array.from({ length: tramos }, (_, k) => {
        const x0 = k * largoTramo
        return {
          pts: Array.from({ length: nPuntos + 1 }, (_, i) => {
            const x = x0 + (largoTramo * i) / nPuntos
            return { x, y, px: x, py: y }
          }),
          seg: (largoTramo * holgura) / nPuntos,
          x0,
          x1: x0 + largoTramo,
          pulso: azar(0, 1),
          velPulso: azar(0.18, 0.3),
        }
      })
      bolas = cables.map((c, k) => ({
        cable: k,
        i: Math.floor(c.pts.length / 2),
        largo: movil ? 20 : 32,
        r: movil ? 8 : 12,
        th: 0,
        w: 0,
        vxPrev: 0,
        plata: k % 2 === 1,
        fase: k * 1.7,
      }))
    }

    const dibujarBola = (b: Bola, x: number, y: number, t: number) => {
      g.save()
      g.translate(x, y)
      g.rotate(-b.th * 0.5)
      // tapita metálica
      g.fillStyle = '#c9d3df'
      g.fillRect(-b.r * 0.28, -b.r - b.r * 0.32, b.r * 0.56, b.r * 0.38)
      const esfera = g.createRadialGradient(-b.r * 0.35, -b.r * 0.4, b.r * 0.1, 0, 0, b.r)
      if (b.plata) {
        esfera.addColorStop(0, '#ffffff')
        esfera.addColorStop(0.45, '#d9e2ec')
        esfera.addColorStop(1, '#7b8aa0')
      } else {
        esfera.addColorStop(0, '#a6d1ff')
        esfera.addColorStop(0.45, '#0284ff')
        esfera.addColorStop(1, '#0a2a6e')
      }
      g.shadowColor = b.plata ? 'rgba(255,255,255,0.7)' : 'rgba(0,187,254,0.7)'
      g.shadowBlur = 10
      g.fillStyle = esfera
      g.beginPath()
      g.arc(0, 0, b.r, 0, Math.PI * 2)
      g.fill()
      g.shadowBlur = 0
      // franja de fibra (onda cian) alrededor de la bola
      g.strokeStyle = b.plata ? 'rgba(2,132,255,0.55)' : 'rgba(102,216,255,0.8)'
      g.lineWidth = Math.max(1, b.r / 7)
      g.beginPath()
      for (let k = -b.r; k <= b.r; k += 1) {
        const yy = Math.sin(k / (b.r / 2.2) + t * 1.5) * b.r * 0.12
        const xx = k * Math.sqrt(Math.max(0, 1 - (yy / b.r) ** 2)) * 0.98
        if (k === -b.r) g.moveTo(xx, yy)
        else g.lineTo(xx, yy)
      }
      g.stroke()
      // reflejo
      g.fillStyle = 'rgba(255,255,255,0.75)'
      g.beginPath()
      g.ellipse(-b.r * 0.38, -b.r * 0.42, b.r * 0.22, b.r * 0.13, -0.6, 0, Math.PI * 2)
      g.fill()
      g.restore()
      const brillo = Math.sin(t * 0.9 + b.fase)
      if (brillo > 0.97) destello(g, x - b.r * 0.3, y - b.r * 0.35, b.r * 1.1, (brillo - 0.97) * 30)
    }

    const cuadro = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000)
      antes = ahora
      const t = ahora / 1000
      g.clearRect(0, 0, ancho, alto)

      // 1. Luces de señal que suben
      for (const l of luces) {
        l.y += l.vy * dt
        if (l.y < -30) {
          l.y = alto + 20
          l.x = azar(0, ancho)
        }
        const a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * l.vel + l.fase))
        const grad = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r)
        grad.addColorStop(0, rgba(BLANCO, a))
        grad.addColorStop(0.2, rgba(l.color, a * 0.8))
        grad.addColorStop(0.55, rgba(l.color, a * 0.25))
        grad.addColorStop(1, rgba(l.color, 0))
        g.fillStyle = grad
        g.beginPath()
        g.arc(l.x, l.y, l.r, 0, Math.PI * 2)
        g.fill()
      }

      // 2 y 3. Guirnalda de fibra con bombillos y bolas
      const visible = Math.max(0, 1 - window.scrollY / 350)
      if (cables.length) {
        const movil = ancho < 640
        const yMenu = bordeMenu()
        const empujeScroll = window.scrollY - scrollAntes
        scrollAntes = window.scrollY
        const tocando = t - puntero.t < 0.15
        const paso = Math.min(dt, 1 / 30)
        for (const c of cables) {
          const p = c.pts
          for (let i = 1; i < p.length - 1; i++) {
            const q = p[i]
            const vx = (q.x - q.px) * 0.985
            const vy = (q.y - q.py) * 0.985 + Math.max(-6, Math.min(6, empujeScroll * 0.04))
            q.px = q.x
            q.py = q.y
            q.x += vx
            q.y += vy + 900 * paso * paso
            if (tocando) {
              const dx = q.x - puntero.x
              const dy = q.y - puntero.y
              const d = Math.hypot(dx, dy)
              const radio = movil ? 44 : 60
              if (d < radio && d > 0.1) {
                const f = (radio - d) / radio
                q.x += (dx / d) * f * 6 + puntero.vx * 0.12 * f
                q.y += (dy / d) * f * 6 + puntero.vy * 0.12 * f
              }
            }
          }
          p[0].x = c.x0
          p[0].y = yMenu
          p[p.length - 1].x = c.x1
          p[p.length - 1].y = yMenu
          for (let it = 0; it < 10; it++) {
            for (let i = 0; i < p.length - 1; i++) {
              const a = p[i]
              const b = p[i + 1]
              const dx = b.x - a.x
              const dy = b.y - a.y
              const d = Math.hypot(dx, dy) || 0.001
              const k = (d - c.seg) / d / 2
              if (i > 0) {
                a.x += dx * k
                a.y += dy * k
              }
              if (i + 1 < p.length - 1) {
                b.x -= dx * k
                b.y -= dy * k
              }
            }
          }
          c.pulso = (c.pulso + c.velPulso * dt) % 1
        }

        if (visible > 0) {
          g.save()
          g.globalAlpha = visible
          for (const c of cables) {
            const p = c.pts
            const trazo = () => {
              g.beginPath()
              g.moveTo(p[0].x, p[0].y)
              for (let i = 1; i < p.length - 1; i++) {
                g.quadraticCurveTo(
                  p[i].x,
                  p[i].y,
                  (p[i].x + p[i + 1].x) / 2,
                  (p[i].y + p[i + 1].y) / 2,
                )
              }
              g.lineTo(p[p.length - 1].x, p[p.length - 1].y)
              g.stroke()
            }
            // cable: funda azul oscura + núcleo de fibra cian
            g.strokeStyle = 'rgba(10, 42, 110, 0.55)'
            g.lineWidth = 2.2
            trazo()
            g.strokeStyle = 'rgba(0, 187, 254, 0.45)'
            g.lineWidth = 0.9
            trazo()
            // pulso de luz que recorre la fibra
            const pos = c.pulso * (p.length - 1)
            const i0 = Math.floor(pos)
            const f = pos - i0
            const a = p[i0]
            const b = p[Math.min(i0 + 1, p.length - 1)]
            const px = a.x + (b.x - a.x) * f
            const py = a.y + (b.y - a.y) * f
            const halo = g.createRadialGradient(px, py, 0, px, py, movil ? 14 : 20)
            halo.addColorStop(0, rgba(BLANCO, 0.95))
            halo.addColorStop(0.25, rgba(CIAN, 0.7))
            halo.addColorStop(1, rgba(CIAN, 0))
            g.fillStyle = halo
            g.beginPath()
            g.arc(px, py, movil ? 14 : 20, 0, Math.PI * 2)
            g.fill()
          }
          // bombillos (se encienden más cuando pasa el pulso o el puntero)
          let n = 0
          for (const c of cables) {
            const p = c.pts
            const pos = c.pulso * (p.length - 1)
            for (let i = 1; i < p.length - 1; i += 2) {
              const q = p[i]
              let luz = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.8 - n * 0.55))
              luz = Math.min(1, luz + Math.max(0, 1 - Math.abs(i - pos) / 2) * 0.6)
              const dp = Math.hypot(q.x - puntero.x, q.y - puntero.y)
              if (t - puntero.t < 1.5 && dp < 140) luz = Math.min(1, luz + (1 - dp / 140) * 0.8)
              const color = BOMBILLOS[n % BOMBILLOS.length]
              const r = (movil ? 11 : 15) * (0.8 + 0.5 * luz)
              const grad = g.createRadialGradient(q.x, q.y + 3, 0, q.x, q.y + 3, r)
              grad.addColorStop(0, rgba(color, luz))
              grad.addColorStop(0.3, rgba(color, luz * 0.45))
              grad.addColorStop(1, rgba(color, 0))
              g.fillStyle = grad
              g.beginPath()
              g.arc(q.x, q.y + 3, r, 0, Math.PI * 2)
              g.fill()
              g.fillStyle =
                color === BLANCO
                  ? `rgba(220, 236, 255, ${0.8 + 0.2 * luz})`
                  : rgba(color, 0.8 + 0.2 * luz)
              g.beginPath()
              g.ellipse(q.x, q.y + 3.5, movil ? 2 : 2.6, movil ? 2.8 : 3.6, 0, 0, Math.PI * 2)
              g.fill()
              n++
            }
          }
          // bolas colgando (péndulo que reacciona al movimiento del cable)
          for (const b of bolas) {
            const q = cables[b.cable].pts[b.i]
            const vx = q.x - q.px
            const acel = (vx - b.vxPrev) / Math.max(paso, 0.001)
            b.vxPrev = vx
            const alfa = -(900 / b.largo) * Math.sin(b.th) - 2.2 * b.w - (acel / b.largo) * 0.6
            b.w += alfa * paso
            b.th = Math.max(-1.2, Math.min(1.2, b.th + b.w * paso))
            const x = q.x + Math.sin(b.th) * b.largo
            const y = q.y + Math.cos(b.th) * b.largo
            g.strokeStyle = 'rgba(10, 42, 110, 0.5)'
            g.lineWidth = 0.8
            g.beginPath()
            g.moveTo(q.x, q.y)
            g.lineTo(x, y - b.r * 1.2)
            g.stroke()
            dibujarBola(b, x, y, t)
          }
          g.restore()
        }
      }

      // 4. Nieve
      for (const c of nieve) {
        c.y += c.vy * dt
        c.rot += c.vr * dt
        if (c.y > alto + 30) Object.assign(c, nuevoCopo(true))
        const x = c.x + Math.sin(t * c.frec + c.fase) * c.amp
        if (c.cristal) {
          const s = cristales[c.sprite]
          g.save()
          g.translate(x, c.y)
          g.rotate(c.rot)
          g.drawImage(s, -s.width / 2, -s.height / 2)
          g.restore()
        } else {
          const s = copos[c.sprite % copos.length]
          g.drawImage(s, x - s.width / 2, c.y - s.height / 2)
        }
        if (c.brillo) {
          const b = Math.max(0, Math.sin(t * 2.2 + c.fase))
          if (b > 0.6) destello(g, x, c.y, 6 + c.sprite * 1.5, (b - 0.6) * 2.2)
        }
      }

      // 5. Cristales grandes en primer plano
      for (const c of grandes) {
        c.y += c.vy * dt
        c.rot += c.vr * dt
        if (c.y > alto + 120) Object.assign(c, nuevoGrande(true))
        const s = cristalesGrandes[c.sprite]
        g.save()
        g.globalAlpha = c.alfa
        g.translate(c.x + Math.sin(t * 0.5 + c.fase) * 30, c.y)
        g.rotate(c.rot)
        g.drawImage(s, -s.width / 2, -s.height / 2)
        g.restore()
      }

      raf = requestAnimationFrame(cuadro)
    }

    const alCambiarVisibilidad = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        antes = performance.now()
        raf = requestAnimationFrame(cuadro)
      }
    }
    const alMoverPuntero = (e: PointerEvent) => {
      const ahora = performance.now() / 1000
      const dt = Math.max(0.008, ahora - puntero.t)
      if (ahora - puntero.t < 0.2) {
        puntero.vx = (e.clientX - puntero.x) / dt / 60
        puntero.vy = (e.clientY - puntero.y) / dt / 60
      }
      puntero.x = e.clientX
      puntero.y = e.clientY
      puntero.t = ahora
    }

    preparar()
    raf = requestAnimationFrame(cuadro)
    window.addEventListener('resize', preparar)
    window.addEventListener('pointermove', alMoverPuntero, { passive: true })
    window.addEventListener('pointerdown', alMoverPuntero, { passive: true })
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', preparar)
      window.removeEventListener('pointermove', alMoverPuntero)
      window.removeEventListener('pointerdown', alMoverPuntero)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-40" />
}
