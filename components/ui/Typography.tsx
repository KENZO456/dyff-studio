import { cn } from '@/lib/utils'
import type { HTMLAttributes, ElementType } from 'react'

/* ─────────────────────────────────────────────
   THUNDER
   Ultra-condensed display font. All hero / section / card headings.
   Supports all 8 weights (100–800) and outline variant.
───────────────────────────────────────────── */
type ThunderSize   = 'hero' | 'display' | 'section' | 'card'
type ThunderWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800
type HeadingTag    = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type ThunderTag    = HeadingTag | 'p' | 'span' | 'div'

interface ThunderProps extends HTMLAttributes<HTMLElement> {
  as?:      ThunderTag
  size?:    ThunderSize
  weight?:  ThunderWeight
  outline?: boolean
  glitch?:  boolean
}

const thunderSizeMap: Record<ThunderSize, string> = {
  hero:    'text-hero    leading-[0.88]',
  display: 'text-display leading-[0.9]',
  section: 'text-section leading-[0.95]',
  card:    'text-card-title leading-[1]',
}

export function Thunder({
  as: Tag = 'h2',
  size    = 'section',
  weight  = 400,
  outline = false,
  glitch  = false,
  className,
  style,
  children,
  ...props
}: ThunderProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn(
        'font-thunder uppercase tracking-tight',
        thunderSizeMap[size],
        outline && 'thunder-outline',
        glitch  && 'ink-glitch',
        className
      )}
      style={{ fontWeight: weight, ...style }}
      {...props}
    >
      {children}
    </Component>
  )
}

/* ─────────────────────────────────────────────
   BODY
   Libre Baskerville — warm editorial serif.
   Primary reading text across the site.
───────────────────────────────────────────── */
type BodySize = 'sm' | 'base' | 'lg' | 'xl'
type BodyTag  = 'p' | 'span' | 'div' | 'article' | 'section' | 'li'

interface BodyProps extends HTMLAttributes<HTMLElement> {
  as?:   BodyTag
  size?: BodySize
}

const bodySizeMap: Record<BodySize, string> = {
  sm:   'text-sm   leading-relaxed',
  base: 'text-base leading-[1.75]',
  lg:   'text-lg   leading-[1.75]',
  xl:   'text-xl   leading-[1.75]',
}

export function Body({
  as: Tag = 'p',
  size    = 'base',
  className,
  style,
  children,
  ...props
}: BodyProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn('font-thunder text-ink-paper', bodySizeMap[size], className)}
      style={{ fontWeight: 300, ...style }}
      {...props}
    >
      {children}
    </Component>
  )
}

/* ─────────────────────────────────────────────
   LABEL
   Space Mono — tags, metadata, badges, genre pills.
   All uppercase, wide tracking.
───────────────────────────────────────────── */
type LabelVariant = 'default' | 'badge' | 'badge-green' | 'tag' | 'meta'
type LabelTag     = 'span' | 'p' | 'div' | 'label' | 'time' | 'li'

interface LabelProps extends HTMLAttributes<HTMLElement> {
  as?:      LabelTag
  size?:    'xs' | 'sm'
  variant?: LabelVariant
}

const labelVariantMap: Record<LabelVariant, string> = {
  default:     'text-ink-ash',
  badge:       'bg-ink-green   text-ink-void     px-2 py-0.5 rounded-sm',
  'badge-green':'bg-ink-green   text-ink-void     px-2 py-0.5 rounded-sm font-bold',
  tag:         'border border-ink-ash text-ink-paper px-2 py-0.5 rounded-sm',
  meta:        'text-ink-ash border-l-2 border-ink-ash pl-2',
}

export function Label({
  as: Tag  = 'span',
  size     = 'xs',
  variant  = 'default',
  className,
  children,
  ...props
}: LabelProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn(
        'font-mono uppercase',
        size === 'xs' ? 'text-[0.65rem] tracking-[0.18em]' : 'text-sm tracking-[0.12em]',
        labelVariantMap[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/* ─────────────────────────────────────────────
   OUTLINE TEXT
   Thunder with transparent fill and ink-paper stroke.
   Use for layered typographic compositions.
───────────────────────────────────────────── */
type OutlineTag = HeadingTag | 'span' | 'div' | 'p'

interface OutlineTextProps extends HTMLAttributes<HTMLElement> {
  as?:     OutlineTag
  size?:   ThunderSize
  weight?: ThunderWeight
}

export function OutlineText({
  as: Tag = 'span',
  size    = 'hero',
  weight  = 700,
  className,
  style,
  children,
  ...props
}: OutlineTextProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn(
        'thunder-outline font-thunder uppercase tracking-tight',
        thunderSizeMap[size],
        className
      )}
      style={{ fontWeight: weight, ...style }}
      {...props}
    >
      {children}
    </Component>
  )
}
