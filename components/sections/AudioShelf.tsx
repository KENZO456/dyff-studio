'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Thunder, Label, Body } from '@/components/ui/Typography'
import { Play } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SERIES = [
  {
    id:      'gwava',
    title:   'GWAVA',
    genre:   'THRILLER',
    eps:     '12 Episodes',
    from:    'from-red-950/80',
    accent:  '#8b0000',
    desc:    'A missing journalist. A city with no memory. The ink never dries on this case.',
  },
  {
    id:      'ese',
    title:   'ESE',
    genre:   'ROMANCE',
    eps:     '8 Episodes',
    from:    'from-purple-950/80',
    accent:  '#6c00b3',
    desc:    'Love letters written in vanishing ink. Some things aren\'t meant to last.',
  },
  {
    id:      'haunted-heart',
    title:   'HAUNTED HEART',
    genre:   'HORROR',
    eps:     '10 Episodes',
    from:    'from-slate-900/90',
    accent:  '#c9a84c',
    desc:    'What bleeds on the page after midnight knows your name.',
  },
  {
    id:      'legend-of-leviticus',
    title:   'LEGEND OF LEVITICUS',
    genre:   'ACTION',
    eps:     '15 Episodes',
    from:    'from-amber-950/80',
    accent:  '#c9a84c',
    desc:    'The ink on his skin is a map. The map is a weapon.',
  },
  {
    id:      'bds',
    title:   'BDS',
    genre:   'DRAMA',
    eps:     '6 Episodes',
    from:    'from-green-950/80',
    accent:  '#99ca45',
    desc:    'Brotherhood. Debt. Survival. Some stories don\'t have clean endings.',
  },
]

export default function AudioShelf() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      )

      // Horizontal scroll: pin section, drive track leftward
      const track   = trackRef.current!
      const scrollW = track.scrollWidth - window.innerWidth

      if (scrollW > 0) {
        gsap.to(track, {
          x: -scrollW,
          ease: 'none',
          scrollTrigger: {
            trigger:       sectionRef.current,
            start:         'top top',
            end:           `+=${scrollW}`,
            pin:           true,
            anticipatePin: 1,
            scrub:         1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink-dark">
      {/* Section header — above the scrolling track */}
      <div
        ref={headingRef}
        className="opacity-0 px-6 md:px-16 pt-24 pb-10 flex items-end justify-between gap-8 flex-wrap"
      >
        <div>
          <Label variant="meta" className="mb-4 block">04 — Audio</Label>
          <Thunder as="h2" size="section" weight={400} className="text-ink-paper">
            NOW PLAYING AT DYFF
          </Thunder>
        </div>
        <Label className="text-ink-ash hidden md:block">DRAG OR SCROLL →</Label>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-6 md:px-16 pb-20 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {SERIES.map((s) => (
          <div
            key={s.id}
            className={`
              group relative flex-shrink-0 w-[300px] md:w-[360px]
              rounded-sm overflow-hidden cursor-pointer
              bg-gradient-to-b ${s.from} to-ink-void
              border border-ink-ash/10 hover:border-ink-ash/30
              transition-all duration-300
            `}
            style={{ minHeight: 460 }}
          >
            {/* Grain overlay */}
            <div className="ink-grain absolute inset-0 z-0 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-[460px]">
              <div className="flex items-start justify-between">
                <Label variant="badge" style={{ backgroundColor: s.accent, color: '#080808' }}>
                  {s.genre}
                </Label>
                <Label className="text-ink-ash/60">{s.eps}</Label>
              </div>

              <div>
                <Thunder
                  as="h3"
                  size="card"
                  weight={400}
                  className="text-ink-paper mb-3 group-hover:text-ink-white transition-colors duration-300"
                >
                  {s.title}
                </Thunder>
                <Body size="sm" className="text-ink-paper/70 mb-8 max-w-[280px]">
                  {s.desc}
                </Body>

                {/* Play CTA */}
                <button
                  className="ink-flood-up flex items-center gap-3 border border-ink-ash/40 px-5 py-3 rounded-sm cursor-pointer"
                  aria-label={`Play ${s.title}`}
                >
                  <Play size={14} className="text-ink-paper" fill="currentColor" />
                  <Label className="text-ink-paper">LISTEN NOW</Label>
                </button>
              </div>
            </div>

            {/* Hover glow line at bottom */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
              style={{ backgroundColor: s.accent }}
            />
          </div>
        ))}

        {/* End spacer tile */}
        <div className="flex-shrink-0 w-[120px] flex items-center justify-center">
          <Label className="text-ink-ash/40 rotate-90 whitespace-nowrap">MORE COMING</Label>
        </div>
      </div>
    </section>
  )
}
