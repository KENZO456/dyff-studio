'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/Typography'

export type CardStackItem = {
  id:          string | number
  title:       string
  description?: string
  imageSrc?:   string
  href?:       string
  tag?:        string
}

export type CardStackProps<T extends CardStackItem> = {
  items:            T[]
  initialIndex?:    number
  maxVisible?:      number
  cardWidth?:       number
  cardHeight?:      number
  overlap?:         number
  spreadDeg?:       number
  perspectivePx?:   number
  depthPx?:         number
  tiltXDeg?:        number
  activeLiftPx?:    number
  activeScale?:     number
  inactiveScale?:   number
  springStiffness?: number
  springDamping?:   number
  loop?:            boolean
  autoAdvance?:     boolean
  intervalMs?:      number
  pauseOnHover?:    boolean
  showDots?:        boolean
  className?:       string
  onChangeIndex?:   (index: number, item: T) => void
  renderCard?:      (item: T, state: { active: boolean }) => React.ReactNode
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0
  return ((n % len) + len) % len
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active
  if (!loop || len <= 1) return raw
  const alt = raw > 0 ? raw - len : raw + len
  return Math.abs(alt) < Math.abs(raw) ? alt : raw
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex    = 0,
  maxVisible      = 5,
  cardWidth       = 500,
  cardHeight      = 340,
  overlap         = 0.48,
  spreadDeg       = 40,
  perspectivePx   = 1100,
  depthPx         = 120,
  tiltXDeg        = 10,
  activeLiftPx    = 24,
  activeScale     = 1.03,
  inactiveScale   = 0.93,
  springStiffness = 280,
  springDamping   = 28,
  loop            = true,
  autoAdvance     = false,
  intervalMs      = 2800,
  pauseOnHover    = true,
  showDots        = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion()
  const len          = items.length

  const [active,   setActive]   = React.useState(() => wrapIndex(initialIndex, len))
  const [hovering, setHovering] = React.useState(false)

  React.useEffect(() => { setActive(a => wrapIndex(a, len)) }, [len])
  React.useEffect(() => {
    if (!len) return
    onChangeIndex?.(active, items[active]!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const maxOffset  = Math.max(0, Math.floor(maxVisible / 2))
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)))
  const stepDeg    = maxOffset > 0 ? spreadDeg / maxOffset : 0

  const canGoPrev = loop || active > 0
  const canGoNext = loop || active < len - 1

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return
    setActive(a => wrapIndex(a - 1, len))
  }, [canGoPrev, len])

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return
    setActive(a => wrapIndex(a + 1, len))
  }, [canGoNext, len])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prev()
    if (e.key === 'ArrowRight') next()
  }

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return
    if (pauseOnHover && hovering) return
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next()
    }, Math.max(700, intervalMs))
    return () => window.clearInterval(id)
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next])

  if (!len) return null

  const activeItem = items[active]!

  return (
    <div
      className={cn('w-full', className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full"
        style={{ height: cardHeight + 100 }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ perspective: `${perspectivePx}px` }}
        >
          {items.map((item, i) => {
            const off      = signedOffset(i, active, len, loop)
            const abs      = Math.abs(off)
            const visible  = abs <= maxOffset

            const rotateZ  = off * stepDeg
            const x        = off * cardSpacing
            const y        = abs * 10
            const isActive = off === 0
            const scale    = isActive ? activeScale : inactiveScale
            const lift     = isActive ? -activeLiftPx : 0
            const rotateX  = isActive ? 0 : tiltXDeg
            const zIndex   = visible ? 100 - abs : 0
            const opacity  = visible ? 1 : 0

            const dragProps = isActive ? {
              drag:            'x' as const,
              dragConstraints: { left: 0, right: 0 },
              dragElastic:     0.18,
              onDragEnd:       (_e: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
                if (reduceMotion) return
                const threshold = Math.min(160, cardWidth * 0.22)
                if (info.offset.x > threshold || info.velocity.x > 650)  prev()
                else if (info.offset.x < -threshold || info.velocity.x < -650) next()
              },
            } : {}

            return (
              <motion.div
                key={item.id}
                className={cn(
                  'absolute bottom-0 rounded-sm overflow-hidden border border-ink-ash/20',
                  'will-change-transform select-none',
                  isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
                )}
                style={{ width: cardWidth, height: cardHeight, zIndex, pointerEvents: visible ? 'auto' : 'none' }}
                animate={{ opacity, x, y: y + lift, rotateZ, rotateX, scale }}
                transition={{ type: 'spring', stiffness: springStiffness, damping: springDamping }}
                onClick={() => !isActive && setActive(i)}
                {...dragProps}
              >
                {renderCard
                  ? renderCard(item, { active: isActive })
                  : <DyffFanCard item={item} active={isActive} />
                }
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      {showDots && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => (
              <button
                key={it.id}
                onClick={() => setActive(idx)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  idx === active
                    ? 'w-5 h-[3px] bg-ink-green'
                    : 'w-[6px] h-[6px] bg-ink-ash/40 hover:bg-ink-ash/70',
                )}
                aria-label={`Go to ${it.title}`}
              />
            ))}
          </div>
          {activeItem.href && (
            <Link
              href={activeItem.href}
              className="ml-2 text-ink-ash/50 hover:text-ink-green transition-colors"
              aria-label="Open"
            >
              <svg width="14" height="14" viewBox="0 0 22 12" fill="none">
                <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="currentColor"/>
              </svg>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function DyffFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full bg-ink-dark">
      {/* Image */}
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            draggable={false}
            loading="eager"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-surface text-ink-ash text-sm">
            No image
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Tag */}
      {item.tag && (
        <div className="absolute top-4 left-4">
          <Label variant="tag">{item.tag}</Label>
        </div>
      )}

      {/* Active green accent line */}
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-ink-green" />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <span
          className="font-thunder uppercase text-ink-paper leading-none tracking-tight block"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
        >
          {item.title}
        </span>
        {item.description && (
          <p className="mt-2 text-sm text-ink-white/70 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        {active && item.href && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px w-4 bg-ink-green" />
            <Label className="text-ink-green tracking-[0.2em] text-[0.6rem]">EXPLORE</Label>
          </div>
        )}
      </div>
    </div>
  )
}
