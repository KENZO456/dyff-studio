'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    name:  'Books',
    tag:   'Fiction · Lore',
    desc:  'Every universe starts as a sentence. The DYFF catalog lives in prose first — fiction built for people who read slowly, on purpose.',
    href:  '/books',
  },
  {
    name:  'Audio',
    tag:   'Series · Drama',
    desc:  'Cinema you listen to. Original voice casts, original scores, no narration. Stories designed for headphones in the dark.',
    href:  '/audio',
  },
  {
    name:  'Animations',
    tag:   'Series · Shorts',
    desc:  'The ink learns to move. Character-driven animation from the same worlds as the books — same stories, different dimension.',
    href:  '/animations',
  },
  {
    name:  'Marketplace',
    tag:   'Art · Beats · Assets',
    desc:  'Own what we make. Digital art, original beats, and creative assets from the DYFF canon. Buy one piece of the world.',
    href:  '/marketplace',
  },
]

export default function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wwd-pillar', {
        opacity:  0,
        y:        40,
        stagger:  0.1,
        duration: 0.75,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top 78%',
          once:    true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="wwd-section">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="wwd-header">
        <span className="wwd-eyebrow font-mono">— What We Do</span>
        <span className="wwd-sub font-mono">
          Four disciplines.<br />One universe.
        </span>
      </div>

      {/* ── Pillar rows ──────────────────────────────────────────── */}
      <div>
        {PILLARS.map(({ name, tag, desc, href }) => (
          <Link key={name} href={href} className="wwd-pillar">
            {/* Green left bar */}
            <span className="wwd-bar" aria-hidden="true" />

            <div className="wwd-pillar-left">
              <h3 className="wwd-pillar-name font-thunder">{name}</h3>
              <p className="wwd-pillar-desc font-thunder">{desc}</p>
            </div>

            <div className="wwd-pillar-right" aria-hidden="true">
              <span className="wwd-pillar-tag font-mono">{tag}</span>
              <span className="wwd-pillar-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>

    </section>
  )
}
