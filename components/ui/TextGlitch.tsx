'use client'

import { useEffect, useRef, useState } from 'react'

interface TextGlitchProps {
  text:       string
  hoverText?: string
  className?: string
  delay?:     number
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function scramble(target: string, progress: number): string {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (i < progress) return target[i]!
      return LETTERS[Math.floor(Math.random() * 26)]!
    })
    .join('')
}

export function TextGlitch({ text, hoverText, className = '', delay = 0 }: TextGlitchProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const overlayRef = useRef<HTMLSpanElement>(null)

  const [displayText,  setDisplayText]  = useState(() => scramble(text, 0))
  const [displayHover, setDisplayHover] = useState(hoverText ?? text)

  const hoverInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // On mount: scramble → resolve main text, then GSAP gradient fill
  useEffect(() => {
    let iteration = 0
    const total   = text.replace(/ /g, '').length

    const id = setInterval(() => {
      setDisplayText(scramble(text, Math.floor(iteration)))
      iteration += total / 28

      if (iteration >= text.length) {
        setDisplayText(text)
        clearInterval(id)

        // Gradient fill in after scramble resolves
        const runGSAP = async () => {
          const { gsap } = await import('gsap')
          if (!headingRef.current) return
          gsap.fromTo(
            headingRef.current,
            { backgroundSize: '0% 100%', opacity: 0.5 },
            {
              backgroundSize: '100% 100%',
              opacity:        1,
              duration:       1.6,
              delay,
              ease:           'power3.out',
            },
          )
        }
        runGSAP()
      }
    }, 35)

    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMouseEnter = () => {
    if (!hoverText) return
    let iteration = 0
    if (hoverInterval.current) clearInterval(hoverInterval.current)

    hoverInterval.current = setInterval(() => {
      setDisplayHover(scramble(hoverText, Math.floor(iteration)))
      if (iteration >= hoverText.length) {
        setDisplayHover(hoverText)
        clearInterval(hoverInterval.current!)
      }
      iteration += 1 / 3
    }, 30)

    if (overlayRef.current) {
      overlayRef.current.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
    }
  }

  const handleMouseLeave = () => {
    if (hoverInterval.current) clearInterval(hoverInterval.current)
    setDisplayHover(hoverText ?? text)
    if (overlayRef.current) {
      overlayRef.current.style.clipPath = 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)'
    }
  }

  useEffect(() => () => {
    if (hoverInterval.current) clearInterval(hoverInterval.current)
  }, [])

  return (
    <h1
      ref={headingRef}
      className={`
        text-glitch-heading
        relative m-0 leading-none tracking-tight cursor-pointer select-none
        font-thunder uppercase
        overflow-hidden
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}

      {hoverText && (
        <span
          ref={overlayRef}
          className="
            text-glitch-overlay
            absolute inset-0 flex items-center justify-center
            font-thunder uppercase tracking-tight leading-none
            pointer-events-none overflow-hidden whitespace-nowrap
          "
        >
          {displayHover}
        </span>
      )}
    </h1>
  )
}
