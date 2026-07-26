import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { InkReveal } from '../components/InkReveal'
import { InkBlob } from '../components/InkBlob'
import { DYFF } from '../lib/tokens'

const TEXT_CYCLES = ['STORIES', 'SOUND', 'ART']
const OFFERINGS = ['📚 BOOKS', '🎧 AUDIO', '🎬 ANIMATION', '🎨 ART']

export const SocialClip: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // InkBlob expands 0–60
  const blobScale = interpolate(frame, [0, 60], [0, 3], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // DYFF spring at frame 150
  const dyffScale = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  // STUDIO spring at frame 165
  const studioScale = spring({
    frame: Math.max(0, frame - 165),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  // Handle text wipe between cycles (frame 60–150)
  const activeCycleIndex =
    frame < 60 ? -1
    : frame < 90 ? 0
    : frame < 120 ? 1
    : frame < 150 ? 2
    : -1

  // Fade to black frame 430–450
  const fadeOut = interpolate(frame, [430, 450], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Handle
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
      {/* Frame 0–60: InkBlob expands */}
      <div
        style={{
          position: 'absolute',
          transform: `scale(${blobScale})`,
          opacity: frame < 150 ? 0.7 : 0.3,
        }}
      >
        <InkBlob size={400} color={DYFF.colors.crimson} />
      </div>

      {/* Frame 60–150: Text cycles */}
      {frame >= 60 && frame < 150 && activeCycleIndex >= 0 && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <InkReveal
            key={activeCycleIndex}
            text={TEXT_CYCLES[activeCycleIndex]}
            fromFrame={60 + activeCycleIndex * 30}
            duration={20}
            color={DYFF.colors.white}
            fontSize={250}
          />
        </div>
      )}

      {/* Frame 150–300: DYFF + STUDIO */}
      {frame >= 150 && frame < 390 && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <div style={{ transform: `scale(${dyffScale})` }}>
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
          <div style={{ transform: `scale(${studioScale})` }}>
            <div
              style={{
                fontFamily: DYFF.fonts.thunder,
                fontSize: 120,
                color: DYFF.colors.green,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              STUDIO
            </div>
          </div>
        </div>
      )}

      {/* Frame 300–390: Offerings */}
      {frame >= 300 && frame < 430 && (
        <div
          style={{
            position: 'absolute',
            bottom: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            zIndex: 2,
          }}
        >
          {OFFERINGS.map((item, i) => {
            const op = interpolate(
              frame,
              [300 + i * 20, 300 + i * 20 + 15],
              [0, 1],
              { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
            )
            return (
              <div
                key={i}
                style={{
                  opacity: op,
                  fontFamily: DYFF.fonts.mono,
                  fontSize: 28,
                  color: DYFF.colors.paper,
                  letterSpacing: '0.1em',
                }}
              >
                {item}
              </div>
            )
          })}
        </div>
      )}

      {/* Frame 390–450: @DYFFSTUDIO + follow */}
      {frame >= 390 && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            zIndex: 2,
          }}
        >
          <div
            style={{
              opacity: interpolate(frame, [390, 410], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              fontFamily: DYFF.fonts.mono,
              fontSize: 32,
              color: DYFF.colors.gold,
              letterSpacing: '0.1em',
            }}
          >
            @DYFFSTUDIO
          </div>
          <div
            style={{
              opacity: interpolate(frame, [405, 420], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
              fontFamily: DYFF.fonts.mono,
              fontSize: 20,
              color: DYFF.colors.surface,
              letterSpacing: '0.15em',
            }}
          >
            FOLLOW FOR MORE
          </div>
        </div>
      )}

      {/* Fade to black */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000000',
          opacity: fadeOut,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
