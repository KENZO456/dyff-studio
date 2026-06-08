'use client'

import { useState } from 'react'
import { Thunder, Body, Label, OutlineText } from '@/components/ui/Typography'
import { cn } from '@/lib/utils'

/* ─── Color Tokens ─────────────────────────── */
const COLOR_TOKENS = [
  { name: '--ink-void',       hex: '#080808',               label: 'void',       usage: 'deepest bg' },
  { name: '--ink-dark',       hex: '#111111',               label: 'dark',       usage: 'card / panel bg' },
  { name: '--ink-surface',    hex: '#1c1c1c',               label: 'surface',    usage: 'elevated surfaces' },
  { name: '--ink-paper',      hex: '#f2ead8',               label: 'paper',      usage: 'primary text / parchment' },
  { name: '--ink-white',      hex: '#ffffff',               label: 'white',      usage: 'pure white accents' },
  { name: '--ink-crimson',    hex: '#8b0000',               label: 'crimson',    usage: 'blood ink — series / books accent' },
  { name: '--ink-ember',      hex: '#c0392b',               label: 'ember',      usage: 'brighter red — hover states' },
  { name: '--ink-gold',       hex: '#c9a84c',               label: 'gold',       usage: 'illuminated manuscript gold' },
  { name: '--ink-green',      hex: '#99ca45',               label: 'green',      usage: 'DYFF brand green — primary accent / CTA' },
  { name: '--ink-green-glow', hex: 'rgba(153,202,69,0.2)',  label: 'green-glow', usage: 'ambient glow / badge bg' },
  { name: '--ink-indigo',     hex: '#1a0050',               label: 'indigo',     usage: 'deep ink blue-purple' },
  { name: '--ink-violet',     hex: '#6c00b3',               label: 'violet',     usage: 'electric violet — secondary' },
  { name: '--ink-ash',        hex: '#3a3a3a',               label: 'ash',        usage: 'muted text / borders' },
  { name: '--ink-mist',       hex: 'rgba(242,234,216,0.08)',label: 'mist',       usage: 'subtle surface tint' },
] as const

/* ─── Thunder Weights ──────────────────────── */
const WEIGHTS = [
  { w: 100, label: 'Thin (100)' },
  { w: 200, label: 'ExtraLight (200)' },
  { w: 300, label: 'Light (300)' },
  { w: 400, label: 'Regular (400)' },
  { w: 500, label: 'Medium (500)' },
  { w: 600, label: 'SemiBold (600)' },
  { w: 700, label: 'Bold (700)' },
  { w: 800, label: 'ExtraBold (800)' },
] as const

/* ─── Spacing Tokens ───────────────────────── */
const SPACING_TOKENS = [
  { token: 'spacing-4',   rem: '1rem',   px: '16px' },
  { token: 'spacing-8',   rem: '2rem',   px: '32px' },
  { token: 'spacing-16',  rem: '4rem',   px: '64px' },
  { token: 'spacing-18',  rem: '4.5rem', px: '72px' },
  { token: 'spacing-72',  rem: '18rem',  px: '288px' },
  { token: 'spacing-128', rem: '32rem',  px: '512px' },
  { token: 'spacing-160', rem: '40rem',  px: '640px' },
  { token: 'spacing-200', rem: '50rem',  px: '800px' },
]

