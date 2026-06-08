'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Body, Label } from '@/components/ui/Typography'
import { ChevronDown } from 'lucide-react'

export default function HeroSection() {
  const heroRef  = useRef<HTMLElement>(null)
  const revealRefs = useRef<(HTMLDivElement | null)[]>([])

  /* Parallax — each layer at a different depth */
  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset: ['start start', 'end start'],
  })
  const yLabel  = useTransform(scrollYProgress, [0, 1], [0,  -50])   // 0.05x slowest
  const yIdeas  = useTransform(scrollYProgress, [0, 1], [0, -100])   // 0.1x
  const yAre    = useTransform(scrollYProgress, [0, 1], [0, -300])   // 0.3x fastest
  const yTick   = useTransform(scrollYProgress, [0, 1], [0, -150])   // 0.15x
  const yBombs  = useTransform(scrollYProgress, [0, 1], [0, -250])   // 0.25x
  const ySub    = useTransform(scrollYProgress, [0, 1], [0, -180])

  /* Staggered ink-reveal on mount */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    revealRefs.current.forEach((el, i) => {
      if (!el) return
      const t = setTimeout(() => el.classList.add('is-revealed'), 300 + i * 160)
      timers.push(t)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden select-none"
    >
      <div className="relative z-10 px-6 md:px-16 pt-28 pb-36">

        {/* Label: DYFF Studios */}
        <motion.div style={{ y: yLabel }}>
          <div ref={el => { revealRefs.current[0] = el }} className="ink-reveal-text mb-10">
            <Label className="text-ink-green tracking-[0.3em]">DYFF STUDIOS</Label>
          </div>
        </motion.div>

        {/* IDEAS — primary hero word, clamp per spec */}
        <motion.div style={{ y: yIdeas }} className="-ml-1 overflow-hidden">
          <div ref={el => { revealRefs.current[1] = el }} className="ink-reveal-text">
            <span
              className="font-thunder uppercase text-ink-white tracking-tight block"
              style={{ fontSize: 'clamp(3rem, 15vw, 14rem)', lineHeight: '0.85', fontWeight: 400 }}
            >
              IDEAS
            </span>
          </div>
        </motion.div>

        {/* ARE — outline ghost, pushed right for depth */}
        <motion.div style={{ y: yAre }} className="ml-[18vw] overflow-hidden">
          <div ref={el => { revealRefs.current[2] = el }} className="ink-reveal-text">
            <span
              className="thunder-outline font-thunder uppercase tracking-tight block"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 4rem)', lineHeight: '0.9', fontWeight: 400 }}
            >
              ARE
            </span>
          </div>
        </motion.div>

        {/* TICKING — green, slight right offset */}
        <motion.div style={{ y: yTick }} className="ml-[6vw] overflow-hidden">
          <div ref={el => { revealRefs.current[3] = el }} className="ink-reveal-text">
            <span
              className="font-thunder uppercase text-ink-green tracking-tight block"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)', lineHeight: '0.85', fontWeight: 400 }}
            >
              TICKING
            </span>
          </div>
        </motion.div>

        {/* TIME BOMBS — white, flush left */}
        <motion.div style={{ y: yBombs }} className="-ml-1 overflow-hidden">
          <div ref={el => { revealRefs.current[4] = el }} className="ink-reveal-text">
            <span
              className="font-thunder uppercase text-ink-white tracking-tight block"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)', lineHeight: '0.9', fontWeight: 400 }}
            >
              TIME BOMBS
            </span>
          </div>
        </motion.div>

        {/* Subtext */}
        <motion.div style={{ y: ySub }} className="mt-5 ml-1">
          <div ref={el => { revealRefs.current[5] = el }} className="ink-reveal-text">
            <Body size="lg" className="italic text-ink-paper/70">
              COS IT'S DYFF.
            </Body>
          </div>
        </motion.div>

        {/* CTAs */}
        <div
          ref={el => { revealRefs.current[6] = el }}
          className="ink-reveal-text mt-14 flex flex-wrap gap-4"
        >
          <Link
            href="/books"
            className="ink-flood-green border border-ink-green px-8 py-4 rounded-sm cursor-pointer"
          >
            <Label className="text-ink-paper whitespace-nowrap">ENTER THE LIBRARY</Label>
          </Link>
          <Link
            href="/audio"
            className="ink-flood-green border border-ink-green/60 px-8 py-4 rounded-sm cursor-pointer"
          >
            <Label className="text-ink-paper whitespace-nowrap">HEAR THE SERIES</Label>
          </Link>
        </div>
      </div>

      {/* Scroll indicator — drip loop on the line */}
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
