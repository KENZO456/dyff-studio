import React from 'react'
import { interpolate, useCurrentFrame } from 'remotion'

type Props = {
  text: string
  fromFrame: number
  duration: number
  color: string
  fontSize?: number
  fontFamily?: string
}

export const InkReveal: React.FC<Props> = ({
  text,
  fromFrame,
  duration,
  color,
  fontSize = 80,
  fontFamily = 'Thunder',
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame,
    [fromFrame, fromFrame + duration],
    [100, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  )

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        textTransform: fontFamily === 'Thunder' ? 'uppercase' : 'none',
        letterSpacing: fontFamily === 'Thunder' ? '-0.02em' : 'normal',
        lineHeight: 1,
        clipPath: `inset(0 ${progress}% 0 0)`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}
