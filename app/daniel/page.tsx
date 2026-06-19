'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT     = '#8b0000'
const SECTION_BG = 'rgba(8, 8, 8, 0.78)'

// ── Data ──────────────────────────────────────────────────────────────────────

const DISCIPLINES = [
  { icon: '◈', title: 'TRADITIONAL & DIGITAL ART',  tags: ['Illustration', 'Character Design', 'Concept Art', 'DYFF Art Style'] },
  { icon: '♫', title: 'MUSIC PRODUCTION',            tags: ['Beat Making', 'Composition', 'Arrangement', 'Mixing', 'Mastering'] },
  { icon: '◉', title: 'SOUND ENGINEERING',           tags: ['Recording', 'Sound Design', 'Foley', 'Post-Production', 'Podcast Production'] },
  { icon: '△', title: 'ANIMATION & VIDEO',           tags: ['Animation Direction', 'Video Editing', 'Video Production', 'YouTube'] },
  { icon: '✦', title: 'WRITING & STORYTELLING',      tags: ['Web Novels', 'Audio Drama Scripts', 'World-Building', 'Narrative Design'] },
  { icon: '⬡', title: 'CREATIVE DIRECTION',          tags: ['Visual Identity', 'Art Direction', 'DYFF Universe', 'Brand Storytelling'] },
]

const PROJECTS = [
  {
    num: '01', name: 'ESE AUDIO SERIES',
    desc: 'An original audio drama series. Full production, sound design, and original score — every element made in-house.',
    stack: ['Music Production', 'Sound Engineering', 'Narrative Writing'],
    href: 'https://open.spotify.com/show/5aMvAXUptIT5uOoA3S5BzX',
    accent: ACCENT,
  },
  {
    num: '02', name: 'LEGEND OF LEVITICUS',
    desc: 'Audio series — written, produced, and scored by Nobu Savage. A world of myth and consequence.',
    stack: ['Writing', 'Music Production', 'Sound Design'],
    href: 'https://open.spotify.com/show/7ICrWvQyjyBzHidiOOkg0s',
    accent: ACCENT,
  },
  {
    num: '03', name: 'ESE ALBUM SOUNDTRACK',
    desc: 'Original soundtrack album for the ESE universe. Composed and engineered independently from concept to master.',
    stack: ['Music Production', 'Composition', 'Mixing', 'Mastering'],
    href: 'https://open.spotify.com/album/57utUjzbYMmiRm6wbsAHY0',
    accent: ACCENT,
  },
  {
    num: '04', name: 'DYFF WRITTEN CATALOGUE',
    desc: 'Author of every story in the DYFF universe — web novels, scripts, and audio drama that shaped the lore.',
    stack: ['Writing', 'World-Building', 'Narrative Design'],
    href: 'https://www.webnovel.com/book/35220473700035405',
    accent: ACCENT,
  },
]

const TOOL_ROW_A = [
  'Traditional Drawing', 'Digital Illustration', 'Procreate', 'Character Design',
  'FL Studio', 'Logic Pro', 'Ableton', 'Adobe Suite',
]
const TOOL_ROW_B = [
  'Sound Design', 'Foley', 'Mixing', 'Mastering', 'Premiere Pro',
  'After Effects', 'DaVinci Resolve', 'Script Writing', 'World-Building',
]

const VISUAL_TILES = [
  { label: 'INSTAGRAM — @NOBUSAVAGE',  href: 'https://www.instagram.com/nobusavage/',                         platform: 'Open on Instagram'  },
  { label: 'DYFF STUDIO YOUTUBE',      href: 'https://www.youtube.com/@DYFFSTUDIO/videos',                   platform: 'Open on YouTube'    },
  { label: 'ESE ON SPOTIFY',           href: 'https://open.spotify.com/show/5aMvAXUptIT5uOoA3S5BzX',        platform: 'Listen on Spotify'  },
  { label: 'LEGEND OF LEVITICUS',      href: 'https://open.spotify.com/show/7ICrWvQyjyBzHidiOOkg0s',        platform: 'Listen on Spotify'  },
  { label: 'DYFF PODCAST',             href: 'https://open.spotify.com/show/25CaOf4MIpOASbYbFz0a0Z',        platform: 'Listen on Spotify'  },
]

