'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const HOVER_SELECTOR = 'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]'

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const splatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const splat = splatRef.current
    if (!dot) return

    gsap.set([dot, splat].filter(Boolean), { xPercent: -50, yPercent: -50, x: -300, y: -300 })
    if (splat) gsap.set(splat, { opacity: 0, scale: 0 })

    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.07, ease: 'none', overwrite: true })
    }

    const onOver = (e: MouseEvent) => {
      if (!(e.target as Element).closest(HOVER_SELECTOR)) return
      dot.classList.add('cursor-hovered')
      gsap.to(dot, { scale: 2.6, duration: 0.22, ease: 'elastic.out(1.1, 0.6)' })
    }

    const onOut = (e: MouseEvent) => {
      if (!(e.target as Element).closest(HOVER_SELECTOR)) return
      dot.classList.remove('cursor-hovered')
      gsap.to(dot, { scale: 1, duration: 0.22, ease: 'elastic.out(1.1, 0.6)' })
    }

    const onClick = (e: MouseEvent) => {
      if (!splat) return
      gsap.set(splat,  { x: e.clientX, y: e.clientY, scale: 0, opacity: 1 })
      gsap.to(splat,   { scale: 2, opacity: 0, duration: 0.3, ease: 'power1.out' })
    }

    const onLeave = () => { gsap.to(dot, { opacity: 0, duration: 0.25 }) }
    const onEnter = () => { gsap.to(dot, { opacity: 0.8, duration: 0.2 }) }

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseover',  onOver)
    window.addEventListener('mouseout',   onOut)
    window.addEventListener('click',      onClick)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      document.documentElement.style.cursor = ''
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mouseout',   onOut)
      window.removeEventListener('click',      onClick)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />

      {/* Ink splatter burst on click */}
      <div ref={splatRef} className="cursor-splatter" aria-hidden="true">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <circle  cx="25" cy="25" r="9"   fill="rgba(153,202,69,0.85)" />
          <ellipse cx="8"  cy="14" rx="4.5" ry="2"   fill="rgba(153,202,69,0.6)"  transform="rotate(-35 8 14)"  />
          <ellipse cx="42" cy="12" rx="3.5" ry="1.8" fill="rgba(153,202,69,0.5)"  transform="rotate(25 42 12)"  />
          <ellipse cx="7"  cy="36" rx="3"   ry="1.8" fill="rgba(153,202,69,0.5)"  transform="rotate(-50 7 36)"  />
          <ellipse cx="43" cy="37" rx="3.5" ry="2"   fill="rgba(153,202,69,0.45)" transform="rotate(20 43 37)"  />
          <ellipse cx="25" cy="5"  rx="2.5" ry="1.5" fill="rgba(153,202,69,0.4)"  />
          <ellipse cx="22" cy="45" rx="2"   ry="1.8" fill="rgba(153,202,69,0.35)" />
          <circle  cx="37" cy="21" r="2.5"  fill="rgba(153,202,69,0.3)"  />
          <circle  cx="12" cy="30" r="2"    fill="rgba(153,202,69,0.3)"  />
        </svg>
      </div>
    </>
  )
}
