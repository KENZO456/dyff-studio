import React from 'react'
import { useCurrentFrame } from 'remotion'

type Props = {
  barCount: number
  color: string
  fromFrame: number
}

export const AudioWave: React.FC<Props> = ({ barCount, color, fromFrame }) => {
  const frame = useCurrentFrame()
  const adjustedFrame = Math.max(0, frame - fromFrame)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        height: 120,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const height = Math.sin(adjustedFrame * 0.2 + i * 0.5) * 40 + 20
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: Math.max(4, height),
              background: color,
              borderRadius: 2,
              transition: 'none',
            }}
          />
        )
      })}
    </div>
  )
}
