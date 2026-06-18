'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// ── Data ─────────────────────────────────────────────────────────────────────

const SKILLS = [
  {
    icon: '</>',
    title: 'FULL STACK DEVELOPMENT',
    tags: ['React', 'Next.js', 'Supabase', 'API Integration'],
  },
  {
    icon: '⬡',
    title: 'UI / UX DESIGN',
    tags: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    icon: '◈',
    title: 'BRAND IDENTITY',
    tags: ['Visual Systems', 'Typography', 'Color', 'Creative Direction'],
  },
  {
    icon: '△',
    title: 'FRONTEND ENGINEERING',
    tags: ['Three.js', 'GSAP', 'Framer Motion', 'Tailwind CSS'],
  },
  {
    icon: '◉',
    title: 'AI-ASSISTED DEVELOPMENT',
    tags: ['Claude Code', 'Lovable', 'AI Workflows', 'Prompt Engineering'],
  },
  {
    icon: '✦',
    title: 'CREATIVE DIRECTION',
    tags: ['Concept Development', 'Art Direction', 'Digital Storytelling'],
  },
]

const PROJECTS = [
  {
    num: '01',
    name: 'DYFF STUDIO',
    desc: 'Entertainment platform · Web novels, audio series, animations, marketplace.',
    stack: ['Next.js', 'Supabase', 'Three.js', 'GSAP'],
    href: 'https://dyff-studio.vercel.app/',
    accent: '#99ca45',
    bg: 'linear-gradient(135deg, #0e1a09 0%, #0c0c0c 100%)',
  },
  {
    num: '02',
    name: 'PETCONNECT',
    desc: 'Pet services platform connecting owners and providers across Lagos.',
    stack: ['Lovable', 'Supabase', 'AI-Assisted Dev'],
    href: 'https://pet-connect-lagos.lovable.app/',
    accent: '#c9a84c',
    bg: 'linear-gradient(135deg, #1a150a 0%, #0c0c0c 100%)',
  },
  {
    num: '03',
    name: 'AI MAESTRO',
    desc: 'Brand identity and website for an AI integration services company.',
    stack: ['Next.js', 'Canva', 'Brand Design'],
    href: 'https://ai-maestro-website.vercel.app/',
    accent: '#a45cff',
    bg: 'linear-gradient(135deg, #120a1a 0%, #0c0c0c 100%)',
  },
  {
    num: '04',
    name: 'ANIMEHUB',
    desc: 'Rebranding and frontend development for a pan-African anime fandom platform.',
    stack: ['React', 'UI/UX', 'Brand Strategy'],
    href: 'https://canva.link/600ficj8m7jfrkn',
    accent: '#ff4444',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #0c0c0c 100%)',
  },
]

const TECH_GROUPS = [
  {
    label: 'FRONTEND',
    items: [
      { name: 'React.js',      size: 'lg' },
      { name: 'Next.js',       size: 'lg' },
      { name: 'Three.js',      size: 'lg' },
      { name: 'GSAP',          size: 'lg' },
      { name: 'Tailwind CSS',  size: 'lg' },
      { name: 'JavaScript',    size: 'md' },
      { name: 'Framer Motion', size: 'md' },
      { name: 'HTML5',         size: 'sm' },
      { name: 'CSS3',          size: 'sm' },
    ],
  },
  {
    label: 'BACKEND',
    items: [
      { name: 'Supabase',             size: 'lg' },
      { name: 'Node.js',              size: 'md' },
      { name: 'API Integration',      size: 'md' },
      { name: 'Database Architecture', size: 'sm' },
    ],
  },
  {
    label: 'DESIGN',
    items: [
      { name: 'Canva',             size: 'lg' },
      { name: 'Affinity Designer', size: 'md' },
      { name: 'Affinity Photo',    size: 'md' },
      { name: 'Figma',             size: 'sm' },
      { name: 'WordPress',         size: 'sm' },
    ],
  },
  {
    label: 'AI',
    items: [
      { name: 'Claude AI',   size: 'lg' },
      { name: 'Claude Code', size: 'lg' },
      { name: 'Lovable',     size: 'md' },
    ],
  },
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-ink-green text-[0.65rem] tracking-[0.3em] uppercase mb-8">
      {children}
    </p>
  )
}

