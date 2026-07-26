---
name: uiux-pro-max
description: Use this skill for building world-class, award-worthy frontend UI/UX for entertainment and media brands. Extends the frontend-design skill with advanced techniques for immersive web experiences including Three.js, GSAP, Lenis, parallax, and scroll sequences.
---

# UI/UX Pro Max — Immersive Web Experiences

For entertainment brands, creative studios, and media products that demand
world-class, cinematic UI/UX. This skill extends frontend-design with
advanced motion, 3D, and scroll techniques.

---

## TYPOGRAPHY SYSTEM

- Use display fonts at extreme scale (10vw–25vw) for hero text
- Implement fluid type with CSS clamp() throughout — never static px for headings
- Use letter-spacing, text-transform, and line-height as design tools
- Mix font weights dramatically within the same heading for editorial contrast
- Thunder font rules: uppercase always, tight tracking (-0.02em), extreme sizes

---

## PARALLAX SYSTEM

Install: `npm install react-scroll-parallax`

- Layer content at different scroll speeds: background (0.1x), midground (0.3x), foreground (1x)
- Use CSS transform: translateY() driven by scroll position via Framer Motion useScroll
- Create depth with z-index layering: -3 to +3
- Implement sticky storytelling sections: element pins while content scrolls past
- Use clip-path morphing driven by scroll progress
- react-scroll-parallax has built-in disabled prop — set to true on mobile

```tsx
// Framer Motion scroll-driven parallax
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 500], [0, -150])
<motion.div style={{ y }}>{children}</motion.div>
```

---

## SCROLL SEQUENCE ANIMATION SYSTEM

Install: `npm install gsap`

- Use GSAP ScrollTrigger for pin + scrub animations
- Build scroll-linked reveal sequences — animation plays frame by frame as user scrolls
- Implement text character split animations
- Use stagger on entering elements (0.05–0.1s between each child)

```tsx
// CRITICAL — sync Lenis with GSAP ScrollTrigger
// Without this, animations fight the scroll engine
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)
```

```tsx
// Sticky narrative section
ScrollTrigger.create({
  trigger: containerRef.current,
  start: "top top",
  end: "+=200%",
  pin: true,
  scrub: 1,
})
```

```tsx
// Character split entrance
const chars = text.split('').map((char, i) => (
  <span key={i} className="char">{char}</span>
))

gsap.from('.char', {
  opacity: 0,
  y: 60,
  rotateX: -90,
  stagger: 0.03,
  scrollTrigger: { trigger: ref.current, start: "top 75%" }
})
```

---

## THREE.JS INK 3D SYSTEM

Install: `npm install three @react-three/fiber @react-three/drei`

Always use React Three Fiber (R3F) — not vanilla Three.js.
Canvas: alpha: true, transparent background so ink floats over content.
Lazy load with next/dynamic + ssr: false.

### Core ink patterns:

**Ink Particle Field**
```tsx
// 3000 particles as BufferGeometry Points
// Colors: 70% paper (#f2ead8), 20% crimson (#8b0000), 10% green (#99ca45)
// Movement: simplex noise in useFrame()
// Scroll-driven: particles accelerate as user scrolls
```

**Ink Blob**
```tsx
// IcosahedronGeometry (radius: 1.5, detail: 6)
// ShaderMaterial with perlin noise vertex displacement
// Fresnel effect — glows at silhouette
// Scroll-driven: blob responds to scroll position
```

**Ink Trails**
```tsx
// Line geometry tracing last 60 mouse positions
// Color: crimson → indigo along trail length
// Opacity fades: 1.0 → 0.0 from mouse to tail
```

**Atmosphere Lighting**
```tsx
<ambientLight intensity={0.2} color="#1a0050" />
<pointLight position={[0, 5, 0]} intensity={0.8} color="#8b0000" />
<pointLight position={[0, -5, 0]} intensity={0.3} color="#c9a84c" />
```

---

## SMOOTH SCROLL

Install: `npm install lenis`

