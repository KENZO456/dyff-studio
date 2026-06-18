'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  { icon: '</>', title: 'FULL STACK DEVELOPMENT',  tags: ['React', 'Next.js', 'Supabase', 'API Integration'] },
  { icon: '⬡',  title: 'UI / UX DESIGN',           tags: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'] },
  { icon: '◈',  title: 'BRAND IDENTITY',            tags: ['Visual Systems', 'Typography', 'Color', 'Creative Direction'] },
  { icon: '△',  title: 'FRONTEND ENGINEERING',      tags: ['Three.js', 'GSAP', 'Framer Motion', 'Tailwind CSS'] },
  { icon: '◉',  title: 'AI-ASSISTED DEVELOPMENT',   tags: ['Claude Code', 'Lovable', 'AI Workflows', 'Prompt Engineering'] },
  { icon: '✦',  title: 'CREATIVE DIRECTION',        tags: ['Concept Development', 'Art Direction', 'Digital Storytelling'] },
]

const PROJECTS = [
  {
    num: '01', name: 'DYFF STUDIO',
    desc: 'Entertainment platform · Web novels, audio series, animations, marketplace.',
    stack: ['Next.js', 'Supabase', 'Three.js', 'GSAP'],
    href: 'https://dyff-studio.vercel.app/',
    accent: '#99ca45',
  },
  {
    num: '02', name: 'PETCONNECT',
    desc: 'Pet services platform connecting owners and providers across Lagos.',
    stack: ['Lovable', 'Supabase', 'AI-Assisted Dev'],
    href: 'https://pet-connect-lagos.lovable.app/',
    accent: '#c9a84c',
  },
  {
    num: '03', name: 'AI MAESTRO',
    desc: 'Brand identity and website for an AI integration services company.',
    stack: ['Next.js', 'Canva', 'Brand Design'],
    href: 'https://ai-maestro-website.vercel.app/',
    accent: '#a45cff',
  },
  {
    num: '04', name: 'ANIMEHUB',
    desc: 'Rebranding and frontend development for a pan-African anime fandom platform.',
    stack: ['React', 'UI/UX', 'Brand Strategy'],
    href: 'https://canva.link/600ficj8m7jfrkn',
    accent: '#ff4444',
  },
]

// All tech items flattened for the infinite marquee
const TECH_ROW_A = [
  'React.js', 'Next.js', 'Three.js', 'GSAP', 'Tailwind CSS', 'JavaScript',
  'Framer Motion', 'HTML5', 'CSS3', 'Supabase', 'Node.js',
]
const TECH_ROW_B = [
  'API Integration', 'Database Architecture', 'Canva', 'Affinity Designer',
  'Affinity Photo', 'Figma', 'WordPress', 'Claude AI', 'Claude Code', 'Lovable',
]

const PORTFOLIO_TILES = [
  { label: 'VIEW PORTFOLIO 01', href: 'https://canva.link/yt04lh5wo2d176z' },
  { label: 'VIEW PORTFOLIO 02', href: 'https://canva.link/3eqmlq8xa5bbsaj' },
  { label: 'VIEW PORTFOLIO 03', href: 'https://canva.link/78cqbj2rn591wvh' },
  { label: 'VIEW PORTFOLIO 04', href: 'https://canva.link/cqv7wsv1rbj5uz5' },
  { label: 'VIEW PORTFOLIO 05', href: 'https://canva.link/dgzzx6ghcb5p1xr' },
]

const STATEMENT =
  'I build digital experiences that live at the intersection of engineering and art. Every line of code is a brushstroke. Every interface, a composition.'

const SECTION_BG = 'rgba(8, 8, 8, 0.78)'

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-thunder text-ink-green text-[0.9rem] tracking-[0.3em] uppercase mb-8">
      {children}
    </p>
  )
}

// ── Page component ─────────────────────────────────────────────────────────────

