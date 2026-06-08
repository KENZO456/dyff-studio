'use client'

/**
 * <HorizontalScroll> — GSAP-pinned horizontal scroll on desktop.
 *
 * Desktop (≥768px):
 *   - Container is pinned vertically while the inner track scrolls horizontally.
 *   - Scroll distance on the page = track's overflow width (so the animation
 *     runs for exactly as long as the track is wider than the container).
 *   - Uses pinType: 'transform' — CSS transform pin instead of position:fixed,
 *     which is compatible with Lenis smooth scroll.
 *
 * Mobile/Tablet (<768px):
 *   - CSS overflow-x: auto with scroll-snap-type x mandatory.
 *   - No GSAP, no JS, pure CSS swipe.
 *   - Add className="horiz-snap-item" to each direct child for snap alignment.
 *
 * Usage:
 *   <HorizontalScroll itemMinWidth="320px" gap="1.5rem" padding="0 5vw">
 *     <SeriesTile />
 *     <SeriesTile />
 *     <SeriesTile />
 *   </HorizontalScroll>
 */

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HorizontalScrollProps {
  children:       React.ReactNode
  /** Extra padding around the track (both on mobile and desktop). Default: '0 clamp(1.5rem, 5vw, 4rem)' */
  padding?:       string
  /** Gap between items. Default: '1.5rem' */
  gap?:           string
  /** className on the outer root */
  className?:     string
  /** className on the inner track */
  trackClassName?: string
  /** GSAP scrub value. Higher = more lag. Default: 1.5 */
  scrub?:         number
}

export default function HorizontalScroll({
  children,
  padding        = '0 clamp(1.5rem, 5vw, 4rem)',
  gap            = '1.5rem',
  className      = '',
  trackClassName = '',
  scrub          = 1.5,
}: HorizontalScrollProps) {
  const rootRef  = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root  = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    /*
     * gsap.matchMedia: desktop only.
     * On mobile the CSS scroll-snap handles navigation.
     */
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', (context) => {
      // How far the track extends beyond the visible container
      const getDistance = () => track.scrollWidth - root.offsetWidth

      const tween = gsap.to(track, {
        x:    () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger:             root,
          start:               'top top',
          end:                 () => `+=${getDistance()}`,
          pin:                 true,
          pinType:             'transform',   // CSS transform pin — Lenis-safe
          scrub,
          anticipatePin:       1,
          invalidateOnRefresh: true,
        },
      })

      context.add('kill', () => tween.kill())
      return () => context.kill()
    })

    const t = setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => { clearTimeout(t); mm.revert() }
  }, [scrub])

  return (
    <div
      ref={rootRef}
      className={`horiz-scroll-root ${className}`}
    >
      <div
        ref={trackRef}
        className={`horiz-scroll-track ${trackClassName}`}
        style={{ gap, padding }}
      >
        {children}
      </div>
    </div>
  )
}
