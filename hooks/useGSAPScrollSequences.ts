'use client'

import { useRef, useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

export type SequenceDirection = 'up' | 'left' | 'fade' | 'scale'

export interface UseScrollSequenceOptions {
  /** Animation direction for child elements. Default: 'up' */
  direction?:     SequenceDirection
  /** Seconds between each child's entrance. Default: 0.1 */
  stagger?:       number
  /** ScrollTrigger start value. Default: 'top 80%' */
  triggerOffset?: string
  /** Animate in once and stay visible. Default: true */
  once?:          boolean
  /** Animation duration per element. Default: 0.65 */
  duration?:      number
  /** GSAP ease string. Default: 'power2.out' */
  ease?:          string
  /** CSS selector to target within container. Default: ':scope > *' */
  selector?:      string
  /** Delay before first element starts. Default: 0 */
  delay?:         number
}

export interface UseScrollRevealOptions {
  direction?:     SequenceDirection
  triggerOffset?: string
  once?:          boolean
  duration?:      number
  ease?:          string
  delay?:         number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FROM: Record<SequenceDirection, gsap.TweenVars> = {
  up:    { opacity: 0, y: 50,       x: 0,   scale: 1    },
  left:  { opacity: 0, y: 0,        x: -50, scale: 1    },
  scale: { opacity: 0, y: 0,        x: 0,   scale: 0.88 },
  fade:  { opacity: 0, y: 0,        x: 0,   scale: 1    },
}

const TO: gsap.TweenVars = { opacity: 1, y: 0, x: 0, scale: 1 }

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// ─── useScrollSequence ────────────────────────────────────────────────────────
/**
 * Batched scroll-entrance animation for all children of the container.
 * On mobile, stagger is halved. Skipped entirely when prefers-reduced-motion.
 */
export function useScrollSequence<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollSequenceOptions = {},
): RefObject<T> {
  const {
    direction     = 'up',
    stagger       = 0.1,
    triggerOffset = 'top 80%',
    once          = true,
    duration      = 0.65,
    ease          = 'power2.out',
    selector      = ':scope > *',
    delay         = 0,
  } = options

  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    // Skip animation for reduced-motion users — leave elements in final state
    if (prefersReducedMotion()) {
      const items = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
      gsap.set(items, TO)
      return
    }

    const effectiveStagger = isMobileViewport() ? stagger * 0.5 : stagger
    const items = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    if (!items.length) return

    gsap.set(items, FROM[direction])

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(items, {
        start:   triggerOffset,
        onEnter: batch => {
          gsap.to(batch, { ...TO, duration, stagger: effectiveStagger, ease, delay })
        },
        onLeaveBack: once
          ? undefined
          : batch => gsap.to(batch, { ...FROM[direction], duration: 0.3, stagger: 0 }),
      })
    }, container)

    const t = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => { clearTimeout(t); ctx.revert() }
  }, [direction, stagger, triggerOffset, once, duration, ease, selector, delay])

  return ref
}

// ─── useScrollReveal ──────────────────────────────────────────────────────────
/**
 * Animates a single element into view on scroll.
 * Skipped when prefers-reduced-motion; element jumps to final state.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
): RefObject<T> {
  const {
    direction     = 'up',
    triggerOffset = 'top 85%',
    once          = true,
    duration      = 0.7,
    ease          = 'power2.out',
    delay         = 0,
  } = options

  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, TO)
      return
    }

    gsap.set(el, FROM[direction])

    const ctx = gsap.context(() => {
      gsap.to(el, {
        ...TO,
        duration,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start:   triggerOffset,
          once,
        },
      })
    })

    return () => ctx.revert()
  }, [direction, triggerOffset, once, duration, ease, delay])

  return ref
}

// ─── useCharReveal ────────────────────────────────────────────────────────────
/**
 * Splits text into character spans and animates them on scroll.
 * On mobile, stagger is halved (0.03 → 0.015). Skipped for reduced-motion.
 */
export interface UseCharRevealOptions {
  stagger?:       number
  triggerOffset?: string
  duration?:      number
  ease?:          string
  delay?:         number
  once?:          boolean
}

export function useCharReveal<T extends HTMLElement = HTMLHeadingElement>(
  text: string,
  options: UseCharRevealOptions = {},
): RefObject<T> {
  const {
    stagger       = 0.03,
    triggerOffset = 'top 75%',
    duration      = 0.55,
    ease          = 'power3.out',
    delay         = 0,
    once          = true,
  } = options

  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced-motion: render text plainly, no splits
    if (prefersReducedMotion()) {
      el.textContent = text
      return
    }

    // Mobile: halve stagger for snappier feel on slower devices
    const effectiveStagger = isMobileViewport() ? stagger * 0.5 : stagger

    // Build character spans
    el.innerHTML = ''
    const spans: HTMLSpanElement[] = []
    for (const char of text) {
      const span = document.createElement('span')
      span.className        = char.trim() ? 'split-char' : 'split-space'
      span.textContent      = char === ' ' ? ' ' : char
      span.style.display    = 'inline-block'
      el.appendChild(span)
      if (char.trim()) spans.push(span)
    }

    gsap.set(spans, { opacity: 0, y: 60, rotateX: -90, transformOrigin: '50% 50% -20px' })

    const ctx = gsap.context(() => {
      gsap.to(spans, {
        opacity:  1,
        y:        0,
        rotateX:  0,
        stagger:  effectiveStagger,
        duration,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start:   triggerOffset,
          once,
        },
      })
    })

    return () => {
      ctx.revert()
      el.textContent = text
    }
  }, [text, stagger, triggerOffset, duration, ease, delay, once])

  return ref
}