export default function KennyPage() {
  const [revealed, setRevealed]   = useState(false)
  const [openIdx, setOpenIdx]     = useState<number | null>(null)

  const statRef        = useRef<HTMLParagraphElement>(null)
  const projSectionRef = useRef<HTMLElement>(null)
  const projPanelsRef  = useRef<HTMLDivElement>(null)

  // ── Hero reveal ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(t)
  }, [])

  // ── GSAP animations ──────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Statement word-by-word
      if (statRef.current) {
        gsap.fromTo(
          statRef.current.querySelectorAll('.k-word'),
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

  // ── Sticky stack — Selected Work ─────────────────────────────────────────
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

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden">

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <p className="font-thunder text-ink-green text-[0.9rem] tracking-[0.35em] uppercase">
            Creative Full Stack Developer
          </p>

          <h1 className="font-thunder uppercase leading-[0.88] select-none cursor-default">
            <span
              className={`block ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{ fontSize: 'clamp(3rem, 11vw, 13rem)', animationDelay: '0s', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.9)' }}
            >
              KENNY
            </span>
            <span
              className={`block ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{ fontSize: 'clamp(3rem, 11vw, 13rem)', animationDelay: '0.22s', color: 'transparent', WebkitTextStroke: '1.5px #99ca45' }}
            >
              OCHONOGOR
            </span>
          </h1>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="font-thunder text-white/60 text-[0.85rem] tracking-[0.2em] uppercase">
            Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Available for projects
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
              LinkedIn
            </a>
            <a href="#selected-work"
              className="flex items-center gap-2 font-thunder text-white/60 text-[0.8rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200">
              <ArrowUpRight size={13} /> Portfolio
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-ink-green" style={{ animation: 'ink-drip-fall 3s ease-in-out infinite' }} />
          <ChevronDown size={14} className="text-ink-green -mt-4 animate-bounce" />
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
              <span key={i} className="k-word inline-block" style={{ marginRight: '0.28em', opacity: 0 }}>
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
          {/* Ink line — left spine */}
          <div
            className="absolute top-3 bottom-0 w-px pointer-events-none"
            style={{
              left: '6px',
              background: 'linear-gradient(to bottom, #99ca45 0%, rgba(153,202,69,0.3) 55%, rgba(255,255,255,0.04) 100%)',
            }}
            aria-hidden="true"
          />

          {SKILLS.map((skill, i) => (
            <TimelineItem key={i} {...skill} index={i} isLast={i === SKILLS.length - 1} />
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
            <p className="font-thunder text-ink-green text-[0.9rem] tracking-[0.3em] uppercase mb-8">
              Selected Work
            </p>
            <h2
              className="font-thunder uppercase text-white leading-none"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 6rem)' }}
            >
              BUILDING<br />WORLDS<br />THROUGH<br />CODE.
            </h2>
            <div className="w-14 h-[2px] bg-ink-green mt-8" />
            <div className="absolute bottom-10 left-12 opacity-50">
              <div className="w-px h-16 bg-gradient-to-b from-ink-green to-transparent" />
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
                  {/* Subtle accent glow */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 50% 50% at 70% 50%, ${proj.accent}0a, transparent)` }}
                    aria-hidden="true"
                  />

                  {/* Counter */}
                  <span className="absolute top-8 right-8 font-thunder text-white/20 text-[0.75rem] tracking-[0.25em] uppercase">
                    0{i + 1}&nbsp;/&nbsp;0{PROJECTS.length}
                  </span>

                  {/* Accent bar */}
                  <div className="w-[3px] h-16 mb-8 shrink-0 rounded-full" style={{ background: proj.accent }} />

                  {/* Label */}
                  <p
                    className="font-thunder text-[0.85rem] tracking-[0.3em] uppercase mb-4"
                    style={{ color: proj.accent }}
                  >
                    {proj.num} — Project
                  </p>

                  {/* Name */}
                  <h3
                    className="font-thunder uppercase text-white leading-none mb-6"
                    style={{ fontSize: 'clamp(2.8rem, 7vw, 8rem)' }}
                  >
                    {proj.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-thunder uppercase text-white/75 mb-6 max-w-[38ch]"
                    style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)' }}
                  >
                    {proj.desc}
                  </p>

                  {/* Stack tags */}
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

                  {/* CTA */}
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-thunder text-[0.9rem] tracking-[0.2em] uppercase
                      hover:gap-4 transition-all duration-200 w-fit"
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
          SECTION 5 — TECH INFINITE MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-white/5 overflow-hidden" style={{ background: SECTION_BG }}>

        {/* Inject marquee keyframes */}
        <style>{`
          @keyframes k-marquee     { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes k-marquee-rev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        `}</style>

        <div className="px-6 md:px-12 lg:px-20 mb-12">
          <SectionLabel>Tools &amp; Technologies</SectionLabel>
        </div>

        {/* Row A — left */}
        <div className="relative mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'k-marquee 38s linear infinite' }}
          >
            {[...TECH_ROW_A, ...TECH_ROW_A].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase text-white/60 px-6"
                style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}>
                {item}
                <span className="text-ink-green text-[0.6em] select-none">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row B — right */}
        <div className="relative mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'k-marquee-rev 44s linear infinite' }}
          >
            {[...TECH_ROW_B, ...TECH_ROW_B].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase text-white/40 px-6"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.7rem)' }}>
                {item}
                <span className="text-ink-green/40 text-[0.6em] select-none">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row A again — same direction, smaller, with green items */}
        <div className="relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div
            className="flex whitespace-nowrap"
            style={{ animation: 'k-marquee 52s linear infinite', animationDelay: '-12s' }}
          >
            {[...TECH_ROW_A.slice(5), ...TECH_ROW_B.slice(0, 6), ...TECH_ROW_A.slice(5), ...TECH_ROW_B.slice(0, 6)].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 font-thunder uppercase px-6"
                style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)', color: i % 5 === 0 ? '#99ca45' : 'rgba(255,255,255,0.22)' }}>
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
          <SectionLabel>Visual Work</SectionLabel>

          {/* Top rule */}
          <div className="h-px bg-white/10 mb-0" />

          {PORTFOLIO_TILES.map((tile, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i}>
                {/* Header row */}
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group w-full flex items-center gap-6 py-7 md:py-9 text-left"
                >
                  {/* Index */}
                  <span className="font-thunder text-white/20 text-[0.75rem] tracking-[0.25em] shrink-0 w-6">
                    0{i + 1}
                  </span>

                  {/* Title */}
                  <span
                    className="font-thunder uppercase leading-none flex-1 transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(1.6rem, 4vw, 3.4rem)',
                      color: isOpen ? '#99ca45' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {tile.label}
                  </span>

                  {/* Expand icon */}
                  <span
                    className="shrink-0 w-8 h-8 flex items-center justify-center border border-white/15 transition-all duration-400"
                    style={{
                      borderColor: isOpen ? '#99ca45' : 'rgba(255,255,255,0.15)',
                      transform:   isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition:  'transform 0.4s cubic-bezier(0.76,0,0.24,1), border-color 0.3s',
                    }}
                    aria-hidden="true"
                  >
                    <span
                      className="font-thunder leading-none"
                      style={{ fontSize: '1.1rem', color: isOpen ? '#99ca45' : 'rgba(255,255,255,0.5)' }}
                    >
                      +
                    </span>
                  </span>
                </button>

                {/* Accordion body — CSS grid trick for smooth height */}
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
                        className="inline-flex items-center gap-3 font-thunder uppercase text-ink-green tracking-[0.2em] hover:gap-5 transition-all duration-200"
                        style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}
                      >
                        Open on Canva <ArrowUpRight size={14} />
                      </a>
                      <span className="font-thunder text-white/20 text-[0.65rem] tracking-[0.2em] uppercase">
                        Visual Design · Canva
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom rule */}
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
            <p className="font-thunder text-ink-green text-[0.9rem] tracking-[0.35em] uppercase mb-6">
              Let&apos;s Build Something
            </p>
            <h2
              className="font-thunder uppercase leading-[0.85] text-white"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
              GET IN<br />
              <span className="text-ink-green">TOUCH.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:justify-center lg:pt-12">
            <a
              href="mailto:kennyprince25.kp@gmail.com"
              className="group font-thunder uppercase text-white/80 hover:text-ink-green transition-colors duration-200 break-all"
              style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)' }}
            >
              kennyprince25.kp@gmail.com
              <ArrowUpRight size={14} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="ink-flood-up border border-white/20 px-6 py-3 font-thunder text-[0.8rem] tracking-[0.2em] uppercase text-white">
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="ink-flood-up border border-white/20 px-6 py-3 font-thunder text-[0.8rem] tracking-[0.2em] uppercase text-white">
                <span>GitHub</span>
              </a>
            </div>
            <p className="font-thunder text-white/40 text-[0.7rem] tracking-[0.18em] uppercase mt-2">
              Available for freelance · Remote-friendly · Based in Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

// ── SkillCard ────────────────────────────────────────────────────────────────

// ── TimelineItem ─────────────────────────────────────────────────────────────

interface TimelineItemProps {
  icon:   string
  title:  string
  tags:   string[]
  index:  number
  isLast: boolean
}

function TimelineItem({ icon, title, tags, index, isLast }: TimelineItemProps) {
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
        className="absolute left-0 top-[8px] w-3 h-3 rounded-full border-2 border-ink-green"
        style={{
          background:  'rgba(8,8,8,0.95)',
          boxShadow:   '0 0 12px rgba(153,202,69,0.55), 0 0 4px rgba(153,202,69,0.3)',
        }}
        aria-hidden="true"
      />

      {/* Meta row — index + icon + hairline */}
      <div className="flex items-center gap-3 mb-5">
        <span className="font-thunder text-white/20 text-[0.65rem] tracking-[0.3em]">
          0{index + 1}
        </span>
        <span className="font-thunder text-ink-green text-[1.15rem] leading-none select-none" aria-hidden="true">
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
