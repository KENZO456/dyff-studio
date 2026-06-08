'use client'

/**
 * <ScrollSequence> — a drop-in wrapper that animates all direct children
 * into view when the group enters the viewport.
 *
 * Uses ScrollTrigger.batch so a single IntersectionObserver watches all
 * children — more performant than creating one trigger per element.
 *
 * Usage:
 *   <ScrollSequence direction="up" stagger={0.12}>
 *     <Card />
 *     <Card />
 *     <Card />
 *   </ScrollSequence>
 */

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type SequenceDirection = 'up' | 'left' | 'fade' | 'scale'

interface ScrollSequenceProps {
  children:       React.ReactNode
  /** Animation direction. Default: 'up' */
  direction?:     SequenceDirection
  /** Delay between child entrances (seconds). Default: 0.1 */
  stagger?:       number
  /** ScrollTrigger start value. Default: 'top 80%' */
  triggerOffset?: string
  /** Animate in once and stay visible. Default: true */
  once?:          boolean
  /** Element duration. Default: 0.65 */
  duration?:      number
  /** Extra delay before first element. Default: 0 */
  delay?:         number
  /** Container className */
  className?:     string
  /** Rendered tag for the wrapper. Default: 'div' */
  as?: keyof JSX.IntrinsicElements
}

const FROM_STATES: Record<SequenceDirection, gsap.TweenVars> = {
  up:    { opacity: 0, y: 50,  x: 0,   scale: 1    },
  left:  { opacity: 0, y: 0,   x: -50, scale: 1    },
  scale: { opacity: 0, y: 0,   x: 0,   scale: 0.88 },
  fade:  { opacity: 0, y: 0,   x: 0,   scale: 1    },
}

const TO_STATE: gsap.TweenVars = { opacity: 1, y: 0, x: 0, scale: 1 }

export default function ScrollSequence({
  children,
  direction     = 'up',
  stagger       = 0.1,
  triggerOffset = 'top 80%',
  once          = true,
  duration      = 0.65,
  delay         = 0,
  className,
  as: Tag       = 'div',
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.children) as HTMLElement[]
    if (!items.length) return

    const fromState = FROM_STATES[direction]
    gsap.set(items, fromState)

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(items, {
        start:   triggerOffset,
        onEnter: batch => {
          gsap.to(batch, {
            ...TO_STATE,
            duration,
            stagger,
            ease:  'power2.out',
            delay,
          })
        },
        onLeaveBack: once
          ? undefined
          : batch => gsap.to(batch, { ...fromState, duration: 0.3, stagger: 0 }),
      })
    }, container)

    const t = setTimeout(() => ScrollTrigger.refresh(), 80)
    return () => { clearTimeout(t); ctx.revert() }
  }, [direction, stagger, triggerOffset, once, duration, delay])

  // Cast to any to allow dynamic tag without TS complaints
  const Container = Tag as React.ElementType
  return (
    <Container ref={containerRef} className={className}>
      {children}
    </Container>
  )
}
