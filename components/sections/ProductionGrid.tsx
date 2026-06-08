'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  {
    id:     'books',
    title:  'BOOKS & NOVELS',
    pitch:  'Stories that refuse to stay on the page. Worlds built word by word, in ink.',
    href:   '/books',
    label:  'FICTION',
    accent: 'from-ink-green/20',
  },
  {
    id:     'audio',
    title:  'AUDIO SERIES',
    pitch:  'Cinematic productions with original scores. No visuals needed — the sound paints everything.',
    href:   '/audio',
    label:  'AUDIO',
    accent: 'from-ink-gold/15',
  },
  {
    id:     'animations',
    title:  'ANIMATIONS',
    pitch:  'Dark animation made for adults. Frame by frame. Ink by ink.',
    href:   '/animations',
    label:  'ANIMATION',
    accent: 'from-ink-violet/20',
  },
  {
    id:     'marketplace',
    title:  'MARKETPLACE',
    pitch:  'Merchandise, collectibles, and limited editions. Own a piece of the DYFF universe.',
    href:   '/marketplace',
    label:  'MERCH',
    accent: 'from-ink-green/10',
  },
]

export default function ProductionGrid() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const headingRef  = useRef<HTMLDivElement>(null)

  /* GSAP entrance — stagger cards when section hits viewport */
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Heading slide-in
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start:   'top 85%',
            once:    true,
          },
        }
      )

      // Cards stagger
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start:   'top 88%',
              once:    true,
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-16 bg-ink-void/95">

      {/* Section heading */}
      <div ref={headingRef} className="mb-20 opacity-0">
        <Label variant="meta" className="mb-4 block">03 — Productions</Label>
        <Thunder as="h2" size="display" weight={400} className="text-ink-white">
          WHAT WE
        </Thunder>
        <Thunder as="h2" size="display" weight={400} className="thunder-outline block -mt-4">
          CREATE
        </Thunder>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl">
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={el => { cardRefs.current[i] = el }}
            className="opacity-0 group"
          >
            <Link href={card.href}>
              <div className={`
                ink-grain ink-flood-up relative overflow-hidden
                bg-ink-dark border border-ink-ash/15 rounded-sm
                p-8 min-h-[300px] flex flex-col justify-between
                cursor-pointer transition-border duration-300
                hover:border-ink-ash/40
                bg-gradient-to-br ${card.accent} to-transparent
              `}>
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <Label variant="tag">{card.label}</Label>
                  <ArrowUpRight
                    size={18}
                    className="text-ink-ash group-hover:text-ink-paper transition-colors duration-300"
                  />
                </div>

                {/* Title */}
                <div className="mt-auto pt-8">
                  <Thunder
                    as="h3"
                    size="card"
                    weight={400}
                    className="text-ink-paper mb-3 group-hover:text-ink-white transition-colors duration-300"
                  >
                    {card.title}
                  </Thunder>
                  <Body size="sm" className="text-ink-paper/70 max-w-xs">
                    {card.pitch}
                  </Body>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-px w-6 bg-ink-green group-hover:w-12 transition-all duration-300" />
                    <Label className="text-ink-green transition-colors duration-300">
                      ENTER
                    </Label>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

    </section>
  )
}
