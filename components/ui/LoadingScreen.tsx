'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function LoadingScreen() {
  const [shown,   setShown]   = useState(true)
  const screenRef = useRef<HTMLDivElement>(null)
  const textRef   = useRef<HTMLDivElement>(null)
  const blobRef   = useRef<SVGCircleElement>(null)

  useEffect(() => {
    // Skip on subsequent navigations within the same session
    if (sessionStorage.getItem('dyff_loaded')) {
      setShown(false)
      return
    }

    const screen = screenRef.current
    const text   = textRef.current
    const blob   = blobRef.current
    if (!screen || !text) return

    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        sessionStorage.setItem('dyff_loaded', 'true')
        setShown(false)
      },
    })

    // Blob pulses
    if (blob) {
      tl.fromTo(blob,
        { attr: { r: 0 }, opacity: 0 },
        { attr: { r: 160 }, opacity: 0.06, duration: 1.2, ease: 'power2.out' },
        0,
      )
      tl.to(blob, { attr: { r: 220 }, opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.0)
    }

    // "DYFF" fades in
    tl.fromTo(text,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
      0.25,
    )

    // Hold then fade text
    .to(text, { opacity: 0, y: -18, duration: 0.35, ease: 'power2.in' }, '+=0.65')

    // Ink wipe: screen slides up to reveal site
    .to(screen, { y: '-100%', duration: 0.65, ease: 'power3.inOut' })
  }, [])

  if (!shown) return null

  return (
    <div ref={screenRef} className="loading-screen" aria-hidden="true">
      {/* Ink blob pulse */}
      <svg className="loading-blob" viewBox="0 0 500 500" aria-hidden="true">
        <circle ref={blobRef} cx="250" cy="250" r="0" fill="var(--ink-green)" />
      </svg>

      {/* DYFF logotype */}
      <div ref={textRef} className="loading-dyff">
        DYFF
      </div>
    </div>
  )
}
