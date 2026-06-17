'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import type { AudioSeries } from '@/lib/audio-data'
import AudioShelf from '@/components/sections/AudioShelf'

gsap.registerPlugin(ScrollTrigger)

const HERO_BARS = [
  { h: 24, delay: 0 }, { h: 40, delay: 0.12 }, { h: 64, delay: 0.06 },
  { h: 80, delay: 0.18 }, { h: 100, delay: 0.0 }, { h: 72, delay: 0.24 },
  { h: 88, delay: 0.09 }, { h: 56, delay: 0.15 }, { h: 100, delay: 0.03 },
  { h: 80, delay: 0.21 }, { h: 60, delay: 0.07 }, { h: 40, delay: 0.17 },
  { h: 24, delay: 0.13 },
] as const

const TILE_BARS = HERO_BARS.slice(0, 9)

function SoundwaveHero() {
  return (
    <div className="flex items-end justify-center gap-[3px] h-[100px]" aria-hidden="true">
      {HERO_BARS.map((bar, i) => (
        <div
          key={i}
          className="soundwave-bar w-[3px] rounded-full bg-ink-green opacity-70"
          style={{ '--bar-h': `${bar.h}%`, '--bar-delay': `${bar.delay}s` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function SeriesTile({ series }: { series: AudioSeries }) {
  return (
    <Link
      href={`/audio/${series.slug}`}
      className={`audio-shelf-tile series-${series.slug} group relative flex-shrink-0 w-56 md:w-64`}
    >
      <div className="series-cover relative overflow-hidden rounded-sm aspect-[3/4] mb-3">
        <div className="ink-grain absolute inset-0 z-[1] opacity-30 pointer-events-none" />
        <div className="absolute bottom-6 left-0 right-0 z-[2] px-4 flex items-end justify-center gap-[2px] h-12">
          {TILE_BARS.map((bar, i) => (
            <div
              key={i}
              className="soundwave-bar tile-soundwave-bar w-[2px] rounded-full opacity-50 bg-[color:var(--series-accent)]"
              style={{ '--bar-h': `${bar.h}%`, '--bar-delay': `${bar.delay + i * 0.04}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="tile-cover-gradient absolute inset-x-0 bottom-0 z-[3] h-2/3" />
        <div className="absolute inset-0 z-[2] flex items-center justify-center select-none pointer-events-none" aria-hidden="true">
          <span className="tile-watermark font-thunder uppercase text-center leading-none px-3">{series.title}</span>
        </div>
        <div className="absolute top-3 left-3 z-[4]">
          <span className="series-genre-badge">{series.genre}</span>
        </div>
        <div className="absolute top-3 right-3 z-[4]">
          <span className="font-mono text-[0.45rem] tracking-[0.15em] uppercase text-ink-ash/70">
            {series.status === 'ongoing' ? '● ONGOING' : '✓ COMPLETE'}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-[4] p-4">
          <p className="tile-title-size font-thunder uppercase text-ink-paper leading-none mb-1 transition-transform duration-300 group-hover:-translate-y-0.5">
            {series.title}
          </p>
          <p className="font-mono text-ink-ash text-[0.55rem] tracking-wide">
            {series.episodeCount} EP &nbsp;·&nbsp; {series.year}
          </p>
        </div>
        <div className="tile-hover-border absolute inset-0 z-[5] rounded-sm pointer-events-none" />
      </div>
      <p className="font-mono text-ink-ash/60 text-[0.58rem] leading-snug px-1 line-clamp-2">{series.subtitle}</p>
    </Link>
  )
}

export default function AudioPageClient({ series }: { series: AudioSeries[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
    const tiles = gridRef.current.querySelectorAll<HTMLElement>('.audio-shelf-tile')
    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen">

      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6 py-32">
        <div className="absolute inset-0 z-[1] bg-ink-void/60 pointer-events-none" />
        <div className="ink-grain absolute inset-0 z-[2] pointer-events-none opacity-30" />
        <div className="absolute inset-0 z-[3] flex items-center justify-center select-none pointer-events-none" aria-hidden="true">
          <span className="audio-hero-ghost font-thunder uppercase text-ink-paper/[0.03] leading-none">AUDIO</span>
        </div>
        <div className="relative z-[4] flex flex-col items-center text-center gap-8 max-w-2xl">
          <Label variant="tag" className="text-ink-green">DYFF AUDIO SERIES</Label>
          <Thunder as="h1" size="hero" weight={400} className="text-ink-paper leading-none">
            STORIES<br />THAT BREATHE
          </Thunder>
          <div className="w-full max-w-xs">
            <SoundwaveHero />
          </div>
          <Body size="lg" className="text-ink-white/80 max-w-[38ch] leading-relaxed">
            Cinematic audio dramas produced with original scores.
            Every episode is written before it is recorded.
          </Body>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-12 h-px bg-ink-green" />
            <span className="font-mono text-ink-ash/60 text-[0.6rem] tracking-[0.25em] uppercase">
              {series.length} Active Series
            </span>
            <div className="w-12 h-px bg-ink-green" />
          </div>
        </div>
      </section>

      <AudioShelf />

      <section className="relative py-16 md:py-24 border-t border-ink-ash/10 bg-[#080808]/80">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Label variant="tag" className="text-ink-ash/60 mb-3">CURRENT CATALOGUE</Label>
              <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none">ALL SERIES</Thunder>
            </div>
            <div className="hidden md:flex items-center gap-2 text-ink-ash/40">
              <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase">Scroll to explore</span>
              <svg width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
                <path d="M0 4H22M22 4L19 1M22 4L19 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div ref={gridRef} className="audio-shelf">
            {series.map(s => (
              <SeriesTile key={s.slug} series={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-ash/10 py-16 px-6 md:px-10 bg-[#080808]/70">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Thunder as="p" size="display" weight={400} className="text-ink-paper/20 leading-none select-none" aria-hidden="true">
            THE INK<br />SPEAKS.
          </Thunder>
          <Body size="base" className="text-ink-white/80 max-w-sm leading-relaxed">
            Every DYFF Audio episode is written as prose first.
            The score is composed after the script. The performance is recorded last.
            Ink before sound.
          </Body>
        </div>
      </section>

    </main>
  )
}
