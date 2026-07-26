import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { ThunderText } from '../components/ThunderText'
import { InkBlob } from '../components/InkBlob'
import { DYFF } from '../lib/tokens'

export const DYFFIntro: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // DYFF slam in at frame 30
  const dyffScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  // "STUDIO" fade in frame 60–90
  const studioOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Tagline word by word starting frame 90, stagger 8 frames
  const tagline = 'Ideas are ticking time bombs waiting to set off.'.split(' ')

  // Ink overlay pulse frame 120+
  const overlayOpacity = interpolate(frame, [120, 135, 150], [0, 0.08, 0.04], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // InkBlob initial spring (frame 0–30)
  const blobScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.8 },
  })

  // Gentle breath after frame 120
  const blobBreath = 1 + Math.sin(Math.max(0, frame - 120) * 0.05) * 0.04

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: DYFF.colors.void,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* InkBlob background */}
      <div
        style={{
          position: 'absolute',
          transform: `scale(${blobScale * (frame >= 120 ? blobBreath : 1)})`,
          opacity: 0.4,
        }}
      >
        <InkBlob size={400} color={DYFF.colors.crimson} />
      </div>

      {/* DYFF text */}
      <div style={{ transform: `scale(${dyffScale})`, zIndex: 2 }}>
        <div
          style={{
            fontFamily: DYFF.fonts.thunder,
            fontSize: 300,
            color: DYFF.colors.white,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          DYFF
        </div>
      </div>

      {/* STUDIO */}
      <div
        style={{
          opacity: studioOpacity,
          fontFamily: DYFF.fonts.mono,
          fontSize: 36,
          color: DYFF.colors.gold,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          marginTop: 8,
          zIndex: 2,
        }}
      >
        STUDIO
      </div>

      {/* Tagline */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.3em',
          marginTop: 48,
          maxWidth: 900,
          zIndex: 2,
        }}
      >
        {tagline.map((word, i) => {
          const wordOpacity = interpolate(
            frame,
            [90 + i * 8, 90 + i * 8 + 15],
            [0, 1],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          )
          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                fontFamily: DYFF.fonts.serif,
                fontSize: 28,
                fontStyle: 'italic',
                color: DYFF.colors.paper,
              }}
            >
              {word}
            </span>
          )
        })}
      </div>

      {/* Ink texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${DYFF.colors.crimson}22 0%, transparent 70%)`,
          opacity: overlayOpacity,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
