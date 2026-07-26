---
name: remotion
description: "Use this skill whenever the user wants to create, build, or render videos using Remotion — the React-based video framework. Triggers include: any mention of 'Remotion', 'render a video with React', 'programmatic video', 'animated video in code', 'React video', or requests to build video intros, trailers, social clips, or motion graphics using code. Also trigger when the user wants to animate text, logos, or brand assets into an MP4 or WebM file using React components."
---

# Remotion — React-Based Video Creation

## Overview

Remotion is a framework for creating videos using React. Every frame of the video
is a React component. Remotion renders each frame as an image and stitches them
into an MP4 or WebM file.

**Core mental model:**
- Frame number = time
- CSS properties driven by frame number = animation
- Composition = the full video
- Sequence = a timed section inside a composition

---

## Installation

```bash
# New project
npx create-video@latest

# Add to existing project
npm install remotion @remotion/cli
```

---

## Project Structure

```
src/
├── Root.tsx           — registers all Composition entries
├── compositions/      — one file per video
├── components/        — reusable animated components
└── lib/tokens.ts      — brand tokens, colors, fonts
public/
└── fonts/             — local font files (TTF, OTF)
remotion.config.ts     — render settings
```

---

## Core Hooks and APIs

### useCurrentFrame
Returns the current frame number. Always starts at 0.
This is the primary input for all animations.

```tsx
import { useCurrentFrame } from 'remotion'
const frame = useCurrentFrame()
```

### useVideoConfig
Returns composition metadata.

```tsx
import { useVideoConfig } from 'remotion'
const { width, height, fps, durationInFrames } = useVideoConfig()
```

### interpolate
Maps a frame range to an output range. Core animation primitive.
Always include extrapolateLeft/Right: 'clamp' to prevent overshoot.

```tsx
import { interpolate } from 'remotion'

const opacity = interpolate(
  frame,
  [0, 30],      // input: frame 0 to 30
  [0, 1],       // output: opacity 0 to 1
  { extrapolateRight: 'clamp' }
)
```

### spring
Physics-based animation. More natural than interpolate for entrances.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'

const { fps } = useVideoConfig()
const frame = useCurrentFrame()

const scale = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 200, mass: 0.5 }
})
```

**When to use what:**
- `interpolate` → precise control, linear or eased movement, fades, slides
- `spring` → entrances, bounces, anything that should feel physical and alive

---

## Composition and Sequence

### Composition — defines a video

```tsx
// Root.tsx
import { Composition } from 'remotion'
import { MyVideo } from './compositions/MyVideo'

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"            // used in render command
    component={MyVideo}
    durationInFrames={150}  // 5 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
)
```

### Sequence — times a component within a composition

```tsx
import { Sequence } from 'remotion'

// Inside a composition
<Sequence from={0}  durationInFrames={60}>
  <LogoReveal />    // plays frames 0–59
</Sequence>

<Sequence from={60} durationInFrames={90}>
  <TitleCard />     // plays frames 60–149
</Sequence>
```

**Important:** Inside a Sequence, useCurrentFrame() resets to 0.
Frame 60 in the composition = frame 0 inside a Sequence starting at 60.

---

## Audio and Video

```tsx
import { Audio, Video, staticFile } from 'remotion'

// Local file (place in /public folder)
<Audio src={staticFile('music.mp3')} />
<Video src={staticFile('footage.mp4')} />

// Remote URL
<Audio src="https://cdn.example.com/audio.mp3" />

// Start audio at specific time
<Audio src={staticFile('music.mp3')} startFrom={30} />

// Control volume
<Audio src={staticFile('music.mp3')} volume={0.5} />
```

---

## Fonts

```tsx
// Load local font in Root.tsx or composition file
import { continueRender, delayRender } from 'remotion'

const waitForFont = delayRender()

const fontFace = new FontFace(
  'Thunder',
  'url(/fonts/Thunder-LC.ttf)'
)

fontFace.load().then(() => {
  document.fonts.add(fontFace)
  continueRender(waitForFont)
})

// Then use in components
<div style={{ fontFamily: 'Thunder' }}>DYFF</div>
```

---

## Common Animation Patterns

### Fade in
```tsx
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: 'clamp'
})
```

### Slide up
```tsx
const y = interpolate(frame, [0, 30], [80, 0], {
  extrapolateRight: 'clamp'
})
// style={{ transform: `translateY(${y}px)` }}
```

### Scale spring entrance
```tsx
const scale = spring({ frame, fps, config: { damping: 10, stiffness: 150 } })
// style={{ transform: `scale(${scale})` }}
```

### Ink reveal (clip-path wipe left to right)
```tsx
const progress = interpolate(frame, [0, 40], [100, 0], {
  extrapolateRight: 'clamp'
})
// style={{ clipPath: `inset(0 ${progress}% 0 0)` }}
```

### Word-by-word text reveal
```tsx
const words = "Ideas are ticking time bombs".split(' ')

