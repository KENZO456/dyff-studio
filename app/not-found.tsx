'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Home } from 'lucide-react'

export default function NotFound() {
  const puddleRef = useRef<SVGEllipseElement>(null)
  const rootRef   = useRef<HTMLElement>(null)

  useEffect(() => {
    const puddle = puddleRef.current
    const root   = rootRef.current
    if (!puddle || !root) return

    // Stagger-in entrance
    gsap.fromTo(root.querySelectorAll('.nf-animate'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out', delay: 0.15 },
    )

    // Ink puddle spreads outward
    gsap.fromTo(puddle,
      { attr: { rx: 0, ry: 0 }, opacity: 0 },
      { attr: { rx: 140, ry: 30 }, opacity: 1, duration: 1.8, ease: 'elastic.out(0.9, 0.45)', delay: 0.5 },
    )
  }, [])

  return (
    <main ref={rootRef} className="not-found-root">
      {/* 404 glitch number */}
      <div className="not-found-number nf-animate" aria-label="404 — page not found">
        404
      </div>

      {/* Spreading ink puddle */}
      <div className="not-found-puddle-wrap" aria-hidden="true">
        <svg width="320" height="80" viewBox="0 0 320 80" className="not-found-puddle">
          <defs>
            <radialGradient id="puddleGrad" cx="50%" cy="50%">
              <stop offset="0%"   stopColor="rgba(153,202,69,0.5)"  />
              <stop offset="100%" stopColor="rgba(153,202,69,0)"     />
            </radialGradient>
          </defs>
          <ellipse ref={puddleRef} cx="160" cy="40" rx="0" ry="0" fill="url(#puddleGrad)" />
        </svg>
      </div>

      {/* Tagline */}
      <p className="not-found-tagline nf-animate">
        This page got lost in the ink.
      </p>

      {/* Go home CTA */}
      <Link href="/" className="not-found-btn ink-flood-up nf-animate">
        <Home size={16} />
        <span>Go Home</span>
      </Link>
    </main>
  )
}
