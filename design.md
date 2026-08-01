# DYFF STUDIO Design System

## Typography

### Fonts
1. **Thunder (Primary Display)**
   - Used for bold, impactful headlines and large UI elements.
   - Weights: 100 (Thin) to 800 (ExtraBold).
   - Tailwind Class: `font-thunder`

2. **Baskerville / Georgia (Serif)**
   - Used for narrative text, storytelling, and elegant typography.
   - Tailwind Class: `font-serif`

3. **Space Mono / ui-monospace (Mono)**
   - Used for small technical details, badges, labels, and timestamps.
   - Tailwind Class: `font-mono`

### Fluid Font Sizes
- `text-hero`: clamp(8rem, 18vw, 22vw), line-height: 0.88
- `text-display`: clamp(4rem, 10vw, 14vw), line-height: 0.9
- `text-section`: clamp(3rem, 6vw, 10vw), line-height: 0.95
- `text-card-title`: clamp(2.5rem, 4vw, 4rem), line-height: 1

---

## Ink Color System

### Backgrounds & Surfaces
- **Void (Background):** `#080808` (`bg-ink-void`, `text-ink-void`)
- **Dark:** `#111111` (`bg-ink-dark`)
- **Surface:** `#1c1c1c` (`bg-ink-surface`)
- **Mist (Subtle Overlays):** `rgba(242,234,216,0.08)` (`bg-ink-mist`)

### Foregrounds (Text & Borders)
- **Paper (Primary Text):** `#f2ead8` (`text-ink-paper`)
- **White (High Contrast):** `#ffffff` (`text-ink-white`)
- **Ash (Muted Text/Borders):** `#3a3a3a` (`text-ink-ash`)

### Accents
- **Green (Primary Brand Accent):** `#99ca45` (`text-ink-green`, `bg-ink-green`)
- **Green Glow:** `rgba(153,202,69,0.2)` (`bg-ink-green-glow`)
- **Crimson:** `#8b0000` (`text-ink-crimson`, `bg-ink-crimson`)
- **Ember:** `#c0392b` (`text-ink-ember`, `bg-ink-ember`)
- **Gold:** `#c9a84c` (`text-ink-gold`, `bg-ink-gold`)
- **Indigo:** `#1a0050` (`bg-ink-indigo`)
- **Violet:** `#6c00b3` (`bg-ink-violet`)

---

## Key Animations & Keyframes (Tailwind Config)
- **ink-drip (`animate-ink-drip`):** Simulates a drop of ink falling and splashing.
- **ink-reveal (`animate-ink-reveal`):** Expands an element from the center outwards (`clip-path` inset animation).
- **ink-glitch (`animate-ink-glitch`):** Shifting text shadows for a digital distortion effect.
- **pulse-glow (`animate-pulse-glow`):** Pulsing box-shadow for glowing elements.

**Custom Easing:** `transition-ink` uses `cubic-bezier(0.76, 0, 0.24, 1)`.

---

## Custom Utility Classes (globals.css)

### Interactive & Visual Effects
- `.ink-drip`: Renders a slow brand-green ink drop falling from the element's bottom edge.
- `.ink-flood-up` / `.ink-flood-green`: Hover effect where green ink floods the element from the bottom up using `clip-path`.
- `.ink-reveal-text`: Text that bleeds outward from the center. Triggered by adding `.is-revealed`.
- `.ink-glitch`: Adds a duplicate color-channel shift on hover.
- `.ink-grain`: Organic noise texture overlay via SVG turbulence filter (useful for cinematic or print-like texture).
- `.thunder-outline`: Renders ghost outline text using the Thunder font and a 2px `var(--ink-paper)` stroke.

### Specialized UI Elements
- **Narrative Panels (`.narrative-panel`)**: Used in scrolling narrative sections with dynamic accent colors based on CSS variables (e.g., `--panel-accent`).
- **Book Covers (`.book-cover`)**: Special portrait frames with 3D tilt contexts (`.book-card-3d`), glowing radial gradients (`.book-cover-glow`), and a rule grid texture (`.book-rule-grid`).
- **Drop Caps (`.drop-cap`)**: Large first-letter styling using the Thunder font in green.
- **Audio Players (`.audio-player`)**: Glassmorphic dark bars with ink-bleed progress fills (`.audio-fill`) and customized input sliders (`.audio-range`).
- **Series Shelf Cards (`.audio-shelf-card`)**: Horizontal scrollable tiles with gradient overlays (`.tile-cover-gradient`), watermark text, and soundwave bars.
- **Video/Animation Cards (`.anim-card`)**: Hoverable cards that elevate, project a colored shadow, and reveal a play button overlay (`.anim-card-play`).
- **Marketplace Cards (`.market-card`)**: 3D transform cards with ink-grain texture overlays, preview eyes, and dedicated "add to cart" components.
