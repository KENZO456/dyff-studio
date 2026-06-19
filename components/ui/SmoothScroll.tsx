'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisContext } from '@/hooks/useLenis'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenisInstance = new Lenis({
      autoRaf:         false,
      lerp:            0.14,   // 0.1 felt heavy; 0.14 is snappy while still smooth
      smoothWheel:     true,
      wheelMultiplier: 1.3,    // more travel per scroll notch
      touchMultiplier: 2.2,
      infinite:        false,
    })

    setLenis(lenisInstance)

    lenisInstance.on('scroll', ScrollTrigger.update)

    const rafCallback = (time: number) => {
      lenisInstance.raf(time * 1000)
    }

    gsap.ticker.add(rafCallback)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenisInstance.destroy()
      gsap.ticker.remove(rafCallback)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
