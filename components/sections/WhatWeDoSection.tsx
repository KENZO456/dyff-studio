'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    num:  '01',
    name: 'Books',
    tag:  'Fiction · Lore',
    desc: 'Every universe starts as a sentence. The DYFF catalog lives in prose first — fiction built for people who read slowly, on purpose.',
    href: '/books',
  },
  {
    num:  '02',
    name: 'Audio',
    tag:  'Series · Drama',
    desc: 'Cinema you listen to. Original voice casts, original scores, no narration. Stories designed for headphones in the dark.',
    href: '/audio',
  },
  {
    num:  '03',
    name: 'Animations',
    tag:  'Series · Shorts',
    desc: 'The ink learns to move. Character-driven animation from the same worlds as the books — same stories, different dimension.',
    href: '/animations',
  },
  {
    num:  '04',
    name: 'Marketplace',
    tag:  'Art · Beats · Assets',
    desc: 'Own what we make. Digital art, original beats, and creative assets from the DYFF canon. Buy one piece of the world.',
    href: '/marketplace',
  },
]

export default function WhatWeDoSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const track = trackRef.current
    if (!outer || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const getTotal = () => track.scrollWidth - window.innerWidth

      const st = ScrollTrigger.create({
        trigger:  outer,
        pin:      true,
        scrub:    1,
        start:    'top top',
        end:      () => `+=${getTotal()}`,
        onUpdate: (self) => {
          const total = getTotal()
          gsap.set(track, { x: -self.progress * total, force3D: true })
          outer.style.setProperty('--wwd-trail-x', `${self.progress * 100}%`)
        },
        invalidateOnRefresh: true,
      })

      return () => st.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={outerRef} className="wwd-outer">
      {/* Green gradient trail — hotspot translates via CSS var */}
      <div className="wwd-trail" aria-hidden="true" />

      {/* Section label — pinned top-left */}
      <div className="wwd-h-header">
        <span className="wwd-eyebrow font-mono">— What We Do</span>
        <span className="wwd-h-sub font-mono">
          Four disciplines.<br />One universe.
        </span>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="wwd-track">
        <div className="wwd-track-pad" />

        {PILLARS.map(({ num, name, tag, desc, href }) => (
          <Link key={name} href={href} className="wwd-card">
            <span className="wwd-card-num font-mono">{num}</span>
            <h3 className="wwd-card-name font-thunder">{name}</h3>
            <div className="wwd-card-bottom">
              <p className="wwd-card-tag font-mono">{tag}</p>
              <p className="wwd-card-desc font-thunder">{desc}</p>
              <span className="wwd-card-arrow">→</span>
            </div>
          </Link>
        ))}

        <div className="wwd-track-pad" />
      </div>
    </div>
  )
}
