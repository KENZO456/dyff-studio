'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const TOTAL  = 51
const padded = (n: number) => String(n).padStart(3, '0')
const FRAMES = Array.from({ length: TOTAL }, (_, i) =>
  `/Images/eseshowcase/ezgif-frame-${padded(i + 1)}.webp`,
)

export default function EseShowcase() {
  const sectionRef  = useRef<HTMLElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef     = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas  = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return

    // ── Load all frames eagerly ──────────────────────────────────────────
    const images: HTMLImageElement[] = FRAMES.map(src => {
      const img = new window.Image()
      img.src = src
      return img
    })

    // Track current drawn index for resize redraws
    let currentIdx = 0

    // Stable non-null aliases for use inside closures
    const cvs = canvas
    const c   = ctx
    const sec = section

    // ── Cover-fill canvas ────────────────────────────────────────────────
    function drawFrame(img: HTMLImageElement) {
      if (!img.complete || img.naturalWidth === 0) return
      const cW = cvs.width, cH = cvs.height
      const iAR = img.naturalWidth / img.naturalHeight
      const cAR = cW / cH
      let dW: number, dH: number, dX: number, dY: number
      if (iAR > cAR) {
        dH = cH; dW = dH * iAR; dX = (cW - dW) / 2; dY = 0
      } else {
        dW = cW; dH = dW / iAR; dX = 0; dY = (cH - dH) / 2
      }
      c.clearRect(0, 0, cW, cH)
      c.drawImage(img, dX, dY, dW, dH)
    }

    // ── Resize handler ───────────────────────────────────────────────────
    function resize() {
      cvs.width  = sec.clientWidth
      cvs.height = sec.clientHeight
      drawFrame(images[currentIdx])
    }

    resize()
    // Draw first frame as soon as it loads (shows something immediately)
    if (images[0].complete) {
      drawFrame(images[0])
    } else {
      images[0].onload = () => drawFrame(images[0])
    }

    window.addEventListener('resize', resize)

    // ── GSAP frame-sequence + text reveals ───────────────────────────────
    const proxy = { frame: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:             section,
        start:               'top top',
        end:                 '+=350%',
        pin:                 true,
        pinType:             'transform',
        scrub:               0.6,
        invalidateOnRefresh: true,
      },
    })

    // 0 → 100 % — frame advance
    tl.to(proxy, {
      frame: TOTAL - 1,
      ease:  'none',
      duration: 1,
      onUpdate() {
        const idx = Math.round(proxy.frame)
        currentIdx = idx
        drawFrame(images[idx])
      },
    })

    // ── Text reveals (positions are fractions of total timeline duration) ──

    // Gradient overlay darkens first
    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.14, ease: 'power2.out' },
      0.26,
    )

    // Section label
    tl.fromTo(labelRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
      0.3,
    )

    // Headline — "ESE — THE SAGA BEGINS."
    tl.fromTo(headlineRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.14, ease: 'power3.out' },
      0.36,
    )

    // Body paragraph
    tl.fromTo(bodyRef.current,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
      0.52,
    )

    // CTA button
    tl.fromTo(btnRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
      0.67,
    )

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100vh' }}
    >
      {/* ── Sequence canvas ─────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ── Bottom gradient overlay — fades in with text ────────────────── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            'linear-gradient(to top, rgba(2,2,2,0.96) 0%, rgba(2,2,2,0.72) 38%, rgba(2,2,2,0.18) 70%, transparent 100%)',
        }}
      />

      {/* ── Film-grain texture ──────────────────────────────────────────── */}
      <div className="ink-grain absolute inset-0 z-[1] pointer-events-none opacity-15" />

      {/* ── Text content ────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-16 lg:px-24 pb-14 md:pb-20">

        {/* Section label */}
        <p
          ref={labelRef}
          className="font-mono text-ink-green text-[0.58rem] tracking-[0.32em] uppercase mb-5"
          style={{ opacity: 0 }}
        >
          05 — Ese Showcase
        </p>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-thunder uppercase text-white leading-[0.86] mb-6"
          style={{
            fontSize:   'clamp(3.2rem, 9vw, 11rem)',
            fontWeight: 400,
            opacity:    0,
          }}
        >
          ESE —<br />THE SAGA BEGINS.
        </h2>

        {/* Body */}
        <p
          ref={bodyRef}
          className="font-thunder uppercase text-white/65 max-w-lg leading-snug mb-10"
          style={{ fontSize: 'clamp(0.82rem, 1.55vw, 1.05rem)', opacity: 0 }}
        >
          DYFF Studio&apos;s flagship drama — written by Daniel Ochonogor, produced and
          scored by Nobu Savage. A full original soundtrack. Cinematic sound design.
          A narrative that reaches into the heart of what it means to carry a name,
          a people, and a destiny.
        </p>

        {/* CTA */}
        <a
          ref={btnRef}
          href="https://open.spotify.com/album/57utUjzbYMmiRm6wbsAHY0?si=FToSlsghQyaVNTWlefrWtA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-thunder uppercase text-ink-green
            border border-ink-green/40 px-7 py-4 text-[0.8rem] tracking-[0.25em]
            hover:gap-5 hover:bg-ink-green hover:text-ink-void hover:border-ink-green
            transition-all duration-300"
          style={{ opacity: 0 }}
        >
          Listen on Spotify
          <ArrowUpRight size={13} />
        </a>

      </div>
    </section>
  )
}
