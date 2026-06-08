'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneState } from '@/lib/sceneState'

const MAX_TRAIL = 60

const VERTEX = `
attribute vec3  aColor;
attribute float aOpacity;

varying vec3  vColor;
varying float vOpacity;

void main() {
  vColor   = aColor;
  vOpacity = aOpacity;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT = `
varying vec3  vColor;
varying float vOpacity;

void main() {
  if (vOpacity < 0.01) discard;
  gl_FragColor = vec4(vColor, vOpacity);
}
`

export default function InkTrails() {
  const { camera } = useThree()

  // Cached vectors — no per-frame allocations
  const _v3  = useRef(new THREE.Vector3())
  const _dir = useRef(new THREE.Vector3())
  const _wp  = useRef(new THREE.Vector3())

  // Trail data
  const trailPos = useRef(new Float32Array(MAX_TRAIL * 3))
  const lastMouse = useRef({ x: 0, y: 0 })
  const idleTime  = useRef(0)

  const { lineObj, posAttr, opacityAttr } = useMemo(() => {
    const pos = new Float32Array(MAX_TRAIL * 3) // all zeros
    const geo = new THREE.BufferGeometry()

    const posAttr = new THREE.BufferAttribute(pos, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)

    // Pre-bake crimson → indigo color gradient
    const colorArr = new Float32Array(MAX_TRAIL * 3)
    const c0 = new THREE.Color('#99ca45')
    const c1 = new THREE.Color('#1a0050')
    for (let i = 0; i < MAX_TRAIL; i++) {
      const t = i / (MAX_TRAIL - 1)
      const c = c0.clone().lerp(c1, t)
      colorArr[i * 3]     = c.r
      colorArr[i * 3 + 1] = c.g
      colorArr[i * 3 + 2] = c.b
    }
    geo.setAttribute('aColor', new THREE.BufferAttribute(colorArr, 3))

    // Opacity: 1 → 0 along trail
    const opArr = new Float32Array(MAX_TRAIL)
    for (let i = 0; i < MAX_TRAIL; i++) opArr[i] = 1 - i / (MAX_TRAIL - 1)
    const opacityAttr = new THREE.BufferAttribute(opArr, 1)
    opacityAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('aOpacity', opacityAttr)

    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERTEX,
      fragmentShader: FRAGMENT,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    })

    const lineObj = new THREE.Line(geo, mat)
    return { lineObj, posAttr, opacityAttr }
  }, [])

  useFrame(({ clock }, delta) => {
    const mx = sceneState.mouse.x
    const my = sceneState.mouse.y

    // Detect mouse movement
    const moved =
      Math.abs(mx - lastMouse.current.x) > 0.001 ||
      Math.abs(my - lastMouse.current.y) > 0.001

    if (moved) {
      idleTime.current = 0
      lastMouse.current.x = mx
      lastMouse.current.y = my
    } else {
      idleTime.current += delta
    }

    // Fade opacity when mouse is still (> 0.5s idle)
    const visibility = Math.max(0, 1 - (idleTime.current - 0.5) * 2)

    // Unproject mouse to world space at z = 0 plane
    _v3.current.set(mx, my, 0.5).unproject(camera)
    _dir.current.subVectors(_v3.current, camera.position).normalize()
    const t = -camera.position.z / _dir.current.z
    _wp.current.copy(camera.position).addScaledVector(_dir.current, t)

    // Shift existing trail positions back
    const p = trailPos.current
    for (let i = MAX_TRAIL - 1; i > 0; i--) {
      p[i * 3]     = p[(i - 1) * 3]
      p[i * 3 + 1] = p[(i - 1) * 3 + 1]
      p[i * 3 + 2] = p[(i - 1) * 3 + 2]
    }
    // Set head
    p[0] = _wp.current.x
    p[1] = _wp.current.y
    p[2] = _wp.current.z

    // Sync to geometry attribute
    posAttr.array = p
    posAttr.needsUpdate = true

    // Scale opacity by visibility (fades when idle)
    const opArr = opacityAttr.array as Float32Array
    for (let i = 0; i < MAX_TRAIL; i++) {
      opArr[i] = (1 - i / (MAX_TRAIL - 1)) * visibility
    }
    opacityAttr.needsUpdate = true

    lineObj.geometry.computeBoundingSphere()
  })

  return <primitive object={lineObj} />
}
