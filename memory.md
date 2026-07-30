# DYFF Studio Memory

## Project Overview
DYFF Studio is a Next.js (App Router) based web application. It features a marketplace for digital art, books, beats, and other assets. The project uses React, Tailwind CSS, Framer Motion, GSAP for animations, Three.js/React Three Fiber, and Supabase.

## Key Directories
- `app/`: Next.js App Router structure (including marketplace, checkout, api routes, etc.).
- `components/`: Shared React UI components.
- `public/`: Static assets (images, audio).
- `lib/`: Utilities and services, specifically `supabase.ts` for database connection.

## Dependencies
- `@react-three/drei`, `@react-three/fiber`, `three`
- `@supabase/supabase-js`
- `framer-motion`, `gsap`, `lenis`, `react-scroll-parallax`
- `lucide-react`
- `next`, `react`, `react-dom`
- `tailwindcss`

## Change Ledger
- **2026-07-30**: 
  - Updated dependencies using `npm update`.
  - Added this `memory.md` file to track project state.
  - Updated Marketplace filters to all use the Dyff Green theme.
  - Added banner with a GIF carousel to the marketplace.
  - Added pagination (12 items/page) to the marketplace grid.
  - Initialized Supabase CLI in the project for local data management.
  - Integrated `animated-gradient.tsx` WebGL component and replaced the `InkUniverse` ThreeJS background in `app/layout.tsx`. Configured Aurora preset to use DYFF green (`#99ca45`).
