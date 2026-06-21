'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useLenis } from '@/hooks/useLenis'

interface ScrollExpandMediaProps {
  mediaType?:    'video' | 'image'
  mediaSrc:      string
  posterSrc?:    string
  bgImageSrc:    string
  title?:        string
  date?:         string
  scrollToExpand?: string
  textBlend?:    boolean
  children?:     ReactNode
}

function extractYouTubeId(src: string): string | null {
  try {
    const u = new URL(src)
    if (u.hostname.includes('youtube.com')) {
      return u.searchParams.get('v') || src.split('embed/')[1]?.split('?')[0] || null
    }
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
  } catch { /* not a URL */ }
  return null
}

export default function ScrollExpandMedia({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand = 'SCROLL TO EXPAND',
  textBlend,
  children,
}: ScrollExpandMediaProps) {
  const lenis = useLenis()

  const [progress,       setProgress]       = useState(0)
  const [showContent,    setShowContent]    = useState(false)
  const [expanded,       setExpanded]       = useState(false)
  const [touchStartY,    setTouchStartY]    = useState(0)
  const [isMobile,       setIsMobile]       = useState(false)

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Pause / resume Lenis based on expansion state so both don't fight over scroll events
  useEffect(() => {
    if (expanded) {
      lenis?.start()
    } else {
      lenis?.stop()
    }
    return () => { lenis?.start() }
  }, [expanded, lenis])

  // Wheel + touch event interception
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false)
        e.preventDefault()
        return
      }
      if (!expanded) {
        e.preventDefault()
        setProgress(prev => {
          const next = Math.min(Math.max(prev + e.deltaY * 0.0009, 0), 1)
          if (next >= 1)    { setExpanded(true);  setShowContent(true) }
          if (next < 0.75)  setShowContent(false)
          return next
        })
      }
    }

    const onTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY)

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return
      const deltaY = touchStartY - e.touches[0].clientY
      if (expanded && deltaY < -20 && window.scrollY <= 5) {
        setExpanded(false)
        e.preventDefault()
        return
      }
      if (!expanded) {
        e.preventDefault()
        const factor = deltaY < 0 ? 0.008 : 0.005
        setProgress(prev => {
          const next = Math.min(Math.max(prev + deltaY * factor, 0), 1)
          if (next >= 1)   { setExpanded(true);  setShowContent(true) }
          if (next < 0.75) setShowContent(false)
          return next
        })
        setTouchStartY(e.touches[0].clientY)
      }
    }

    const onTouchEnd  = () => setTouchStartY(0)
    const onScroll    = () => { if (!expanded) window.scrollTo(0, 0) }

    window.addEventListener('wheel',       onWheel,      { passive: false })
    window.addEventListener('scroll',      onScroll)
    window.addEventListener('touchstart',  onTouchStart, { passive: false })
    window.addEventListener('touchmove',   onTouchMove,  { passive: false })
    window.addEventListener('touchend',    onTouchEnd)

    return () => {
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [expanded, touchStartY])

  const mediaW    = 300 + progress * (isMobile ? 650  : 1250)
  const mediaH    = 400 + progress * (isMobile ? 200  : 400)
  const textTX    = progress * (isMobile ? 180 : 150)

  const firstWord  = title ? title.split(' ')[0] : ''
  const restTitle  = title ? title.split(' ').slice(1).join(' ') : ''
  const youtubeId  = mediaSrc.includes('youtube') ? extractYouTubeId(mediaSrc) : null

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* ── Background ──────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 z-0"
            animate={{ opacity: 1 - progress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              fill
              className="object-cover object-center"
              aria-hidden="true"
              priority
            />
            <div className="absolute inset-0 bg-ink-void/60" />
          </motion.div>

          {/* Film grain */}
          <div className="ink-grain absolute inset-0 z-[1] pointer-events-none opacity-20" aria-hidden="true" />

          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* ── Expanding media card ─────────────────────────────────── */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                style={{
                  width:    `${mediaW}px`,
                  height:   `${mediaH}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(242,234,216,0.05)',
                }}
              >
                {mediaType === 'video' ? (
                  youtubeId ? (
                    <div className="relative w-full h-full pointer-events-none">
                      <iframe
                        width="100%" height="100%"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
                        title={title ?? 'DYFF Animations'}
                        allow="autoplay; encrypted-media"
                        style={{ border: 'none', display: 'block' }}
                        className="w-full h-full"
                      />
                      <motion.div
                        className="absolute inset-0 bg-ink-void"
                        animate={{ opacity: 0.55 - progress * 0.35 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-full pointer-events-none">
                      <video
                        src={mediaSrc} poster={posterSrc}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-ink-void"
                        animate={{ opacity: 0.55 - progress * 0.35 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title ?? ''}
                      fill
                      className="object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-ink-void"
                      animate={{ opacity: 0.6 - progress * 0.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* ── Title straddling the card ────────────────────────────── */}
              <div
                className={`flex flex-col items-center justify-center text-center gap-2 w-full absolute z-10 pointer-events-none ${
                  textBlend ? 'mix-blend-difference' : ''
                }`}
              >
                <span
                  className="font-thunder uppercase text-ink-paper leading-[0.88] block"
                  style={{
                    fontSize:  'clamp(2.8rem, 9vw, 10rem)',
                    transform: `translateX(-${textTX}vw)`,
                  }}
                >
                  {firstWord}
                </span>
                <span
                  className="font-thunder uppercase text-ink-paper leading-[0.88] block"
                  style={{
                    fontSize:  'clamp(2.8rem, 9vw, 10rem)',
                    transform: `translateX(${textTX}vw)`,
                  }}
                >
                  {restTitle}
                </span>
              </div>

              {/* ── Eyebrow + scroll hint ───────────────────────────────── */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-center pointer-events-none">
                {date && (
                  <p
                    className="font-thunder uppercase text-ink-green text-[0.68rem] tracking-[0.32em]"
                    style={{ transform: `translateX(-${textTX}vw)` }}
                  >
                    {date}
                  </p>
                )}
                {scrollToExpand && (
                  <p
                    className="font-mono text-ink-ash/45 text-[0.5rem] tracking-[0.28em] uppercase"
                    style={{ transform: `translateX(${textTX}vw)` }}
                  >
                    {scrollToExpand}
                  </p>
                )}
                <div className="w-px h-8 bg-gradient-to-b from-ink-green/60 to-transparent mt-1" />
              </div>

            </div>

            {/* ── Revealed content after full expansion ─────────────────── */}
            {children && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ duration: 0.7 }}
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