const STATEMENT =
  "Every story I write, I can also draw, score, and produce. The work doesn't stop at the page."

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-thunder text-[0.9rem] tracking-[0.3em] uppercase mb-8" style={{ color: ACCENT }}>
      {children}
    </p>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DanielPage() {
  const [revealed, setRevealed] = useState(false)
  const [openIdx, setOpenIdx]   = useState<number | null>(null)

  const statRef        = useRef<HTMLParagraphElement>(null)
  const projSectionRef = useRef<HTMLElement>(null)
  const projPanelsRef  = useRef<HTMLDivElement>(null)

  // Hero reveal
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(t)
  }, [])

  // GSAP — statement word-by-word
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (statRef.current) {
        gsap.fromTo(
          statRef.current.querySelectorAll('.d-word'),
          { opacity: 0, y: 12, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.6, stagger: 0.05, ease: 'power2.out',
            scrollTrigger: { trigger: statRef.current, start: 'top 72%', toggleActions: 'play none none none' },
          },
        )
      }
    })
    return () => ctx.revert()
  }, [])

  // Sticky stack — Selected Work
  useEffect(() => {
    if (!projSectionRef.current || !projPanelsRef.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const ctx = gsap.context(() => {
        gsap.to(projPanelsRef.current, {
          y:    () => -(window.innerHeight * (PROJECTS.length - 1)),
          ease: 'none',
          scrollTrigger: {
            trigger:             projSectionRef.current,
            start:               'top top',
            end:                 () => `+=${window.innerHeight * (PROJECTS.length - 1)}`,
            scrub:               true,
            pin:                 true,
            pinType:             'transform',
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
    <div style={{ color: '#ffffff' }}>

      {/* Marquee keyframes + crimson flood class */}
      <style>{`
        @keyframes d-marquee     { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes d-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .daniel-flood {
          position: relative;
          overflow: hidden;
        }
        .daniel-flood::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #8b0000;
          clip-path: inset(100% 0 0 0);
          transition: clip-path 0.4s cubic-bezier(0.76, 0, 0.24, 1);
          z-index: 0;
        }
        .daniel-flood:hover::before {
          clip-path: inset(0 0 0 0);
        }
        .daniel-flood > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden">

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
          <p className="font-thunder text-[0.9rem] tracking-[0.35em] uppercase" style={{ color: ACCENT }}>
            Artist · Author · Producer
          </p>

          <h1 className="font-thunder uppercase leading-[0.88] select-none cursor-default">
            <span
              className={`block ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{ fontSize: 'clamp(3rem, 14vw, 16rem)', animationDelay: '0s', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.9)' }}
            >
              DANIEL
            </span>
            <span
              className={`block ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{ fontSize: 'clamp(3rem, 14vw, 16rem)', animationDelay: '0.22s', color: 'transparent', WebkitTextStroke: `1.5px ${ACCENT}` }}
            >
              OCHONOGOR
            </span>
          </h1>

          <p className="font-serif italic" style={{ color: ACCENT, fontSize: '1.4rem', letterSpacing: '0.2em' }}>
            Nobu Savage
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="font-thunder text-white/60 text-[0.85rem] tracking-[0.2em] uppercase">
            Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Creator &amp; Co-founder
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/nobusavage/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2z" />
              </svg>
              Instagram
            </a>
            <a href="https://open.spotify.com/artist/0MFEwGW9oFNoBrCMPoxnkB" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
            <a href="https://www.youtube.com/@DYFFSTUDIO/videos" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M23 7s-.3-1.8-1-2.6c-1-.9-2-.9-2.5-1C17 3.3 12 3.3 12 3.3s-5 0-7.5.1C4 3.5 3 3.5 2 4.4 1.3 5.2 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 1.8 1 2.6c1 .9 2.2.8 2.8.9C6.7 21 12 21 12 21s5 0 7.5-.2c.5 0 1.5-.1 2.5-1 .7-.7 1-2.5 1-2.5s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zm-13.5 8.5v-7.3l6.7 3.7-6.7 3.6z" />
              </svg>
              YouTube
            </a>
            <a href="https://www.webnovel.com/book/35220473700035405" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase transition-colors duration-200"
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
              </svg>
              Webnovel
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10" style={{ background: ACCENT, animation: 'ink-drip-fall 3s ease-in-out infinite' }} />
          <ChevronDown size={14} className="-mt-4 animate-bounce" style={{ color: ACCENT }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — STATEMENT
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20 border-t border-white/5" style={{ background: SECTION_BG }}>
        <div className="max-w-4xl mx-auto">
          <p
            ref={statRef}
            className="font-thunder uppercase text-white leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', wordSpacing: '0.05em' }}
          >
            {STATEMENT.split(' ').map((word, i) => (
              <span key={i} className="d-word inline-block" style={{ marginRight: '0.28em', opacity: 0 }}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3 — DISCIPLINES (TIMELINE)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-white/5" style={{ background: SECTION_BG }}>
        <SectionLabel>Disciplines</SectionLabel>

        <div className="relative max-w-[860px]">
          {/* Left spine */}
          <div
            className="absolute top-3 bottom-0 w-px pointer-events-none"
            style={{
              left: '6px',
              background: `linear-gradient(to bottom, ${ACCENT} 0%, rgba(139,0,0,0.3) 55%, rgba(255,255,255,0.04) 100%)`,
            }}
            aria-hidden="true"
          />

          {DISCIPLINES.map((disc, i) => (
            <DanielTimelineItem key={i} {...disc} index={i} isLast={i === DISCIPLINES.length - 1} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4 — SELECTED WORK (STICKY STACK)
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={projSectionRef}
        id="selected-work"
        className="border-t border-white/5"
        style={{ background: SECTION_BG }}
      >
        <div className="narrative-inner h-screen flex">

          {/* LEFT — static */}
          <div className="hidden md:flex w-[40%] h-full flex-col justify-center px-12 lg:px-20 border-r border-white/5 relative">
            <p className="font-thunder text-[0.9rem] tracking-[0.3em] uppercase mb-8" style={{ color: ACCENT }}>
              Selected Work
            </p>
            <h2
              className="font-thunder uppercase text-white leading-none"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 6rem)' }}
            >
              BUILDING<br />WORLDS<br />THROUGH<br />SOUND.
            </h2>
            <div className="w-14 h-[2px] mt-8" style={{ background: ACCENT }} />
            <div className="absolute bottom-10 left-12 opacity-50">
              <div className="w-px h-16" style={{ background: `linear-gradient(to bottom, ${ACCENT}, transparent)` }} />
            </div>
          </div>

          {/* RIGHT — panels scroll via GSAP */}
          <div className="flex-1 h-full overflow-hidden">
            <div ref={projPanelsRef} className="will-change-transform">
              {PROJECTS.map((proj, i) => (
                <div
                  key={proj.num}
                  className="h-screen flex flex-col justify-center px-8 md:px-14 lg:px-16 py-20 relative"
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 50% 50% at 70% 50%, ${proj.accent}0a, transparent)` }}
                    aria-hidden="true"
                  />

                  <span className="absolute top-8 right-8 font-thunder text-white/20 text-[0.75rem] tracking-[0.25em] uppercase">
                    0{i + 1}&nbsp;/&nbsp;0{PROJECTS.length}
                  </span>

                  <div className="w-[3px] h-16 mb-8 shrink-0 rounded-full" style={{ background: proj.accent }} />

                  <p className="font-thunder text-[0.85rem] tracking-[0.3em] uppercase mb-4" style={{ color: proj.accent }}>
                    {proj.num} — Project
                  </p>

                  <h3
                    className="font-thunder uppercase text-white leading-none mb-6"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}
                  >
                    {proj.name}
                  </h3>

                  <p
                    className="font-thunder uppercase text-white/75 mb-6 max-w-[38ch]"
                    style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}
                  >
                    {proj.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {proj.stack.map(t => (
                      <span
                        key={t}
                        className="font-thunder uppercase text-[0.72rem] tracking-wide text-white/50 border border-white/10 px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-thunder text-[0.9rem] tracking-[0.2em] uppercase hover:gap-4 transition-all duration-200 w-fit"
                    style={{ color: proj.accent }}
                  >
                    View Project <ArrowUpRight size={14} />
                  </a>

                  {i < PROJECTS.length - 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5 — TOOLS INFINITE MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-white/5 overflow-hidden" style={{ background: SECTION_BG }}>

        <div className="px-6 md:px-12 lg:px-20 mb-12">
          <SectionLabel>Tools &amp; Mediums</SectionLabel>
        </div>

        {/* Row A — left */}
        <div className="relative mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'd-marquee 38s linear infinite' }}
          >
            {[...TOOL_ROW_A, ...TOOL_ROW_A].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase text-white/60 px-6"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}>
                {item}
                <span className="text-[0.6em] select-none" style={{ color: ACCENT }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row B — right */}
        <div className="relative mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'd-marquee-rev 44s linear infinite' }}
          >
            {[...TOOL_ROW_B, ...TOOL_ROW_B].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase text-white/40 px-6"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.7rem)' }}>
                {item}
                <span className="text-white/20 text-[0.6em] select-none">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row C — smaller, crimson accents */}
        <div className="relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'd-marquee 52s linear infinite', animationDelay: '-12s' }}
          >
            {[...TOOL_ROW_A.slice(4), ...TOOL_ROW_B.slice(0, 5), ...TOOL_ROW_A.slice(4), ...TOOL_ROW_B.slice(0, 5)].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase px-6"
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)', color: i % 5 === 0 ? ACCENT : 'rgba(255,255,255,0.22)' }}>
                {item}
                <span className="text-white/10 text-[0.6em] select-none">—</span>
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6 — VISUAL WORK (ACCORDION)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20 border-t border-white/5">
        {/* transparent — blob shows through */}

        <div className="max-w-[820px] mx-auto">
          <SectionLabel>Visual &amp; Audio Work</SectionLabel>

          <div className="h-px bg-white/10 mb-0" />

          {VISUAL_TILES.map((tile, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group w-full flex items-center gap-6 py-7 md:py-9 text-left"
                >
                  <span className="font-thunder text-white/20 text-[0.75rem] tracking-[0.25em] shrink-0 w-6">
                    0{i + 1}
                  </span>

                  <span
                    className="font-thunder uppercase leading-none flex-1 transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(1.6rem, 4vw, 3.4rem)',
                      color: isOpen ? ACCENT : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {tile.label}
                  </span>

                  <span
                    className="shrink-0 w-8 h-8 flex items-center justify-center border"
                    style={{
                      borderColor: isOpen ? ACCENT : 'rgba(255,255,255,0.15)',
                      transform:   isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition:  'transform 0.4s cubic-bezier(0.76,0,0.24,1), border-color 0.3s',
                    }}
                    aria-hidden="true"
                  >
                    <span
                      className="font-thunder leading-none"
                      style={{ fontSize: '1.1rem', color: isOpen ? ACCENT : 'rgba(255,255,255,0.5)' }}
                    >
                      +
                    </span>
                  </span>
                </button>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.45s cubic-bezier(0.76,0,0.24,1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div className="pb-8 pl-12 flex items-center gap-8">
                      <a
                        href={tile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 font-thunder uppercase tracking-[0.2em] hover:gap-5 transition-all duration-200"
                        style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', color: ACCENT }}
                      >
                        {tile.platform} <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />
              </div>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 7 — CONTACT
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 border-t border-white/5 overflow-hidden" style={{ background: SECTION_BG }}>
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-thunder uppercase leading-none"
            style={{ fontSize: 'clamp(8rem, 28vw, 30rem)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
          >
            CONTACT
          </span>
        </div>

        <div className="relative z-[1] flex flex-col lg:flex-row items-start justify-between gap-16">
          <div>
            <p className="font-thunder text-[0.9rem] tracking-[0.35em] uppercase mb-6" style={{ color: ACCENT }}>
              Let&apos;s Create Something
            </p>
            <h2
              className="font-thunder uppercase leading-[0.85] text-white"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
              GET IN<br />
              <span style={{ color: ACCENT }}>TOUCH.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:justify-center lg:pt-12">
            <a
              href="mailto:daniel@dyff-studio.com"
              className="group font-thunder uppercase text-white/80 transition-colors duration-200 break-all"
              style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)' }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = '')}
            >
              daniel@dyff-studio.com
              <ArrowUpRight size={14} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://www.instagram.com/nobusavage/" target="_blank" rel="noopener noreferrer"
                className="daniel-flood border border-white/20 px-6 py-3 font-thunder text-[0.8rem] tracking-[0.2em] uppercase text-white">
                <span>Instagram</span>
              </a>
              <a href="https://open.spotify.com/artist/0MFEwGW9oFNoBrCMPoxnkB" target="_blank" rel="noopener noreferrer"
                className="daniel-flood border border-white/20 px-6 py-3 font-thunder text-[0.8rem] tracking-[0.2em] uppercase text-white">
                <span>Spotify</span>
              </a>
            </div>
            <p className="font-thunder text-white/40 text-[0.7rem] tracking-[0.18em] uppercase mt-2">
              Open for commissions · Collaborations · Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

// ── DanielTimelineItem ────────────────────────────────────────────────────────

interface DanielTimelineItemProps {
  icon:   string
  title:  string
  tags:   string[]
  index:  number
  isLast: boolean
}

function DanielTimelineItem({ icon, title, tags, index, isLast }: DanielTimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!itemRef.current) return
    const el = itemRef.current
    gsap.set(el, { opacity: 0, x: -50 })
    const st = ScrollTrigger.create({
      trigger: el,
      start:   'top 82%',
      onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' }),
    })
    return () => st.kill()
  }, [])

  return (
    <div
      ref={itemRef}
      className={`relative pl-11 md:pl-14 ${isLast ? 'pb-2' : 'pb-14 md:pb-18'}`}
    >
      {/* Node — glowing dot on the spine */}
      <div
        className="absolute left-0 top-[8px] w-3 h-3 rounded-full border-2"
        style={{
          borderColor: ACCENT,
          background:  'rgba(8,8,8,0.95)',
          boxShadow:   `0 0 12px rgba(139,0,0,0.55), 0 0 4px rgba(139,0,0,0.3)`,
        }}
        aria-hidden="true"
      />

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-5">
        <span className="font-thunder text-white/20 text-[0.65rem] tracking-[0.3em]">
          0{index + 1}
        </span>
        <span className="font-thunder text-[1.15rem] leading-none select-none" style={{ color: ACCENT }} aria-hidden="true">
          {icon}
        </span>
        <div className="flex-1 h-px bg-white/6 ml-1" />
      </div>

      {/* Discipline title */}
      <h3
        className="font-thunder uppercase text-white leading-none mb-5"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}
      >
        {title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="font-thunder uppercase text-white/38 text-[0.7rem] tracking-[0.15em]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
