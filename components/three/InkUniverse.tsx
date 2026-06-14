'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// R3F v8 creates a THREE.Clock internally; Three.js r168+ deprecated it.
// Suppress that specific warning until R3F ships THREE.Timer support.
if (typeof window !== 'undefined') {
  const _warn = console.warn.bind(console)
  console.warn = (...args: Parameters<typeof console.warn>) => {
    if (typeof args[0] === 'string' && args[0].startsWith('THREE.Clock')) return
    _warn(...args)
  }
}
import { sceneState } from '@/lib/sceneState'
import InkParticleField from './InkParticleField'
import InkFluidMesh     from './InkFluidMesh'
import InkBlob          from './InkBlob'
import InkTrails        from './InkTrails'
import { ThreeJSContext } from '@/contexts/ThreeJSContext'

/* ─── Capability detection ──────────────────────────────────────── */
function detectCapabilities() {
  if (typeof window === 'undefined') return { mobile: false, isLowEnd: false }
  const cores  = navigator.hardwareConcurrency ?? 4
  // Mobile: small screen OR low core-count (matches spec: hardwareConcurrency < 4 OR screen.width < 768)
  const mobile  = screen.width < 768 || cores < 4
  // Very low-end: mobile AND single/dual core → replace canvas with static gradient
  const isLowEnd = mobile && cores < 2
  return { mobile, isLowEnd }
}

/* ─── Scroll + mouse listener (runs once per mount) ────────────── */
function useSceneInputs() {
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      sceneState.mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
      sceneState.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      sceneState.scroll = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll',    onScroll,    { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])
}

/* ─── Camera drift: scroll moves z 5→3, slight x tilt ─────────── */
function CameraController() {
  const { camera } = useThree()
  const reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame(() => {
    if (reducedMotion) return

    const s = sceneState.scroll
    const targetZ  = 5 - s * 2
    const targetRx = -s * 0.15

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ,  0.04)
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRx, 0.04)
  })

  return null
}

/* ─── Scene contents ───────────────────────────────────────────── */
function InkScene({ mobile }: { mobile: boolean }) {
  return (
    <>
      {/* Atmosphere lighting */}
      <ambientLight intensity={0.2} color="#1a0050" />
      <pointLight position={[0, 5, 2]}  intensity={0.8} color="#99ca45" castShadow={false} />
      <pointLight position={[0, -5, 2]} intensity={0.3} color="#c9a84c" castShadow={false} />

      <CameraController />

      {/* Rear atmospheric plane — desktop only (heavy GLSL mesh) */}
      {!mobile && <InkFluidMesh />}

      {/* Mid-field particles */}
      <InkParticleField mobile={mobile} />

      {/* Hero focal point */}
      <InkBlob />

      {/* Mouse trails — desktop only */}
      {!mobile && <InkTrails />}
    </>
  )
}

/* ─── Root export — fixed full-screen canvas ───────────────────── */
export default function InkUniverse() {
  useSceneInputs()

  const { mobile, isLowEnd } = detectCapabilities()

  // Very low-end: skip Three.js entirely, use static CSS gradient
  if (isLowEnd) {
    return <div aria-hidden="true" className="ink-universe-lowend" />
  }

  return (
    <ThreeJSContext.Provider value={{ mobile, isLowEnd }}>
      <div aria-hidden="true" className="ink-universe-wrap">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
          gl={{
            antialias:        !mobile,
            alpha:            true,
            powerPreference:  'high-performance',
            stencil:          false,
            depth:            true,
          }}
          dpr={[1, mobile ? 1 : 1.5]}
          style={{ background: 'transparent' }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
            }, false)
          }}
        >
          <InkScene mobile={mobile} />
        </Canvas>
      </div>
    </ThreeJSContext.Provider>
  )
}
