'use client'

import { useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Label } from '@/components/ui/Typography'

export default function HeroSection() {
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => revealRef.current?.classList.add('is-revealed'), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden select-none">

      <div className="relative z-10 px-6 md:px-16 pb-24 text-center">
        <div ref={revealRef} className="ink-reveal-text">
          <span className="hero-headline font-thunder uppercase text-ink-white tracking-tight block">
            DYFF STUDIO.
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="ink-drip relative">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-ink-ash/50 mx-auto" />
        </div>
        <Label className="text-ink-ash animate-pulse">SCROLL</Label>
        <ChevronDown size={14} className="text-ink-ash/60 animate-bounce" />
      </div>

    </section>
  )
}
