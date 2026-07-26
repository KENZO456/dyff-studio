import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'

type Props = {
  size: number
  color: string
}

export const InkBlob: React.FC<Props> = ({ size, color }) => {
  const frame = useCurrentFrame()

  const baseFrequency = interpolate(frame, [0, 300], [0.008, 0.015], {
    extrapolateRight: 'clamp',
  })

  const scale = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const filterId = `inkBlob-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `scale(${scale})`, overflow: 'visible' }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="turbulence"
            baseFrequency={baseFrequency}
            numOctaves={4}
            seed={2}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={size * 0.12}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size * 0.38}
        fill={color}
        filter={`url(#${filterId})`}
        opacity={0.85}
      />
    </svg>
  )
}
