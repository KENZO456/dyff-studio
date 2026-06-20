'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function CtaSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const line1Ref    = useRef<HTMLDivElement>(null)
  const line2Ref    = useRef<HTMLDivElement>(null)
  const bodyRef     = useRef<HTMLParagraphElement>(null)
  const btnRef      = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: labelRef.current, start: 'top 88%', end: 'top 62%', scrub: 1.2 } }
      )
      gsap.fromTo(line1Ref.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: line1Ref.current, start: 'top 88%', end: 'top 54%', scrub: 1.4 } }
      )
      gsap.fromTo(line2Ref.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: line2Ref.current, start: 'top 90%', end: 'top 56%', scrub: 1.4 } }
      )
      gsap.fromTo(bodyRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: bodyRef.current, start: 'top 88%', end: 'top 58%', scrub: 1.2 } }
      )
      gsap.fromTo(btnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, scrollTrigger: { trigger: btnRef.current, start: 'top 90%', end: 'top 65%', scrub: 1 } }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden"
      style={{
        height: '100vh',
        zIndex: 1,
        background: 'rgba(6, 6, 6, 0.88)',
      }}
    >
      {/* Faint watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-thunder uppercase text-white"
          style={{ fontSize: 'clamp(12rem, 40vw, 58rem)', opacity: 0.022, lineHeight: 1 }}
        >
          DYFF
        </span>
      </div>

      <div className="ink-grain absolute inset-0 pointer-events-none opacity-20" aria-hidden="true" />

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">

        <p
          ref={labelRef}
          className="font-mono text-ink-green text-[0.6rem] tracking-[0.32em] uppercase mb-10 opacity-0"
        >
          06 — Connect
        </p>

        <div ref={line1Ref} className="opacity-0">
          <h2
            className="font-thunder uppercase text-white leading-[0.86]"
            style={{ fontSize: 'clamp(3.6rem, 10vw, 12rem)', fontWeight: 400 }}
          >
            THE UNIVERSE
          </h2>
        </div>

        <div ref={line2Ref} className="opacity-0">
          <h2
            className="font-thunder uppercase text-ink-green leading-[0.86]"
            style={{ fontSize: 'clamp(3.6rem, 10vw, 12rem)', fontWeight: 400 }}
          >
            IS EXPANDING.
          </h2>
        </div>

        <div className="mt-10 max-w-xl flex flex-col md:flex-row items-start md:items-end gap-10">
          <p
            ref={bodyRef}
            className="font-thunder uppercase text-white/50 leading-snug opacity-0"
            style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)' }}
          >
            Follow DYFF Studio for updates on new releases,
            upcoming series, and creative collaborations.
            The catalog is still being written.
          </p>

          <a
            ref={btnRef}
            href="https://www.linkedin.com/in/dyff-studio-4703bb402/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 font-thunder uppercase text-ink-green
              border border-ink-green/50 px-8 py-4 text-[0.82rem] tracking-[0.28em]
              hover:bg-ink-green hover:text-ink-void hover:border-ink-green hover:gap-5
              transition-all duration-300 opacity-0"
          >
            Follow on LinkedIn
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Bottom rule */}
        <div className="mt-20 flex items-center gap-4">
          <div className="w-8 h-px bg-ink-green/40" />
          <span className="font-mono text-white/20 text-[0.55rem] tracking-[0.22em] uppercase">
            DYFF Studios &nbsp;·&nbsp; Lagos, Nigeria &nbsp;·&nbsp; Est. 2024
          </span>
        </div>

      </div>
    </section>
  )
}
