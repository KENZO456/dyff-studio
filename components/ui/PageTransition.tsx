'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isFirst  = useRef(true)
  const pathname = usePathname()

  // Capture-phase click listener fires BEFORE Next.js router processes the navigation.
  // Killing all ScrollTriggers here reverts GSAP's pin-spacer DOM wrappers, so React can
  // cleanly unmount pinned components without hitting removeChild mismatches.
  useEffect(() => {
    const onLinkClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      ScrollTrigger.getAll().forEach(t => t.kill(true))
    }
    document.addEventListener('click', onLinkClick, true)
    return () => document.removeEventListener('click', onLinkClick, true)
  }, [])

  // Ink-panel wipe animation on route change
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    const panel = panelRef.current
    if (!panel) return

    gsap.timeline()
      .set(panel, { visibility: 'visible', x: '-100%' })
      .to(panel,  { x: '0%',   duration: 0.3,  ease: 'power3.inOut' })
      .to(panel,  { x: '100%', duration: 0.32, ease: 'power3.inOut', delay: 0.09 })
      .set(panel, { visibility: 'hidden' })
  }, [pathname])

  return (
    <>
      <div ref={panelRef} className="page-transition-panel" aria-hidden="true" />
      {children}
    </>
  )
}
