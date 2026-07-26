import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { InkBlob } from '../components/InkBlob'
import { DYFF } from '../lib/tokens'

export const OutroCard: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // DYFF logo spring 0–30
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  // Left card slides from left (frame 30–60)
  const leftCardX = interpolate(frame, [30, 60], [-700, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Right card slides from right (frame 30–60)
  const rightCardX = interpolate(frame, [30, 60], [700, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // InkBlob pulse frame 0+
  const blobPulse = 1 + Math.sin(frame * 0.04) * 0.05

  // Countdown bar frame 120–270
  const barWidth = interpolate(frame, [120, 270], [100, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Fade to black frame 270–290
  const fadeOut = interpolate(frame, [270, 290], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // "MORE STORIES COMING." frame 280–300
  const closingOpacity = interpolate(frame, [280, 295], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* InkBlob behind logo */}
      <div
        style={{
          position: 'absolute',
          transform: `scale(${blobPulse})`,
          opacity: 0.4,
        }}
      >
        <InkBlob size={500} color={DYFF.colors.crimson} />
      </div>

      {/* DYFF Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          fontFamily: DYFF.fonts.thunder,
          fontSize: 180,
          color: DYFF.colors.white,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          zIndex: 2,
          marginBottom: 40,
        }}
      >
        DYFF
      </div>

      {/* Cards row */}
      {frame >= 30 && (
        <div
          style={{
            display: 'flex',
            gap: 40,
            zIndex: 3,
            position: 'absolute',
            top: '50%',
            transform: 'translateY(20px)',
          }}
        >
          {/* Subscribe card */}
          <div
            style={{
              transform: `translateX(${leftCardX}px)`,
              background: DYFF.colors.surface,
              borderLeft: `4px solid ${DYFF.colors.crimson}`,
              padding: '32px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              minWidth: 320,
            }}
          >
            <div style={{ fontSize: 40 }}>▶</div>
            <div
              style={{
                fontFamily: DYFF.fonts.thunder,
                fontSize: 72,
                color: DYFF.colors.crimson,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              SUBSCRIBE
            </div>
          </div>

          {/* Follow card */}
          <div
            style={{
              transform: `translateX(${rightCardX}px)`,
              background: DYFF.colors.surface,
              borderLeft: `4px solid ${DYFF.colors.green}`,
              padding: '32px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              minWidth: 320,
            }}
          >
            <div style={{ fontSize: 40 }}>📷</div>
            <div
              style={{
                fontFamily: DYFF.fonts.thunder,
                fontSize: 72,
                color: DYFF.colors.green,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              FOLLOW
            </div>
            <div
              style={{
                fontFamily: DYFF.fonts.mono,
                fontSize: 18,
                color: DYFF.colors.paper,
                letterSpacing: '0.1em',
              }}
            >
              @dyffstudio
            </div>
          </div>
        </div>
      )}

      {/* Countdown bar */}
      {frame >= 120 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 4,
            width: `${barWidth}%`,
            background: DYFF.colors.crimson,
          }}
        />
      )}

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          opacity: fadeOut,
          pointerEvents: 'none',
        }}
      />

      {/* "MORE STORIES COMING." */}
      <div
        style={{
          position: 'absolute',
          opacity: closingOpacity,
          fontFamily: DYFF.fonts.mono,
          fontSize: 22,
          color: DYFF.colors.paper,
          letterSpacing: '0.15em',
          zIndex: 10,
        }}
      >
        MORE STORIES COMING.
      </div>
    </div>
  )
}
