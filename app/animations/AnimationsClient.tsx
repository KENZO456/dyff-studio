'use client'

import {
  useRef, useEffect, useState, useCallback,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play }          from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import type { Animation } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

type FilterValue = 'ALL' | Animation['type']

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'ALL',     label: 'ALL'      },
  { value: 'series',  label: 'SERIES'   },
  { value: 'short',   label: 'SHORTS'   },
  { value: 'trailer', label: 'TRAILERS' },
  { value: 'teaser',  label: 'TEASERS'  },
]

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be'))    return u.pathname.slice(1)
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  }
  return null
}

function typeTagClass(type: Animation['type']) {
  if (type === 'short')  return 'anim-cat-tag anim-cat-tag-shorts'
  if (type === 'trailer' || type === 'teaser') return 'anim-cat-tag anim-cat-tag-trailer'
  return 'anim-cat-tag'
}

interface FilterTabsProps {
  active:   FilterValue
  onChange: (val: FilterValue) => void
}

function FilterTabs({ active, onChange }: FilterTabsProps) {
  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([])
  const underlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const first = tabRefs.current[0]
    if (!first || !underlineRef.current) return
    gsap.set(underlineRef.current, { x: first.offsetLeft, width: first.offsetWidth })
  }, [])

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>, val: FilterValue, idx: number) => {
    const btn = tabRefs.current[idx]
    if (!btn || !underlineRef.current) return
    gsap.to(underlineRef.current, {
      x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.3, ease: 'power2.inOut',
    })
    onChange(val)
  }

  return (
    <div className="anim-filter-tabs">
      {FILTERS.map(({ value, label }, i) => (
        <button
          key={value}
          ref={el => { tabRefs.current[i] = el }}
          className={`anim-filter-tab${active === value ? ' is-active' : ''}`}
          onClick={e => handleClick(e, value, i)}
          aria-pressed={active === value}
        >
          {label}
        </button>
      ))}
      <div ref={underlineRef} className="anim-filter-underline" aria-hidden="true" />
    </div>
  )
}

interface VideoCardProps {
  entry:    Animation
  isActive: boolean
  onPlay:   (entry: Animation, el: HTMLElement) => void
}

function VideoCard({ entry, isActive, onPlay }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  return (
    <div className="anim-card-wrapper" data-entry-id={entry.id}>
      <div
        ref={cardRef}
        className={`anim-card${isActive ? ' ring-1 ring-ink-green/60' : ''}`}
        onClick={() => cardRef.current && onPlay(entry, cardRef.current)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && cardRef.current) onPlay(entry, cardRef.current) }}
        aria-label={`Play ${entry.title}`}
      >
        <div className="anim-card-thumb relative">
          <Image
            src={entry.thumbnail_url}
            alt={`${entry.title} thumbnail`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2.5 right-2.5 z-[2] flex items-center gap-1.5">
            <span className="anim-runtime-pill">{entry.runtime}</span>
          </div>
          <div className="anim-card-play z-[3]" aria-hidden="true">
            <div className="w-11 h-11 rounded-full bg-ink-green/80 flex items-center justify-center">
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
          </div>
        </div>
        <div className="px-4 py-3.5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={typeTagClass(entry.type)}>{entry.type.toUpperCase()}</span>
          </div>
          <Thunder as="h3" size="card" weight={400} className="text-ink-paper leading-tight line-clamp-1">
            {entry.title}
          </Thunder>
          <p className="font-mono text-ink-ash/55 text-[0.58rem] tracking-wide leading-none line-clamp-1">
            {entry.description}
          </p>
        </div>
      </div>
    </div>
  )
}

interface FeaturedPlayerProps {
  entry:          Animation
  playerRef:      React.RefObject<HTMLDivElement>
  showIframe:     boolean
  onOverlayClick: () => void
}

