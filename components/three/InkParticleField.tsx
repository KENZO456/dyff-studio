'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneState } from '@/lib/sceneState'

interface Props {
  mobile?: boolean
}

const VERTEX = `
attribute vec3 aColor;
attribute float aSize;
attribute float aOpacity;
attribute float aOffset;

uniform float uTime;
uniform float uScrollProgress;
uniform vec2  uMouse;

varying vec3  vColor;
varying float vOpacity;

void main() {
  vColor   = aColor;
  vOpacity = aOpacity;

  vec3 pos = position;

  // Organic drift — sin/cos with per-particle phase offset
  float t = uTime * 0.25;
  pos.x += sin(t * 1.1 + aOffset * 2.3) * 0.4 + cos(t * 0.7 + aOffset * 1.9) * 0.2;
  pos.y += cos(t * 0.9 + aOffset * 1.7) * 0.35 + sin(t * 1.3 + aOffset * 2.7) * 0.15;
  pos.z += sin(t * 0.6 + aOffset * 3.1) * 0.25;

  // Scroll: particles swirl downward and outward
  float swirl = uScrollProgress * 4.0;
  pos.x += cos(aOffset * 6.28) * swirl * 0.6;
  pos.y -= swirl * 1.5;
  pos.z += sin(aOffset * 6.28) * swirl * 0.3;

  // Mouse parallax — subtle field tilt
  pos.x += uMouse.x * 0.3;
  pos.y += uMouse.y * 0.2;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (280.0 / -mvPosition.z);
  gl_Position  = projectionMatrix * mvPosition;
}
`

const FRAGMENT = `
varying vec3  vColor;
varying float vOpacity;

void main() {
  // Circular particle — discard corners
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float d = dot(uv, uv);
  if (d > 1.0) discard;

  float alpha = smoothstep(1.0, 0.1, d) * vOpacity;
  gl_FragColor = vec4(vColor, alpha);
}
`

export default function InkParticleField({ mobile = false }: Props) {
  const COUNT = mobile ? 500 : 3000

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)
    const opacities = new Float32Array(COUNT)
    const offsets   = new Float32Array(COUNT)

    // Dark-theme palette — brand colors, atmospheric glows
    const darkGreen = new THREE.Color('#2a5a00')   // dark brand green
    const indigo    = new THREE.Color('#1a0050')   // deep indigo
    const green     = new THREE.Color('#99ca45')   // bright brand green

    for (let i = 0; i < COUNT; i++) {
      // Spread across a wide volume
      positions[i * 3]     = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      // 40% dark-green / 35% indigo / 25% bright-green
      const roll = Math.random()
      const c = roll < 0.4 ? darkGreen : roll < 0.75 ? indigo : green
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i]     = Math.random() * 1.8 + 0.5
      opacities[i] = Math.random() * 0.28 + 0.12
      offsets[i]   = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1))
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets,   1))

    const u = {
      uTime:           { value: 0 },
      uScrollProgress: { value: 0 },
      uMouse:          { value: new THREE.Vector2() },
    }

    return { geometry: geo, uniforms: u }
  }, [COUNT])

  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    uniforms.uTime.value           = clock.getElapsedTime()
    uniforms.uScrollProgress.value = sceneState.scroll
    uniforms.uMouse.value.set(sceneState.mouse.x, sceneState.mouse.y)

    // Subtle group-level mouse rotation (max ±5 degrees)
    if (groupRef.current) {
      const target = sceneState.mouse.x * (Math.PI / 36) // ±5°
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, target, 0.04
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, -sceneState.mouse.y * (Math.PI / 36), 0.04
      )
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
