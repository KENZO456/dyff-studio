'use client'

import { useScroll } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  return scrollYProgress
}
