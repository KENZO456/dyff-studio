'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NOISE_GLSL } from './glsl/noise'
import { sceneState } from '@/lib/sceneState'

const VERTEX = `
${NOISE_GLSL}

uniform float uTime;
uniform float uAmplitude;
uniform float uSpeed;

varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying float vNoise;

void main() {
  vec3 pos = position;

  // Low-frequency noise = broad, smooth undulations (no jagged detail)
  float n1 = snoise(pos * 0.65 + uTime * uSpeed);
  float n2 = snoise(pos * 1.1  + uTime * uSpeed * 1.3) * 0.25;
  float n  = (n1 + n2) * uAmplitude;
  pos += normal * n;

  vNoise = n;

  // World-space outputs for fresnel in fragment shader
  vWorldNormal   = normalize(mat3(modelMatrix) * normal);
  vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const FRAGMENT = `
varying vec3  vWorldNormal;
varying vec3  vWorldPosition;
varying float vNoise;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float NdotV  = max(dot(normalize(vWorldNormal), viewDir), 0.0);

  // Wider, softer fresnel rim
  float fresnel = pow(1.0 - NdotV, 1.8);

  // Pure black body
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 inner = vec3(0.015, 0.015, 0.015);
  // Brand green accent (#99ca45)
  vec3 green = vec3(0.6, 0.792, 0.271);

  // Dark body with subtle depth variation
  vec3 col = mix(black, inner, clamp(vNoise * 0.5 + 0.5, 0.0, 1.0));
  // Green rim glow
  col = mix(col, green, fresnel * 0.9);
  // Soft inner green halo near silhouette
  col += green * pow(fresnel, 3.5) * 0.4;

  gl_FragColor = vec4(col, 1.0);
}
`

export default function InkBlob() {
  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uAmplitude: { value: 0.18 },
    uSpeed:     { value: 0.8 },
  }), [])

  const meshRef    = useRef<THREE.Mesh>(null)
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current   += delta
    uniforms.uTime.value  = elapsedRef.current

    // Boost amplitude during manifesto section
    uniforms.uAmplitude.value = THREE.MathUtils.lerp(
      uniforms.uAmplitude.value,
      0.18 + sceneState.manifestoGlow * 0.28,
      0.06
    )

    if (!meshRef.current) return

    const scroll = sceneState.scroll

    // Descend and shrink as user scrolls past hero
    const targetY     = scroll * -3.5
    const targetScale = Math.max(0.25, 1 - scroll * 0.75)

    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y, targetY, 0.04
    )
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.04)
    meshRef.current.scale.setScalar(s)

    // Slow rotation
    meshRef.current.rotation.y += 0.003
    meshRef.current.rotation.x  = Math.sin(elapsedRef.current * 0.15) * 0.12
  })

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]}>
      <icosahedronGeometry args={[1.5, 8]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
      />
    </mesh>
  )
}
