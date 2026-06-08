'use client'

/**
 * <ParallaxLayer> — wraps children in a scroll-driven translateY.
 *
 * Desktop (≥768px): content drifts at `speed` × normal scroll rate.
 * Mobile (<768px):  parallax is disabled — content is statically positioned.
 *                   react-scroll-parallax equivalent of disabled={true}.
 *
 * Positive speed → content lags behind (floats behind the scroll).
 * Negative speed → content moves opposite to scroll (rises as you scroll down).
 */

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxLayerProps {
  children:    React.ReactNode
  /** Fraction of scroll speed. 0.3 = 30% drift. Negative = opposite direction. */
  speed?:      number
  /** Percentage of element height for the total Y travel. Default: 100 */
  range?:      number
  className?:  string
  /** overflow on the clipping wrapper. Default: 'hidden' */
  overflow?:   'hidden' | 'visible' | 'clip'
}

export default function ParallaxLayer({
  children,
  speed    = 0.2,
  range    = 100,
  className,
  overflow = 'hidden',
}: ParallaxLayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Detect mobile after hydration — avoids SSR mismatch
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({
    target:  wrapperRef,
    offset:  ['start end', 'end start'],
  })

  // On mobile the transform collapses to 0% → 0% (no movement)
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ['0%', '0%'] : ['0%', `${speed * range}%`],
  )

  const overflowClass = overflow === 'hidden' ? 'parallax-hidden'
    : overflow === 'clip' ? 'parallax-clip'
    : 'parallax-visible'

  return (
    <div
      ref={wrapperRef}
      className={[overflowClass, className].filter(Boolean).join(' ')}
    >
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
