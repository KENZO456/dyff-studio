import React from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'

type Props = {
  text: string
  fontSize: number
  color: string
  fromFrame: number
}

export const ThunderText: React.FC<Props> = ({ text, fontSize, color, fromFrame }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const adjustedFrame = Math.max(0, frame - fromFrame)

  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  return (
    <div
      style={{
        fontFamily: 'Thunder',
        fontSize,
        color,
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}
