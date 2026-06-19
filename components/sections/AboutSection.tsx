'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const h1Ref      = useRef<HTMLDivElement>(null)
  const h2Ref      = useRef<HTMLDivElement>(null)
  const h3Ref      = useRef<HTMLDivElement>(null)
  const originRef  = useRef<HTMLDivElement>(null)
  const spineRef   = useRef<HTMLDivElement>(null)
  const bodyRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {

      // Section label
      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: labelRef.current, start: 'top 90%', end: 'top 68%', scrub: 1.2 },
        }
      )

      // Headline line 1 — "TWO BROTHERS."
      gsap.fromTo(h1Ref.current,
        { opacity: 0, y: 90 },
        {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: h1Ref.current, start: 'top 88%', end: 'top 50%', scrub: 1.4 },
        }
      )

      // Headline line 2 — "ONE STUDIO."
      gsap.fromTo(h2Ref.current,
        { opacity: 0, y: 90 },
        {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: h2Ref.current, start: 'top 90%', end: 'top 52%', scrub: 1.4 },
        }
      )

      // Headline line 3 — sub-line
      gsap.fromTo(h3Ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: h3Ref.current, start: 'top 90%', end: 'top 60%', scrub: 1.2 },
        }
      )

      // Origin strip
      gsap.fromTo(originRef.current,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          scrollTrigger: { trigger: originRef.current, start: 'top 92%', end: 'top 70%', scrub: 1 },
        }
      )

      // Vertical spine — grows down
      gsap.fromTo(spineRef.current,
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1, opacity: 1, transformOrigin: 'top center',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', end: 'center 40%', scrub: 1.5 },
        }
      )

      // Right body — slides in from right
      gsap.fromTo(bodyRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0,
          scrollTrigger: { trigger: bodyRef.current, start: 'top 84%', end: 'top 44%', scrub: 1.3 },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-16 border-t border-ink-ash/10 overflow-hidden"
      style={{ background: 'rgba(8, 8, 8, 0.82)' }}
    >
      {/* Faint DYFF watermark */}
      <div
        className="absolute inset-0 flex items-center justify-end select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-thunder uppercase text-white"
          style={{ fontSize: 'clamp(14rem, 48vw, 68rem)', opacity: 0.018, lineHeight: 1, paddingRight: '0.02em' }}
        >
          DYFF
        </span>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">

        {/* Section label */}
        <p
          ref={labelRef}
          className="font-mono text-ink-ash/50 text-[0.6rem] tracking-[0.3em] uppercase mb-20 opacity-0"
        >
          04 — About
        </p>

        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-0">

          {/* LEFT — headline */}
          <div className="lg:w-[54%] shrink-0">

            {/* "TWO BROTHERS." */}
            <div ref={h1Ref} className="opacity-0">
              <h2
                className="font-thunder uppercase text-white leading-[0.86]"
                style={{ fontSize: 'clamp(4rem, 10.5vw, 13rem)', fontWeight: 400 }}
              >
                TWO
              </h2>
              <h2
                className="font-thunder uppercase text-white leading-[0.86]"
                style={{ fontSize: 'clamp(4rem, 10.5vw, 13rem)', fontWeight: 400 }}
              >
                BROTHERS.
              </h2>
            </div>

            {/* "ONE STUDIO." — green */}
            <div ref={h2Ref} className="opacity-0 mt-1">
              <h2
                className="font-thunder uppercase text-ink-green leading-[0.86]"
                style={{ fontSize: 'clamp(4rem, 10.5vw, 13rem)', fontWeight: 400 }}
              >
                ONE STUDIO.
              </h2>
            </div>

            {/* Sub-line */}
            <div ref={h3Ref} className="opacity-0 mt-6 md:mt-8">
              <p
                className="font-thunder uppercase text-white/30 leading-tight tracking-wide"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)' }}
              >
                A catalog being written.
              </p>
            </div>

            {/* Origin strip */}
            <div ref={originRef} className="flex items-center gap-4 mt-10 opacity-0">
              <div className="w-8 h-px bg-ink-green shrink-0" />
              <p className="font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.22em] uppercase">
                Lagos, Nigeria&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2024
              </p>
            </div>

          </div>

          {/* Vertical spine — desktop only */}
          <div className="hidden lg:flex justify-center px-10 pt-4 shrink-0">
            <div
              ref={spineRef}
              className="w-px opacity-0"
              style={{
                height: '26rem',
                background: 'linear-gradient(to bottom, #99ca45 0%, rgba(153,202,69,0.15) 70%, transparent 100%)',
              }}
            />
          </div>

          {/* RIGHT — body copy */}
          <div ref={bodyRef} className="lg:flex-1 opacity-0 lg:pt-2">

            {/* One-liner */}
            <p className="font-mono text-ink-ash/45 text-[0.58rem] tracking-[0.25em] uppercase mb-8 leading-relaxed">
              An independent entertainment studio<br className="hidden md:block" /> from Lagos, Nigeria.
            </p>

            {/* 40-word who-we-are */}
            <p
              className="font-thunder uppercase text-white/80 leading-snug mb-10"
              style={{ fontSize: 'clamp(0.95rem, 1.9vw, 1.3rem)' }}
            >
              Founded by brothers Kenny and Daniel Ochonogor, DYFF Studio creates original
              books, audio series, animations, and digital art — rooted in authentic African
              narrative and built to world-class production standards.
            </p>

            {/* Mission quote */}
            <div className="border-l-[2px] border-ink-green pl-5 mb-12">
              <p
                className="font-thunder uppercase text-white/50 leading-snug"
                style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)' }}
              >
                Africa has always had stories.
              </p>
              <p
                className="font-thunder uppercase text-ink-green leading-snug mt-1"
                style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)' }}
              >
                DYFF is the studio finally telling them properly.
              </p>
            </div>

            {/* CTA */}
            <Link
              href="/audio"
              className="inline-flex items-center gap-3 font-thunder uppercase text-ink-green
                text-[0.85rem] tracking-[0.22em] hover:gap-5 transition-all duration-200 group"
            >
              Explore the Catalog
              <ArrowUpRight
                size={13}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </Link>

          </div>

        </div>

      </div>
    </section>
  )
}
