import React from 'react'
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import { AudioWave } from '../components/AudioWave'
import { InkReveal } from '../components/InkReveal'
import { InkBlob } from '../components/InkBlob'
import { DYFF } from '../lib/tokens'

type PanelData = {
  label: string
  name: string
  nameColor: string
}

const PANELS: PanelData[] = [
  { label: 'WRITTEN BY',    name: 'DANIEL OCHONOGOR', nameColor: DYFF.colors.white },
  { label: 'PRODUCED BY',   name: 'NOBU SAVAGE',      nameColor: DYFF.colors.white },
  { label: 'AVAILABLE ON',  name: 'SPOTIFY',           nameColor: DYFF.colors.green },
]

export const ESETrailer: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Wave opacity 0–60
  const waveOpacity = interpolate(frame, [0, 20, 50, 60], [0, 1, 1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Tagline words starting frame 180
  const tagline = 'The story that started it all.'.split(' ')

  // DYFF logo spring at frame 540
  const logoScale = spring({
    frame: Math.max(0, frame - 540),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.5 },
  })

  // Spotify text fade 780–820
  const spotifyOpacity = interpolate(frame, [780, 820], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // Final fade to black 870–900
  const fadeOut = interpolate(frame, [870, 900], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  })

  // InkBlob pulse after frame 540
  const blobPulse = frame >= 540
    ? 1 + Math.sin((frame - 540) * 0.05) * 0.04
    : 0

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
      {/* Replace ese-theme.mp3 in public/ with your real ESE audio file */}
      <Audio src={staticFile('ese-theme.mp3')} volume={0.8} />

      {/* Frame 0–60: AudioWave */}
      {frame < 180 && (
        <div style={{ opacity: waveOpacity, position: 'absolute' }}>
          <AudioWave barCount={24} color={DYFF.colors.crimson} fromFrame={0} />
        </div>
      )}

      {/* Frame 60–180: ESE InkReveal */}
      {frame >= 60 && frame < 300 && (
        <div style={{ position: 'absolute' }}>
          <InkReveal
            text="ESE"
            fromFrame={60}
            duration={60}
            color={DYFF.colors.crimson}
            fontSize={450}
          />
        </div>
      )}

      {/* Frame 180–300: Tagline */}
      {frame >= 180 && frame < 300 && (
        <div
          style={{
            position: 'absolute',
            bottom: 280,
            display: 'flex',
            gap: '0.3em',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {tagline.map((word, i) => {
            const op = interpolate(
              frame,
              [180 + i * 10, 180 + i * 10 + 20],
              [0, 1],
              { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
            )
            return (
              <span
                key={i}
                style={{
                  opacity: op,
                  fontFamily: DYFF.fonts.serif,
                  fontStyle: 'italic',
                  fontSize: 36,
                  color: DYFF.colors.paper,
                }}
              >
                {word}
              </span>
            )
          })}
        </div>
      )}

      {/* Frame 300–540: Three panels */}
      {PANELS.map((panel, idx) => {
        const panelStart = 300 + idx * 80
        const panelEnd = panelStart + 80

        if (frame < panelStart || frame >= panelEnd + 20) return null

        const slideX = interpolate(
          frame,
          [panelStart, panelStart + 30],
          [200, 0],
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
        )

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              transform: `translateX(${slideX}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: DYFF.fonts.mono,
                fontSize: 20,
                color: DYFF.colors.gold,
                letterSpacing: '0.2em',
              }}
            >
              {panel.label}
            </div>
            <div
              style={{
                fontFamily: DYFF.fonts.thunder,
                fontSize: 120,
                color: panel.nameColor,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {panel.name}
            </div>
          </div>
        )
      })}

      {/* Frame 540–780: DYFF logo + InkBlob */}
      {frame >= 540 && frame < 870 && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${logoScale})`,
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', transform: `scale(${blobPulse})`, opacity: 0.5 }}>
              <InkBlob size={500} color={DYFF.colors.crimson} />
            </div>
            <div
              style={{
                fontFamily: DYFF.fonts.thunder,
                fontSize: 280,
                color: DYFF.colors.white,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                position: 'relative',
                zIndex: 2,
              }}
            >
              DYFF
            </div>
          </div>
          <div
            style={{
              fontFamily: DYFF.fonts.thunder,
              fontSize: 60,
              color: DYFF.colors.white,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              zIndex: 2,
            }}
          >
            STUDIO
          </div>
        </div>
      )}

      {/* Frame 780–900: Spotify link */}
      {frame >= 780 && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            opacity: spotifyOpacity,
            fontFamily: DYFF.fonts.mono,
            fontSize: 22,
            color: DYFF.colors.surface,
            letterSpacing: '0.1em',
          }}
        >
          open.spotify.com/show/ese
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
