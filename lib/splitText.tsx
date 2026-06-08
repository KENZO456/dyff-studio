/**
 * Text split utilities for GSAP stagger animations.
 *
 * Two usage patterns:
 *
 * PATTERN A — React render (simpler, less control):
 *   <h1 ref={headingRef} aria-label={text}>
 *     {splitChars(text)}
 *   </h1>
 *   // Then in useEffect:
 *   const chars = headingRef.current!.querySelectorAll('.split-char')
 *   gsap.from(chars, { opacity: 0, y: 60, rotateX: -90, stagger: 0.03 })
 *
 * PATTERN B — useCharReveal hook (handles DOM + GSAP lifecycle automatically):
 *   import { useCharReveal } from '@/hooks/useGSAPScrollSequences'
 *   const ref = useCharReveal("IDEAS ARE TICKING TIME BOMBS", { stagger: 0.03 })
 *   return <h1 ref={ref} aria-label="IDEAS ARE TICKING TIME BOMBS" />
 */

import React from 'react'

// ─── splitChars ───────────────────────────────────────────────────────────────
/**
 * Wraps each character in an inline-block <span class="split-char">.
 * Spaces become non-breaking spaces (preserved in layout).
 */
export function splitChars(text: string): React.ReactElement[] {
  return Array.from(text).map((char, i) =>
    char === ' ' ? (
      <span key={i} className="split-space" aria-hidden="true">&nbsp;</span>
    ) : (
      <span key={i} className="split-char">{char}</span>
    ),
  )
}

// ─── splitWords ───────────────────────────────────────────────────────────────
/**
 * Wraps each word in an inline-block <span class="split-word">.
 * Spaces between words are preserved as text nodes.
 */
export function splitWords(text: string): React.ReactElement[] {
  const words = text.split(' ')
  return words.map((word, i) => (
    <React.Fragment key={i}>
      <span className="split-word">{word}</span>
      {i < words.length - 1 && ' '}
    </React.Fragment>
  ))
}

// ─── splitLines ───────────────────────────────────────────────────────────────
/**
 * Wraps each newline-separated segment in a block <span class="split-line">.
 * Use \n in your string to define line breaks.
 */
export function splitLines(text: string): React.ReactElement[] {
  return text.split('\n').map((line, i) => (
    <span key={i} className="split-line">{line}</span>
  ))
}
