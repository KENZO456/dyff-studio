'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NOISE_GLSL } from './glsl/noise'
import { sceneState } from '@/lib/sceneState'

const VERTEX = `
${NOISE_GLSL}

uniform float uTime;
uniform float uScrollProgress;

varying float vElevation;
varying vec2  vUv;

void main() {
  vUv = uv;

  vec3 pos = position;

  float intensity = 1.0 + uScrollProgress * 2.5;
  float n = snoise(vec3(pos.x * 0.35 + uTime * 0.08,
                        pos.y * 0.35 + uTime * 0.06,
                        uTime * 0.04));
  float elevation = n * 0.55 * intensity;
  pos.z += elevation;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const FRAGMENT = `
uniform float uTime;
varying float vElevation;
varying vec2  vUv;

void main() {
  // Near-black ink surface — subtle variation with elevation
  float brightness = 0.012 + vElevation * 0.04 + 0.005;
  vec3 base   = vec3(0.035, 0.0,   0.07);  // deep indigo-black
  vec3 raised = vec3(0.08,  0.005, 0.12);  // slightly lighter indigo
  vec3 col = mix(base, raised, clamp(vElevation + 0.5, 0.0, 1.0));
  gl_FragColor = vec4(col, 0.9);
}
`

export default function InkFluidMesh() {
  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollProgress: { value: 0 },
  }), [])

  const meshRef    = useRef<THREE.Mesh>(null)
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current            += delta
    uniforms.uTime.value           = elapsedRef.current
    uniforms.uScrollProgress.value = sceneState.scroll
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, -3, -8]}>
      <planeGeometry args={[22, 22, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
