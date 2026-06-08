'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { Play, Users, Camera, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Social {
  name:  string
  sub:   string
  mark:  string        // short text badge
  Icon:  LucideIcon
  href:  string
  color: string
}

const SOCIALS: Social[] = [
  {
    name:  'YOUTUBE',
    sub:   'Full series & trailers',
    mark:  'YT',
    Icon:  Play,
    href:  '#',
    color: '#99ca45',
  },
  {
    name:  'FACEBOOK',
    sub:   'Community & updates',
    mark:  'FB',
    Icon:  Users,
    href:  '#',
    color: '#1a0050',
  },
  {
    name:  'INSTAGRAM',
    sub:   'Behind the ink',
    mark:  'IG',
    Icon:  Camera,
    href:  '#',
    color: '#6c00b3',
  },
  {
    name:  'WEBNOVEL',
    sub:   'Read the originals',
    mark:  'WN',
    Icon:  BookOpen,
    href:  '#',
    color: '#c9a84c',
  },
]

export default function CommunitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<(HTMLAnchorElement | null)[]>([])
  const headRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 85%', once: true },
        }
      )

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16 bg-ink-void border-t border-ink-ash/10 overflow-hidden"
    >
      {/* Ink-splatter background: radial gradients layered */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-[40vw] h-[40vw] rounded-full bg-ink-green/4 blur-[80px]" />
        <div className="absolute bottom-0 right-[15%] w-[30vw] h-[30vw] rounded-full bg-ink-violet/6 blur-[60px]" />
        <div className="absolute top-[30%] right-[5%] w-[20vw] h-[20vw] rounded-full bg-ink-gold/5 blur-[50px]" />
      </div>
      <div className="ink-grain absolute inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section heading */}
        <div ref={headRef} className="opacity-0 mb-20">
          <Label variant="meta" className="mb-4 block">06 — Community</Label>
          <Thunder as="h2" size="display" weight={400} className="text-ink-white leading-none">
            JOIN THE DYFF
          </Thunder>
          <Thunder as="h2" size="display" weight={400} className="thunder-outline block -mt-4">
            COMMUNITY
          </Thunder>
          <div className="mt-6 max-w-md">
            <Body className="text-ink-white/80">
              Every idea needs an audience to set it off. Join the readers, listeners, and watchers building the DYFF universe.
            </Body>
          </div>
        </div>

        {/* Social links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SOCIALS.map((s, i) => (
              <a
                key={s.name}
                ref={el => { cardsRef.current[i] = el }}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ink-flood-up group relative opacity-0 bg-ink-dark border border-ink-ash/15 rounded-sm p-6 flex flex-col gap-4 cursor-pointer hover:border-ink-ash/40 transition-colors duration-300"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}20`, border: `1px solid ${s.color}40` }}
                >
                  <s.Icon size={18} style={{ color: s.color }} />
                </div>

                <div>
                  <Thunder as="h3" size="card" weight={400} className="text-ink-paper text-xl">
                    {s.name}
                  </Thunder>
                  <Body size="sm" className="text-ink-paper/70 mt-1">{s.sub}</Body>
                </div>

                {/* Arrow */}
                <div
                  className="h-px w-4 group-hover:w-8 transition-all duration-300 mt-auto"
                  style={{ backgroundColor: s.color }}
                />
              </a>
          ))}
        </div>

        {/* Footer rule */}
        <div className="mt-24 pt-8 border-t border-ink-ash/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="font-thunder uppercase text-2xl text-ink-paper tracking-tight"
              style={{ fontWeight: 400 }}
            >
              DYFF
            </span>
            <div className="w-px h-4 bg-ink-ash/30" />
            <Label className="text-ink-ash">STUDIOS & PRODUCTIONS</Label>
          </div>
          <Body size="sm" className="text-ink-ash/50">
            © {new Date().getFullYear()} DYFF Studios. INK IS THE ORIGIN.
          </Body>
        </div>

      </div>
    </section>
  )
}
