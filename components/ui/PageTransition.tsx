'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isFirst  = useRef(true)
  const pathname = usePathname()

  useEffect(() => {
    // Skip on initial load — only animate on subsequent navigations
    if (isFirst.current) { isFirst.current = false; return }
    const panel = panelRef.current
    if (!panel) return

    // Ink panel: slides in from left (covers screen), then exits right (reveals page)
    gsap.timeline()
      .set(panel, { visibility: 'visible', x: '-100%' })
      .to(panel,  { x: '0%',   duration: 0.3,  ease: 'power3.inOut' })
      .to(panel,  { x: '100%', duration: 0.32, ease: 'power3.inOut', delay: 0.09 })
      .set(panel, { visibility: 'hidden' })
  }, [pathname])

  return (
    <>
      {/* Fixed ink panel — invisible by default, animated on route change */}
      <div ref={panelRef} className="page-transition-panel" aria-hidden="true" />
      {children}
    </>
  )
}