```tsx
// app/layout.tsx — global smooth scroll
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  const lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => { lenis.raf(time * 1000) })
  gsap.ticker.lagSmoothing(0)
  return () => lenis.destroy()
}, [])
```

---

## MOTION CHOREOGRAPHY

- Every page load has a grand entrance: staggered reveal of all hero elements
- Scroll micro-interactions: cursor parallax, magnetic buttons, hover distortions
- Page transitions: scene wipes, not fades — dramatic cinematic transitions
- Custom cursor: 12px circle that expands on hover, ink splatter on click

```tsx
// Framer Motion page transition
// Black ink panel slides in from left, recedes to reveal new page
const variants = {
  initial:  { clipPath: 'inset(0 100% 0 0)' },
  animate:  { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  exit:     { clipPath: 'inset(0 0 0 100%)', transition: { duration: 0.4 } },
}
```

---

## COMPONENT HIERARCHY FOR ENTERTAINMENT SITES

1. **ImmersiveHero** — Three.js canvas + parallax text layers
2. **StickyNarrative** — scrolling story section with pinned visual
3. **ParallaxGrid** — staggered content grid with depth layers
4. **ScrollRevealSection** — GSAP-driven entrance
5. **CinematicCard** — hover: 3D tilt + ink flood
6. **PersistentPlayer** — audio/video player that survives navigation

---

## INK CSS EFFECTS

```css
/* Ink flood up — on hover, crimson floods from bottom */
.ink-flood-up {
  position: relative;
  overflow: hidden;
}
.ink-flood-up::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--ink-crimson);
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}
.ink-flood-up:hover::before { transform: translateY(0); }

/* Ink reveal — text appears as ink bleeds left to right */
.ink-reveal {
  clip-path: inset(0 100% 0 0);
  animation: inkReveal 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards;
}
@keyframes inkReveal {
  to { clip-path: inset(0 0% 0 0); }
}

/* Thunder outline text */
.thunder-outline {
  -webkit-text-stroke: 1px var(--ink-paper);
  color: transparent;
}
```

---

## DYFF DESIGN TOKENS

```css
:root {
  /* Colors */
  --ink-void:    #080808;
  --ink-dark:    #111111;
  --ink-surface: #1c1c1c;
  --ink-paper:   #f2ead8;
  --ink-white:   #ffffff;
  --ink-crimson: #8b0000;
  --ink-ember:   #c0392b;
  --ink-green:   #99ca45;
  --ink-gold:    #c9a84c;
  --ink-indigo:  #1a0050;
  --ink-violet:  #6c00b3;
  --ink-ash:     #3a3a3a;
}
```

---

## PERFORMANCE RULES

- Lazy load Three.js canvas: `next/dynamic` with `ssr: false`
- Disable heavy animations on `prefers-reduced-motion`
- On mobile: replace Three.js canvas with CSS-only fallback
- Use `will-change: transform` only where needed
- Throttle scroll listeners with `requestAnimationFrame`
- Device detection: `navigator.hardwareConcurrency < 4` = low-end, reduce effects

---

## MOBILE RULES

- All Thunder headings: `clamp(3rem, 15vw, 14rem)` — never static px
- Three.js on mobile: disable InkTrails, reduce particles to 500
- GSAP sticky sections: convert to normal vertical stack on mobile
- Horizontal scroll: disable GSAP, use native `overflow-x: scroll`
- Parallax: disabled prop = true on mobile via screen width detection

---

## WHEN CLAUDE CODE READS THIS SKILL

1. Install all required packages before writing any component
2. Always sync Lenis with GSAP ScrollTrigger — this is non-negotiable
3. Lazy load Three.js with next/dynamic + ssr: false
4. Use DYFF design tokens from globals.css — never hardcode colours
5. Every page load gets a grand entrance animation
6. All hover effects have touch-friendly tap equivalents on mobile
7. Respect prefers-reduced-motion — disable GSAP and Three.js rotation
8. Thunder font: always uppercase, always clamp() for sizing
9. Page transitions use Framer Motion AnimatePresence
10. Audio player uses React Context so it persists across navigation
