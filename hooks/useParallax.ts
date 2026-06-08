'use client'

import { useRef } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import type { MotionValue, UseScrollOptions } from 'framer-motion'

export function useParallax(
  outputRange: [number | string, number | string],
  offset: UseScrollOptions['offset'] = ['start end', 'end start']
): { ref: React.RefObject<HTMLElement | null>; y: MotionValue<number | string> } {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const y = useTransform(scrollYProgress, [0, 1], outputRange)
  return { ref, y }
}
