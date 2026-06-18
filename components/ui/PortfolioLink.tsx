'use client'

import { useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

interface PortfolioLinkProps {
  children: React.ReactNode
  className?: string
}

export default function PortfolioLink({ children, className }: PortfolioLinkProps) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const router     = useRouter()
  const animating  = useRef(false)

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/kenny') return
    if (animating.current) return
    e.preventDefault()
    animating.current = true

    const curtain = curtainRef.current
    if (!curtain) { router.push('/kenny'); return }

    gsap.timeline({ onComplete: () => { animating.current = false } })
      .set(curtain,  { visibility: 'visible', y: '100%' })
      .to(curtain,   { y: '0%',    duration: 0.55, ease: 'power3.inOut' })
      .call(()       => router.push('/kenny'))
      .to(curtain,   { y: '-100%', duration: 0.45, ease: 'power3.inOut', delay: 0.18 })
      .set(curtain,  { visibility: 'hidden' })
  }, [router])

  return (
    <>
      <a href="/kenny" onClick={handleClick} className={className}>
        {children}
      </a>
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
        className="fixed inset-0 z-[9999] bg-[#0a0a0a] pointer-events-none"
      />
    </>
  )
}