function PillSize(size: string) {
  if (size === 'lg') return 'text-[0.85rem] px-4 py-2'
  if (size === 'md') return 'text-[0.75rem] px-3 py-1.5'
  return 'text-[0.65rem] px-2.5 py-1'
}

// ── Page component ────────────────────────────────────────────────────────────

export default function KennyPage() {
  const [revealed, setRevealed] = useState(false)

  // Refs
  const turbRef     = useRef<SVGFETurbulenceElement>(null)
  const dispRef     = useRef<SVGFEDisplacementMapElement>(null)
  const inkVal      = useRef({ v: 0 })
  const hoverTween  = useRef<gsap.core.Tween | null>(null)
  const statRef     = useRef<HTMLParagraphElement>(null)
  const skillsRef   = useRef<HTMLDivElement>(null)
  const projRef     = useRef<HTMLDivElement>(null)
  const techRef     = useRef<HTMLDivElement>(null)
  const thumbRefs   = useRef<(HTMLDivElement | null)[]>([])
  const projNumRefs = useRef<(HTMLDivElement | null)[]>([])

  const techInView = useInView(techRef, { once: true, margin: '-80px 0px' })

  // ── Ink turbulence on name hover ─────────────────────────────────────────
  const handleNameEnter = useCallback(() => {
    hoverTween.current?.kill()
    hoverTween.current = gsap.to(inkVal.current, {
      v: 1, duration: 0.55, ease: 'power2.inOut',
      onUpdate: () => {
        const v = inkVal.current.v
        turbRef.current?.setAttribute('baseFrequency', `${(0.01 + v * 0.04).toFixed(4)} ${(0.008 + v * 0.03).toFixed(4)}`)
        dispRef.current?.setAttribute('scale', String((v * 16).toFixed(1)))
      },
    })
  }, [])

  const handleNameLeave = useCallback(() => {
    hoverTween.current?.kill()
    hoverTween.current = gsap.to(inkVal.current, {
      v: 0, duration: 0.8, ease: 'power2.inOut',
      onUpdate: () => {
        const v = inkVal.current.v
        turbRef.current?.setAttribute('baseFrequency', `${(0.01 + v * 0.04).toFixed(4)} ${(0.008 + v * 0.03).toFixed(4)}`)
        dispRef.current?.setAttribute('scale', String((v * 16).toFixed(1)))
      },
    })
  }, [])

  // ── Reveal name on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(t)
  }, [])

  // ── ScrollTrigger animations ─────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Statement words
      if (statRef.current) {
        gsap.fromTo(
          statRef.current.querySelectorAll('.k-word'),
          { opacity: 0, y: 10, filter: 'blur(4px)' },
          {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.65, stagger: 0.055, ease: 'power2.out',
            scrollTrigger: { trigger: statRef.current, start: 'top 72%', toggleActions: 'play none none none' },
          },
        )
      }

      // Skill cards stagger
      if (skillsRef.current) {
        gsap.from(skillsRef.current.querySelectorAll('.k-skill-card'), {
          opacity: 0, y: 55, stagger: 0.1, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: skillsRef.current, start: 'top 74%', toggleActions: 'play none none none' },
        })
      }

      // Project cards slide in from left
      if (projRef.current) {
        gsap.from(projRef.current.querySelectorAll('.k-proj-card'), {
          opacity: 0, x: -60, stagger: 0.12, duration: 0.75, ease: 'power3.out',
          scrollTrigger: { trigger: projRef.current, start: 'top 72%', toggleActions: 'play none none none' },
        })
      }

    })
    return () => ctx.revert()
  }, [])

  // ── Project card thumbnail reveal ────────────────────────────────────────
  const handleProjEnter = useCallback((i: number) => {
    const th  = thumbRefs.current[i]
    const num = projNumRefs.current[i]
    if (th)  gsap.to(th,  { clipPath: 'inset(0 0% 0 0)',   duration: 0.55, ease: 'power3.inOut' })
    if (num) gsap.to(num, { color: '#99ca45', '-webkit-text-stroke': '0px', duration: 0.3 })
  }, [])

  const handleProjLeave = useCallback((i: number) => {
    const th  = thumbRefs.current[i]
    const num = projNumRefs.current[i]
    if (th)  gsap.to(th,  { clipPath: 'inset(0 100% 0 0)', duration: 0.4,  ease: 'power3.inOut' })
    if (num) gsap.to(num, { color: 'transparent', '-webkit-text-stroke': '1px rgba(242,234,216,0.25)', duration: 0.3 })
  }, [])

  // ── Framer Motion pill variants ──────────────────────────────────────────
  const pillContainer = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.04 } },
  }
  const pillItem = {
    hidden: { opacity: 0, y: 18, scale: 0.85 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { ease: [0.76, 0, 0.24, 1] as [number,number,number,number], duration: 0.45 } },
  }

  return (
    <div style={{ background: '#0c0c0c', color: '#e8e0d0' }}>

      {/* ── Hidden SVG turbulence filter ─────────────────────────────────── */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="ink-turbulence-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="turbulence"
              baseFrequency="0.01 0.008"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 pb-12 overflow-hidden">

        {/* Top label */}
        <div>
          <p className="font-mono text-ink-green text-[0.6rem] tracking-[0.35em] uppercase">
            Creative Full Stack Developer
          </p>
        </div>

        {/* Center — name */}
        <div
          className="flex-1 flex items-center"
          onMouseEnter={handleNameEnter}
          onMouseLeave={handleNameLeave}
          onTouchStart={handleNameEnter}
          onTouchEnd={handleNameLeave}
        >
          <h1
            className="font-thunder uppercase leading-[0.85] select-none cursor-default"
            style={{ filter: 'url(#ink-turbulence-filter)', willChange: 'filter' }}
          >
            <span
              className={`block text-ink-paper ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{
                fontSize: 'clamp(3.5rem, 18vw, 22rem)',
                animationDelay: '0s',
              }}
            >
              KENNY
            </span>
            <span
              className={`block text-ink-green ink-reveal-text${revealed ? ' is-revealed' : ''}`}
              style={{
                fontSize: 'clamp(3.5rem, 18vw, 22rem)',
                animationDelay: '0.22s',
              }}
            >
              OCHONOGOR
            </span>
          </h1>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-4">
          {/* Location */}
          <p className="font-mono text-[#666666] text-[0.58rem] tracking-[0.2em] uppercase leading-relaxed">
            Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Available for projects
          </p>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[#666666] text-[0.55rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[#666666] text-[0.55rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
              LinkedIn
            </a>
            <a
              href="#selected-work"
              className="flex items-center gap-1.5 font-mono text-[#666666] text-[0.55rem] tracking-wide uppercase hover:text-ink-green transition-colors duration-200"
            >
              <ArrowUpRight size={12} /> Portfolio
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-ink-green" style={{ animation: 'ink-drip-fall 3s ease-in-out infinite' }} />
          <ChevronDown size={14} className="text-ink-green -mt-4 animate-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — STATEMENT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 md:py-40 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e]">
        <div className="max-w-3xl mx-auto">
          <p
            ref={statRef}
            className="font-serif italic text-[1.25rem] md:text-[1.4rem] leading-relaxed text-[#c8c0b0]"
            style={{ wordSpacing: '0.08em' }}
          >
            {STATEMENT.split(' ').map((word, i) => (
              <span key={i} className="k-word inline-block" style={{ marginRight: '0.32em', opacity: 0 }}>
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — SKILLS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e]">
        <SectionLabel>Disciplines</SectionLabel>

        <div ref={skillsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SKILLS.map((skill, i) => (
            <SkillCard key={i} {...skill} index={i} />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — SELECTED WORK
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="selected-work"
        className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e]"
      >
        <SectionLabel>Selected Work</SectionLabel>

        <div ref={projRef} className="flex flex-col">
          {PROJECTS.map((proj, i) => (
            <div
              key={i}
              className="k-proj-card group relative flex items-stretch gap-6 md:gap-10 py-8 md:py-10
                border-b border-[#1e1e1e] cursor-pointer overflow-hidden"
              onMouseEnter={() => handleProjEnter(i)}
              onMouseLeave={() => handleProjLeave(i)}
            >
              {/* Number */}
              <div
                ref={el => { projNumRefs.current[i] = el }}
                className="font-thunder shrink-0 leading-none select-none hidden sm:block"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 6rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(242,234,216,0.25)',
                  transition: 'all 0.3s ease',
                  minWidth: '5rem',
                }}
              >
                {proj.num}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-3">
                <h3
                  className="font-thunder uppercase text-ink-paper leading-none"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
                >
                  {proj.name}
                </h3>
                <p className="font-serif text-[#888] text-sm md:text-base leading-relaxed">
                  {proj.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {proj.stack.map(t => (
                    <span
                      key={t}
                      className="font-mono text-[0.6rem] tracking-wide text-[#555] border border-[#2a2a2a] px-2.5 py-1 rounded-none"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={proj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] uppercase
                    text-ink-green hover:gap-3 transition-all duration-200 mt-1 w-fit"
                >
                  View Project <ArrowUpRight size={11} />
                </a>
              </div>

              {/* Thumbnail — clips in from right on hover */}
              <div
                ref={el => { thumbRefs.current[i] = el }}
                className="absolute right-0 top-0 h-full w-[220px] md:w-[280px] hidden md:block overflow-hidden"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
                aria-hidden="true"
              >
                <div
                  className="h-full w-full flex items-center justify-center"
                  style={{ background: proj.bg }}
                >
                  <span
                    className="font-thunder uppercase text-center px-4 leading-none"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 4rem)',
                      color: proj.accent,
                      opacity: 0.6,
                      WebkitTextStroke: `1px ${proj.accent}`,
                    }}
                  >
                    {proj.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — TECH STACK
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e]">
        <SectionLabel>Tools &amp; Technologies</SectionLabel>

        <div ref={techRef} className="flex flex-col gap-10">
          {TECH_GROUPS.map(group => (
            <div key={group.label}>
              <p className="font-mono text-[#333] text-[0.5rem] tracking-[0.4em] uppercase mb-4">
                {group.label}
              </p>
              <motion.div
                className="flex flex-wrap gap-2.5"
                variants={pillContainer}
                initial="hidden"
                animate={techInView ? 'show' : 'hidden'}
              >
                {group.items.map(item => (
                  <motion.span
                    key={item.name}
                    variants={pillItem}
                    whileHover={{ scale: 1.06, boxShadow: '0 0 12px rgba(153,202,69,0.35)', borderColor: '#99ca45' }}
                    className={`font-mono border border-[#2a2a2a] text-[#888] rounded-none
                      hover:text-ink-green cursor-default transition-colors duration-200
                      ${PillSize(item.size)}`}
                  >
                    {item.name}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 — PORTFOLIO SHOWCASE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e]">
        <SectionLabel>Visual Work</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTFOLIO_TILES.map((tile, i) => (
            <a
              key={i}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`ink-flood-up group relative block border border-[#1e1e1e] overflow-hidden
                ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              style={{ minHeight: i % 2 === 0 ? '180px' : '140px' }}
            >
              <div className="ink-grain absolute inset-0 opacity-20 z-[1] pointer-events-none" aria-hidden="true" />
              <div className="relative z-[2] h-full flex items-end p-6 md:p-8" style={{ minHeight: 'inherit' }}>
                <div className="flex items-center justify-between w-full">
                  <span
                    className="font-thunder uppercase text-ink-paper/60 group-hover:text-ink-void leading-none
                      transition-colors duration-400"
                    style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}
                  >
                    {tile.label}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink-paper/40 group-hover:text-ink-void group-hover:translate-x-1
                      group-hover:-translate-y-1 transition-all duration-300"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 7 — CONTACT / CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 border-t border-[#1e1e1e] overflow-hidden">
        <div className="ink-grain absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true" />

        {/* Ghost background text */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-thunder uppercase text-ink-paper/[0.02] leading-none"
            style={{ fontSize: 'clamp(8rem, 28vw, 30rem)' }}
          >
            CONTACT
          </span>
        </div>

        <div className="relative z-[1] flex flex-col lg:flex-row items-start justify-between gap-16">

          {/* Left */}
          <div>
            <p className="font-mono text-ink-green text-[0.6rem] tracking-[0.35em] uppercase mb-6">
              Let&apos;s Build Something
            </p>
            <h2
              className="font-thunder uppercase leading-[0.85] text-ink-paper"
              style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}
            >
              GET IN<br />
              <span className="text-ink-green">TOUCH.</span>
            </h2>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 lg:justify-center lg:pt-12">
            {/* Email */}
            <a
              href="mailto:kennyprince25.kp@gmail.com"
              className="group font-mono text-[#888] hover:text-ink-green transition-colors duration-200 break-all"
              style={{ fontSize: 'clamp(0.75rem, 1.8vw, 1.05rem)' }}
            >
              kennyprince25.kp@gmail.com
              <ArrowUpRight size={14} className="inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ink-flood-up border border-[#2a2a2a] px-6 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-paper"
              >
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ink-flood-up border border-[#2a2a2a] px-6 py-3 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-paper"
              >
                <span>GitHub</span>
              </a>
            </div>

            <p className="font-mono text-[#444] text-[0.52rem] tracking-[0.18em] uppercase mt-2">
              Available for freelance · Remote-friendly · Based in Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

// ── SkillCard ────────────────────────────────────────────────────────────────

interface SkillCardProps {
  icon:  string
  title: string
  tags:  string[]
  index: number
}

function SkillCard({ icon, title, tags }: SkillCardProps) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const cardRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current || !cardRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
    gsap.to(cardRef.current, { rotateX: -y * 4, rotateY: x * 8, duration: 0.25, ease: 'power2.out', overwrite: true })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    setHovered(false)
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: 'elastic.out(1, 0.55)', overwrite: true })
  }

  return (
    <div
      ref={wrapRef}
      className="k-skill-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '600px' }}
    >
      <div
        ref={cardRef}
        className="h-full flex flex-col gap-4 p-6 md:p-7 transition-colors duration-300"
        style={{
          background: hovered ? '#1c1c1c' : '#161616',
          borderLeft: hovered ? '2px solid #99ca45' : '2px solid transparent',
          borderTop: '1px solid #1e1e1e',
          borderRight: '1px solid #1e1e1e',
          borderBottom: '1px solid #1e1e1e',
          transformStyle: 'preserve-3d',
          transform: 'perspective(600px)',
          transition: 'background 0.3s, border-left 0.3s',
        }}
      >
        {/* Icon */}
        <span
          className="font-thunder text-ink-green select-none leading-none"
          style={{ fontSize: '2rem' }}
          aria-hidden="true"
        >
          {icon}
        </span>

        {/* Title */}
        <h3
          className="font-thunder uppercase text-ink-paper leading-tight"
          style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)' }}
        >
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tags.map(tag => (
            <span key={tag} className="font-mono text-[0.55rem] tracking-wide text-[#555]">
              {tag}{' '}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