function FeaturedPlayer({ entry, playerRef, showIframe, onOverlayClick }: FeaturedPlayerProps) {
  const youtubeId = extractYouTubeId(entry.video_url)
  return (
    <div ref={playerRef} className="anim-player anim-player-vignette relative w-full aspect-video bg-ink-void overflow-hidden">
      <Image src={entry.thumbnail_url} alt={entry.title} fill className="object-cover" draggable="false" priority />
      <div className="absolute inset-0 bg-ink-void/55 z-[1]" />
      {showIframe && youtubeId && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1`}
          title={entry.title}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="anim-player-iframe absolute inset-0 w-full h-full z-[4]"
        />
      )}
      {showIframe && !youtubeId && (
        <video
          src={entry.video_url}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="absolute inset-0 w-full h-full z-[4] object-cover"
        />
      )}
      {!showIframe && (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-5 cursor-pointer" onClick={onOverlayClick}>
          <button className="anim-play-btn" aria-label={`Play ${entry.title}`}>
            <Play size={26} fill="white" className="text-white ml-1" />
          </button>
          <div className="text-center">
            <Thunder as="p" size="card" weight={400} className="text-ink-paper leading-none mb-1">{entry.title}</Thunder>
            <p className="font-mono text-ink-ash/60 text-[0.6rem] tracking-[0.18em] uppercase">{entry.runtime}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AnimationsClient({ animations }: { animations: Animation[] }) {
  const firstEntry = animations[0]

  const [activeEntry,    setActiveEntry]    = useState<Animation | null>(firstEntry ?? null)
  const [showIframe,     setShowIframe]     = useState(true)   // autoplay on load
  const [activeCategory, setActiveCategory] = useState<FilterValue>('ALL')

  const heroRef          = useRef<HTMLElement>(null)
  const playerSectionRef = useRef<HTMLDivElement>(null)
  const playerRef        = useRef<HTMLDivElement>(null)
  const gridRef          = useRef<HTMLDivElement>(null)
  const flipTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filterInitRef    = useRef(false)

  const filteredEntries = activeCategory === 'ALL'
    ? animations
    : animations.filter(a => a.type === activeCategory)

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroTextY = useTransform(heroScroll, [0, 1], ['0%', '28%'])

  useEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.anim-card-wrapper', {
        opacity: 0, y: 45, stagger: 0.08, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!filterInitRef.current) { filterInitRef.current = true; return }
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.anim-card-wrapper')
    gsap.from(cards, { opacity: 0, y: 22, stagger: 0.06, duration: 0.45, ease: 'power2.out', overwrite: true })
  }, [activeCategory])

  useEffect(() => {
    return () => { if (flipTimerRef.current) clearTimeout(flipTimerRef.current) }
  }, [])

  const handleCardPlay = useCallback((entry: Animation, cardEl: HTMLElement) => {
    if (entry.id === activeEntry?.id) {
      playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const cardRect = cardEl.getBoundingClientRect()
    setActiveEntry(entry)
    setShowIframe(false)

    const clone = document.createElement('div')
    clone.setAttribute('aria-hidden', 'true')
    Object.assign(clone.style, {
      position: 'fixed', left: `${cardRect.left}px`, top: `${cardRect.top}px`,
      width: `${cardRect.width}px`, height: `${cardRect.height}px`,
      backgroundImage: `url('${entry.thumbnail_url}')`, backgroundSize: 'cover',
      backgroundPosition: 'center', zIndex: '1000', borderRadius: '4px',
      pointerEvents: 'none', willChange: 'transform',
    })
    document.body.appendChild(clone)

    const playerTop     = playerSectionRef.current?.getBoundingClientRect().top ?? -1
    const alreadyInView = playerTop >= 0 && playerTop < window.innerHeight * 0.5
    const scrollDelay   = alreadyInView ? 80 : 650

    playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current)
    flipTimerRef.current = setTimeout(() => {
      if (!playerRef.current) { document.body.removeChild(clone); return }
      const playerRect = playerRef.current.getBoundingClientRect()
      const startCX = cardRect.left + cardRect.width / 2
      const startCY = cardRect.top  + cardRect.height / 2
      const endCX   = playerRect.left + playerRect.width / 2
      const endCY   = playerRect.top  + playerRect.height / 2
      gsap.to(clone, {
        x: endCX - startCX, y: endCY - startCY,
        scaleX: playerRect.width / cardRect.width, scaleY: playerRect.height / cardRect.height,
        transformOrigin: 'center center', duration: 0.52, ease: 'power3.inOut',
        onComplete: () => {
          document.body.removeChild(clone)
          if (playerRef.current) gsap.fromTo(playerRef.current, { opacity: 0.4 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
        },
      })
    }, scrollDelay)
  }, [activeEntry?.id])

  const handleFilterChange = useCallback((val: FilterValue) => {
    setActiveCategory(val)
    setShowIframe(false)
  }, [])

  return (
    <main className="min-h-screen bg-ink-void">

      <section ref={heroRef} className="film-grain relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="anim-hero-bg absolute inset-0 z-0" />
        <Image src="/Images/bg (4).jpg" alt="" fill className="object-cover opacity-15 z-0" aria-hidden="true" />
        <div className="anim-hero-glow absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 z-[2] flex items-center justify-center select-none pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="anim-hero-ghost font-thunder uppercase text-ink-paper/[0.025] leading-none tracking-tight">MOTION</span>
        </div>

        <motion.div className="relative z-[3] flex flex-col items-center text-center gap-6 px-6" style={{ y: heroTextY }}>
          <Label variant="tag" className="text-ink-green">DYFF ANIMATIONS</Label>
          <Thunder as="h1" size="hero" weight={400} className="text-ink-paper leading-none">THE INK<br />MOVES.</Thunder>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-px bg-ink-green" />
            <span className="font-mono text-ink-ash/50 text-[0.6rem] tracking-[0.25em] uppercase">
              {animations.length} Productions
            </span>
            <div className="w-10 h-px bg-ink-green" />
          </div>
          <Body size="base" className="text-ink-white/80 max-w-[40ch] leading-relaxed mt-1">
            Animation is where the DYFF Art Style comes fully alive. The same characters
            from the books and audio series — now in motion. Built by the same hands that
            wrote the stories. This is the beginning of a much larger animated universe.
          </Body>
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 z-[4] h-28 bg-gradient-to-t from-ink-void to-transparent pointer-events-none" />
      </section>

      {activeEntry && (
        <div ref={playerSectionRef} className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 -mt-10 mb-16 md:mb-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-[3px] h-5 rounded-full bg-ink-green shrink-0" />
            <Label variant="tag" className="text-ink-ash/60">NOW PLAYING</Label>
            <span className="font-mono text-ink-ash/40 text-[0.55rem] tracking-wider uppercase">
              {activeEntry.title}
            </span>
          </div>

          <FeaturedPlayer
            entry={activeEntry}
            playerRef={playerRef}
            showIframe={showIframe}
            onOverlayClick={() => setShowIframe(true)}
          />

          <div className="flex items-start justify-between gap-4 mt-4 px-1">
            <div>
              <Thunder as="h2" size="card" weight={400} className="text-ink-paper leading-tight mb-1">{activeEntry.title}</Thunder>
              <p className="font-mono text-ink-ash/55 text-[0.6rem] tracking-wide">
                {activeEntry.runtime}
              </p>
            </div>
            <span className={typeTagClass(activeEntry.type)}>{activeEntry.type.toUpperCase()}</span>
          </div>

          <Body size="sm" className="text-ink-paper/70 mt-3 px-1 leading-relaxed max-w-xl">{activeEntry.description}</Body>
        </div>
      )}

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <Label variant="tag" className="text-ink-ash/50 mb-3">CATALOGUE</Label>
            <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none">ALL PRODUCTIONS</Thunder>
          </div>
          <FilterTabs active={activeCategory} onChange={handleFilterChange} />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredEntries.map(entry => (
            <VideoCard
              key={entry.id}
              entry={entry}
              isActive={entry.id === activeEntry?.id}
              onPlay={handleCardPlay}
            />
          ))}
          {filteredEntries.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
              <Thunder as="p" size="card" weight={400} className="text-ink-paper/20 leading-none">NOTHING HERE YET</Thunder>
              <Body size="sm" className="text-ink-ash/40">No {activeCategory} entries in the catalogue.</Body>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