{words.map((word, i) => {
  const wordOpacity = interpolate(
    frame,
    [i * 8, i * 8 + 15],   // staggered by 8 frames per word
    [0, 1],
    { extrapolateRight: 'clamp' }
  )
  return (
    <span key={i} style={{ opacity: wordOpacity, marginRight: '0.3em' }}>
      {word}
    </span>
  )
})}
```

### Countdown bar
```tsx
const width = interpolate(frame, [0, durationInFrames], [100, 0])
// style={{ width: `${width}%` }}
```

### Audio waveform bars
```tsx
{Array.from({ length: 20 }).map((_, i) => {
  const height = 20 + Math.abs(Math.sin((frame + i * 5) * 0.2)) * 60
  return (
    <div key={i} style={{
      width: 4,
      height,
      background: '#8b0000',
      borderRadius: 2,
      margin: '0 2px',
    }} />
  )
})}
```

---

## Composition Presets (common sizes)

| Format | Width | Height | FPS | Use |
|---|---|---|---|---|
| YouTube 1080p | 1920 | 1080 | 30 | Main videos, intros, trailers |
| Instagram Reel | 1080 | 1920 | 30 | Vertical social content |
| Instagram Square | 1080 | 1080 | 30 | Feed posts |
| Twitter/X | 1280 | 720 | 30 | Twitter video |
| YouTube Short | 1080 | 1920 | 30 | Shorts format |

---

## remotion.config.ts

```ts
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')    // faster renders
Config.setOverwriteOutput(true)       // don't prompt on overwrite
Config.setPixelFormat('yuv420p')      // maximum device compatibility
Config.setConcurrency(4)              // parallel render threads
```

---

## Render Commands

```bash
# Preview in browser (Remotion Studio)
npx remotion studio

# Render a specific composition
npx remotion render <CompositionId> out/output.mp4

# Render with specific settings
npx remotion render MyVideo out/video.mp4 --codec=h264

# Render just a still (single frame)
npx remotion still MyVideo out/frame.png --frame=60
```

---

## Performance Rules

1. Never put heavy computation inside the render function — use useMemo
2. Use `delayRender` / `continueRender` for async operations (font loading, data fetching)
3. Keep component tree shallow — deep nesting slows frame rendering
4. Use `staticFile()` for all local assets — never hardcode paths
5. Avoid `useEffect` — Remotion renders frames non-linearly, effects may not fire
6. For images, import them or use `<Img>` from remotion, not HTML `<img>`

```tsx
import { Img, staticFile } from 'remotion'
<Img src={staticFile('dyff-logo.png')} />
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using useEffect for animation | Use useCurrentFrame + interpolate instead |
| Forgetting extrapolateRight: 'clamp' | Value will keep going past your range |
| Sequence frame confusion | Inside Sequence, frame resets to 0 |
| Using HTML img tag | Use Remotion's Img component |
| Async in render without delayRender | Video renders before asset loads |
| Very long durationInFrames without pagination | RAM usage explodes — render in chunks |

---

## DYFF Studio Specific Patterns

### Loading Thunder font
```tsx
// In Root.tsx, before compositions render
const handle = delayRender('Loading Thunder font')

new FontFace('Thunder', 'url(/fonts/Thunder-LC.ttf)')
  .load()
  .then(font => {
    document.fonts.add(font)
    continueRender(handle)
  })
```

### DYFF colour tokens for video
```ts
export const DYFF = {
  void:    '#080808',
  paper:   '#f2ead8',
  crimson: '#8b0000',
  green:   '#99ca45',
  gold:    '#c9a84c',
  indigo:  '#1a0050',
}
```

### Standard DYFF intro sequence timing
```
0–30    Logo appears (spring)
30–60   Studio name (interpolate fade)
60–90   Tagline (word by word)
90–120  Hold
120–150 Fade to black
```

---

## Skill Invocation

When Claude Code reads this skill, it should:
1. Always install remotion and @remotion/cli before writing any code
2. Use useCurrentFrame + interpolate as the default animation approach
3. Use spring() for any entrance animation that should feel physical
4. Always include extrapolateRight: 'clamp' on interpolate calls
5. Structure projects with Root.tsx, compositions/, and components/ folders
6. Use staticFile() for all local assets
7. Load fonts with delayRender/continueRender before rendering begins
8. Default composition size: 1920x1080 at 30fps unless specified otherwise
9. Always include npm scripts for preview and render in package.json
10. Never use useEffect inside Remotion components
