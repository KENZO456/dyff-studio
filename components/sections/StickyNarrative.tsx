'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Thunder, Body, Label } from '@/components/ui/Typography'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    slug:   'books',
    line:   'Every story began as ink on a page.',
    sub:    'From epic fantasy to urban thrillers — DYFF books are written for those who need a world to escape into.',
    label:  'BOOKS & NOVELS',
    accent: '#8b0000',
  },
  {
    slug:   'audio',
    line:   'Every beat was written before it was heard.',
    sub:    'Cinematic audio dramas produced with original scores. Your commute becomes a stage.',
    label:  'AUDIO SERIES',
    accent: '#c9a84c',
  },
  {
    slug:   'animations',
    line:   'Every frame was drawn before it moved.',
    sub:    'Animation that treats the audience as adults. Dark, precise, and unapologetic.',
    label:  'ANIMATIONS',
    accent: '#99ca45',
  },
]

export default function StickyNarrative() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelsRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !panelsRef.current) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const ctx = gsap.context(() => {
        gsap.to(panelsRef.current, {
          y:    () => -(window.innerHeight * (PANELS.length - 1)),
          ease: 'none',
          scrollTrigger: {
            trigger:             sectionRef.current,
            start:               'top top',
            end:                 () => `+=${window.innerHeight * (PANELS.length - 1)}`,
            scrub:               1,
            pin:                 true,
            pinSpacing:          true,
            invalidateOnRefresh: true,
          },
        })
      })

      const t = setTimeout(() => ScrollTrigger.refresh(), 500)
      return () => { clearTimeout(t); ctx.revert() }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-ink-void">
      <div className="narrative-inner h-screen flex">

        {/* LEFT — desktop only */}
        <div className="hidden md:flex w-[42%] h-full flex-col justify-center px-12 lg:px-20 border-r border-ink-ash/15 relative z-10">
          <div className="flex items-center gap-8">
            <span className="narrative-ink-text font-thunder uppercase tracking-tight select-none shrink-0">
              INK
            </span>
            <div className="flex flex-col gap-4">
              <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none">
                IS THE<br />ORIGIN<br />OF ART.
              </Thunder>
              <div className="w-14 h-[2px] bg-ink-green" />
              <Body size="sm" className="text-ink-white/70 max-w-[22ch] leading-relaxed">
                Every DYFF production traces its DNA back to a single act: ink on a surface.
              </Body>
            </div>
          </div>
          <div className="absolute bottom-10 left-12 ink-drip opacity-70">
            <div className="w-px h-20 bg-gradient-to-b from-ink-green to-transparent" />
          </div>
        </div>

        {/* RIGHT — overflow clips to one panel height on desktop */}
        <div className="narrative-right flex-1 h-full overflow-hidden relative">
          <div ref={panelsRef} className="narrative-panels-wrap will-change-transform">
            {PANELS.map((panel, i) => (
              <div
                key={panel.slug}
                className={`narrative-panel narrative-panel-${panel.slug} h-screen flex flex-col justify-center px-8 md:px-14 lg:px-20 py-24 relative`}
              >
                <div className="narrative-accent-bar w-[3px] h-20 rounded-full mb-10 shrink-0" />

                <Label variant="tag" className="narrative-panel-label mb-5">
                  {panel.label}
                </Label>

                <Thunder as="h3" size="section" weight={400} className="text-ink-paper leading-none mb-6">
                  {panel.line}
                </Thunder>

                <Body size="lg" className="text-ink-white/70 max-w-lg leading-relaxed">
                  {panel.sub}
                </Body>

                <span className="narrative-panel-counter absolute top-10 right-10 font-mono text-[0.6rem] tracking-[0.25em] uppercase">
                  0{i + 1}&nbsp;/&nbsp;0{PANELS.length}
                </span>

                {i < PANELS.length - 1 && (
                  <div className="absolute bottom-0 left-12 right-0 h-px bg-ink-ash/10" />
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
