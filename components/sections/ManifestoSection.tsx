'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Body, Label } from '@/components/ui/Typography'
import { sceneState } from '@/lib/sceneState'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['INK', 'IS', 'THE', 'ORIGIN', 'OF', 'ART.'] as const

export default function ManifestoSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const wordRefs    = useRef<(HTMLDivElement | null)[]>([])
  const sentenceRef = useRef<HTMLDivElement>(null)
  const paraRef     = useRef<HTMLDivElement>(null)
  const stageRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return

    // Initialise invisible
    gsap.set(wordRefs.current, { opacity: 0, scale: 0.3, y: 40 })
    gsap.set(sentenceRef.current, { opacity: 0 })
    gsap.set(paraRef.current, { opacity: 0, y: 30 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       sectionRef.current,
          start:         'top top',
          end:           `+=500%`,
          pin:           true,
          anticipatePin: 1,
          scrub:         0.6,
          onUpdate:      (self) => {
            // Drive InkBlob amplitude during this section
            sceneState.manifestoGlow = self.progress
          },
          onLeaveBack: () => {
            sceneState.manifestoGlow = 0
          },
        },
      })

      // Word by word — slam in, hold, slam out (except last)
      WORDS.forEach((_, i) => {
        const word = wordRefs.current[i]
        if (!word) return

        // Enter
        tl.to(word, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power4.out' })
        // Hold
        tl.to({}, { duration: 0.6 })

        if (i < WORDS.length - 1) {
          // Exit — scale up and fade
          tl.to(word, { opacity: 0, scale: 1.4, y: -20, duration: 0.5, ease: 'power2.in' })
        }
      })

      // After last word: fade sentence in, then paragraph
      tl.to({}, { duration: 0.5 })
      tl.to(sentenceRef.current,  { opacity: 1, duration: 1.2, ease: 'power2.out' }, '>')
      tl.to(paraRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '>+0.3')
      tl.to({}, { duration: 1 }) // hold end state
    }, sectionRef)

    return () => {
      ctx.revert()
      sceneState.manifestoGlow = 0
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* ── Local video background ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <video
          className="yt-bg-frame"
          src="/Videos/videobg (1).mp4"
          poster="/Images/bg (5).jpg"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Dark overlay — keeps text legible over video */}
      <div className="absolute inset-0 z-[1] bg-ink-void/75 pointer-events-none" />

      {/* Grain texture on top of overlay */}
      <div className="ink-grain absolute inset-0 z-[2] pointer-events-none opacity-40" />

      {/* Crimson vignette */}
      <div className="manifesto-vignette absolute inset-0 z-[2] pointer-events-none" />

      {/* Stage: all words stack in the same spot */}
      <div
        ref={stageRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <Label variant="meta" className="mb-12 opacity-60">05 — Manifesto</Label>

        {/* Stacked word display — each word occupies same space via absolute */}
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '35vw' }}>
          {WORDS.map((word, i) => (
            <div
              key={word}
              ref={el => { wordRefs.current[i] = el }}
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden={i < WORDS.length - 1}
            >
              <span
                className="font-thunder uppercase text-ink-paper tracking-tight leading-none"
                style={{
                  fontSize:   'clamp(5rem, 22vw, 28rem)',
                  fontWeight: 400,
                  color: i === WORDS.length - 1 ? 'var(--ink-green)'
                       : i % 2 === 0            ? 'var(--ink-paper)'
                       :                          'var(--ink-white)',
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Full assembled sentence — shown after word sequence */}
        <div ref={sentenceRef} className="mt-8 w-full max-w-5xl">
          <h2
            className="font-thunder uppercase text-ink-paper tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)', lineHeight: 1, fontWeight: 400 }}
          >
            INK IS THE ORIGIN OF ART.
          </h2>
        </div>

        {/* Final paragraph */}
        <div ref={paraRef} className="mt-10 max-w-xl mx-auto">
          <Body size="lg" className="text-ink-white/80 italic text-center leading-relaxed">
            Every story we tell began as ink on a page. Every beat. Every frame.
            Every word that has ever moved you — it started here.
          </Body>
          <div className="mt-8 w-8 h-px bg-ink-green mx-auto" />
        </div>
      </div>
    </section>
  )
}