export default function DesignSystemPage() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="bg-ink-void min-h-screen text-ink-paper">

      {/* ── HEADER ──────────────────────────── */}
      <header className="px-6 pt-20 pb-12 border-b border-ink-ash">
        <Label variant="meta" className="mb-4 block">DYFF Studios / dev only</Label>
        <Thunder as="h1" size="hero" weight={800} className="text-ink-paper">
          Ink System
        </Thunder>
        <OutlineText size="hero" weight={200} className="block -mt-4 opacity-30 select-none pointer-events-none">
          Design
        </OutlineText>
        <Body size="xl" className="mt-8 max-w-xl text-ink-ash">
          Ideas are ticking time bombs waiting to set off.
          Every token, type style, and animation in this system traces back to ink meeting surface.
        </Body>
      </header>

      <main className="px-6 pb-32 space-y-24 pt-20 max-w-[1400px]">

        {/* ── COLOR TOKENS ─────────────────── */}
        <section>
          <SectionTitle index="01">Color Tokens</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3 mt-10">
            {COLOR_TOKENS.map(({ name, hex, label, usage }) => (
              <div key={name} className="group space-y-2">
                <div
                  className="h-16 rounded-sm border border-ink-ash/30 ink-grain"
                  style={{ background: hex }}
                />
                <Label className="block text-ink-paper">{label}</Label>
                <span className="block font-mono text-[0.6rem] text-ink-ash break-all">{hex}</span>
                <span className="block font-serif text-[0.65rem] text-ink-ash/70 leading-snug">{usage}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TYPOGRAPHY SCALE ─────────────── */}
        <section>
          <SectionTitle index="02">Typography Scale</SectionTitle>

          <div className="mt-10 space-y-2 overflow-hidden">
            <div className="border-b border-ink-ash/20 pb-4">
              <Label variant="meta" className="mb-2 block">hero — 18vw / Thunder 800</Label>
              <Thunder as="h2" size="hero" weight={800} className="text-ink-paper">
                DYFF
              </Thunder>
            </div>

            <div className="border-b border-ink-ash/20 py-4">
              <Label variant="meta" className="mb-2 block">display — 10vw / Thunder 700</Label>
              <Thunder as="h2" size="display" weight={700} className="text-ink-paper">
                Ink Is Origin
              </Thunder>
            </div>

            <div className="border-b border-ink-ash/20 py-4">
              <Label variant="meta" className="mb-2 block">section — 6vw / Thunder 600</Label>
              <Thunder as="h2" size="section" weight={600} className="text-ink-paper">
                Books · Audio · Animations
              </Thunder>
            </div>

            <div className="border-b border-ink-ash/20 py-4">
              <Label variant="meta" className="mb-2 block">card-title — 4vw / Thunder 700</Label>
              <Thunder as="h3" size="card" weight={700} className="text-ink-paper">
                The Crimson Archive
              </Thunder>
            </div>

            <div className="border-b border-ink-ash/20 py-4">
              <Label variant="meta" className="mb-2 block">Body — Libre Baskerville / base</Label>
              <Body>
                The act of putting ink to surface is the first and most honest form of creation.
                Every story, every score, every frame drawn by hand — it begins the same way.
                A mark. A trace. A statement of intention made permanent by pressure and pigment.
              </Body>
            </div>

            <div className="border-b border-ink-ash/20 py-4">
              <Label variant="meta" className="mb-2 block">Label — Space Mono / variants</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                <Label>default label</Label>
                <Label variant="badge">crimson badge</Label>
                <Label variant="badge-green">new release</Label>
                <Label variant="tag">thriller</Label>
                <Label variant="tag">action</Label>
                <Label variant="tag">audio series</Label>
              </div>
            </div>
          </div>
        </section>

        {/* ── FONT WEIGHTS ─────────────────── */}
        <section>
          <SectionTitle index="03">Thunder — 8 Weights</SectionTitle>
          <div className="mt-10 space-y-0 divide-y divide-ink-ash/20">
            {WEIGHTS.map(({ w, label }) => (
              <div key={w} className="flex items-baseline gap-6 py-3">
                <Label size="xs" className="w-36 shrink-0 text-ink-ash">{label}</Label>
                <span
                  className="font-thunder uppercase text-[clamp(2rem,5vw,5rem)] leading-none text-ink-paper tracking-tight"
                  style={{ fontWeight: w }}
                >
                  IDEAS EXPLODE
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── OUTLINE TEXT ─────────────────── */}
        <section>
          <SectionTitle index="04">Outline Text — Ghost Layers</SectionTitle>
          <div className="mt-10 relative">
            <OutlineText size="display" weight={800} className="block opacity-20 select-none">
              DYFF Studios
            </OutlineText>
            <Thunder
              as="h2"
              size="display"
              weight={800}
              className="text-ink-green absolute inset-0"
            >
              DYFF Studios
            </Thunder>
          </div>
          <Body size="sm" className="text-ink-ash mt-6 max-w-md">
            Solid text layered over outline text. Use <code className="font-mono text-ink-green text-xs">.thunder-outline</code> or the <code className="font-mono text-ink-green text-xs">OutlineText</code> component. Combine with z-index for depth.
          </Body>
        </section>

        {/* ── INK ANIMATIONS ───────────────── */}
        <section>
          <SectionTitle index="05">Ink Animations</SectionTitle>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* ink-drip */}
            <AnimCard label=".ink-drip" description="Slow crimson drop from element bottom. Auto-loops.">
              <div className="ink-drip inline-block bg-ink-surface px-8 py-4 rounded-sm">
                <Label>Hover me</Label>
              </div>
            </AnimCard>

            {/* ink-flood-up */}
            <AnimCard label=".ink-flood-up" description="Brand green floods from bottom on hover. 0.4s ink ease.">
              <button className="ink-flood-up border border-ink-green px-8 py-4 rounded-sm">
                <span className="font-thunder uppercase text-2xl text-ink-paper tracking-tight">
                  Flood Up
                </span>
              </button>
            </AnimCard>

            {/* ink-reveal-text */}
            <AnimCard label=".ink-reveal-text" description="Text bleeds from center. Trigger .is-revealed class.">
              <div className="space-y-4">
                <Thunder
                  as="h3"
                  size="section"
                  weight={700}
                  className={cn(
                    'ink-reveal-text text-ink-paper',
                    revealed && 'is-revealed'
                  )}
                >
                  REVEALED
                </Thunder>
                <button
                  onClick={() => setRevealed(false)}
                  onMouseEnter={() => setRevealed(true)}
                  className="ink-flood-up border border-ink-ash px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-sm cursor-pointer"
                >
                  <span>Hover to reveal</span>
                </button>
              </div>
            </AnimCard>

            {/* ink-glitch */}
            <AnimCard label=".ink-glitch" description="Color-channel shift on hover. Red + cyan split.">
              <Thunder as="h3" size="section" weight={800} className="ink-glitch text-ink-paper cursor-default">
                GLITCH
              </Thunder>
            </AnimCard>

            {/* ink-grain */}
            <AnimCard label=".ink-grain" description="SVG noise overlay. Organic texture on cards and panels.">
              <div className="ink-grain bg-ink-surface w-full h-24 rounded-sm flex items-center justify-center">
                <Label className="text-ink-paper">Grain texture active</Label>
              </div>
            </AnimCard>

            {/* thunder-outline */}
            <AnimCard label=".thunder-outline" description="Transparent fill, ink-paper stroke. Ghost text layers.">
              <span
                className="thunder-outline font-thunder text-[clamp(3rem,8vw,6rem)] uppercase leading-none tracking-tight"
                style={{ fontWeight: 800 }}
              >
                Ghost
              </span>
            </AnimCard>
          </div>
        </section>

        {/* ── SPACING SCALE ────────────────── */}
        <section>
          <SectionTitle index="06">Spacing Scale</SectionTitle>
          <div className="mt-10 space-y-3">
            {SPACING_TOKENS.map(({ token, rem, px }) => (
              <div key={token} className="flex items-center gap-4">
                <Label size="xs" className="w-28 shrink-0 text-ink-ash">{token}</Label>
                <div
                  className="h-3 bg-ink-green/60 rounded-[1px] min-w-[4px]"
                  style={{ width: `min(${rem}, 60vw)` }}
                />
                <Label size="xs" className="text-ink-ash">{rem} / {px}</Label>
              </div>
            ))}
          </div>
        </section>

        {/* ── CHECKLIST ────────────────────── */}
        <section>
          <SectionTitle index="07">Pre-Delivery Checklist</SectionTitle>
          <ul className="mt-8 space-y-2 max-w-lg">
            {[
              'No emojis as icons — use SVG (Lucide)',
              'cursor-pointer on ALL clickable elements',
              'Hover states: smooth 150–300ms transitions',
              'Dark bg only for ink-green — never on ink-paper (contrast fails)',
              'Focus states visible for keyboard nav',
              'prefers-reduced-motion respected globally',
              'Responsive at 375px / 768px / 1024px / 1440px',
              'Thunder hero: 12vw–22vw. Section: 6vw–10vw.',
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-[0.6rem] text-ink-green mt-1 shrink-0">✓</span>
                <Body size="sm" className="text-ink-ash">{item}</Body>
              </li>
            ))}
          </ul>
        </section>

      </main>
    </div>
  )
}

/* ─── Section Title ─────────────────────────── */
function SectionTitle({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-6 border-b border-ink-ash/40 pb-4">
      <Label variant="meta">{index}</Label>
      <Thunder as="h2" size="card" weight={700} className="text-ink-paper">
        {children}
      </Thunder>
    </div>
  )
}

/* ─── Animation Demo Card ───────────────────── */
function AnimCard({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-ink-dark border border-ink-ash/20 rounded-sm p-6 space-y-4 ink-grain">
      <Label variant="tag">{label}</Label>
      <div className="flex items-center justify-center min-h-[100px]">
        {children}
      </div>
      <Body size="sm" className="text-ink-ash">{description}</Body>
    </div>
  )
}
