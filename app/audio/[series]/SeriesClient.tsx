'use client'

import { useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useAudio } from '@/contexts/AudioContext'
import type { AudioSeries } from '@/lib/audio-data'

// Per-bar config for the mini soundwave inside active episode row
const ACTIVE_BARS = [
  { h: 60,  delay: 0.00 },
  { h: 100, delay: 0.10 },
  { h: 80,  delay: 0.20 },
  { h: 100, delay: 0.10 },
  { h: 70,  delay: 0.15 },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export default function SeriesClient({ series }: { series: AudioSeries }) {
  const { play, togglePlay, currentEpisode, currentSeries, isPlaying } = useAudio()

  const bannerRef = useRef<HTMLDivElement>(null)

  const isCurrentSeries = currentSeries?.slug === series.slug

  return (
    <main className={`series-${series.slug} min-h-screen`}>

      {/* ── PARALLAX BANNER ───────────────────────────────────────────────── */}
      <section ref={bannerRef} className="relative h-[50vh] md:h-[60vh] overflow-hidden">

        {/* Overlays */}
        <div className="absolute inset-0 z-[1] bg-ink-void/80 pointer-events-none" />
        <div className="series-banner-gradient absolute inset-0 z-[2] pointer-events-none" />
        <div className="ink-grain absolute inset-0 z-[3] pointer-events-none opacity-25" />

        {/* Banner content — sits at the bottom */}
        <div className="relative z-[4] h-full flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-10 md:pb-14">
          <Label variant="tag" className="series-accent-label mb-3">
            {series.genre} SERIES
          </Label>

          <Thunder as="h1" size="hero" weight={400} className="text-ink-paper leading-none mb-3">
            {series.title}
          </Thunder>

          <p className="font-mono text-ink-paper/60 text-[0.6rem] tracking-[0.2em] uppercase mb-3">
            {series.episodeCount}&nbsp;Episodes&nbsp;&nbsp;·&nbsp;&nbsp;{series.year}&nbsp;&nbsp;·&nbsp;&nbsp;
            {series.status === 'ongoing' ? 'Ongoing' : 'Complete'}
          </p>

          <Body size="sm" className="text-ink-white/75 max-w-lg leading-relaxed">
            {series.logline}
          </Body>
        </div>
      </section>

      {/* ── SUBTITLE BAR ──────────────────────────────────────────────────── */}
      <div className="border-y border-ink-ash/10 px-6 md:px-12 lg:px-20 py-5 bg-[#080808]/75">
        <Body size="sm" className="text-ink-white/60 max-w-2xl leading-relaxed">
          {series.subtitle}
        </Body>
      </div>

      {/* ── EPISODE LIST ──────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-12 md:py-16 bg-[#080808]/80">

        {/* Heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="series-detail-bar w-[3px] h-8 rounded-full shrink-0" />
          <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none">
            EPISODES
          </Thunder>
        </div>

        {/* Episode rows */}
        <div className="flex flex-col">
          {series.episodes.map(episode => {
            const isActive    = isCurrentSeries && currentEpisode?.id === episode.id
            const isThisPlaying = isActive && isPlaying

            return (
              <div
                key={episode.id}
                className={`episode-item px-4 py-5 cursor-pointer rounded-sm ${isActive ? 'is-active' : ''}`}
                onClick={() => isActive ? togglePlay() : play(series, episode)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isActive ? togglePlay() : play(series, episode) } }}
                aria-label={`${isThisPlaying ? 'Pause' : 'Play'} ${episode.title}`}
              >
                <div className="flex items-start gap-5">

                  {/* Play indicator / soundwave */}
                  <div className="shrink-0 mt-0.5">
                    {isThisPlaying ? (
                      /* Animated mini soundwave while playing */
                      <div className="flex items-end gap-[2px] h-8 w-8 justify-center">
                        {ACTIVE_BARS.map((bar, i) => (
                          <div
                            key={i}
                            className="soundwave-bar episode-active-wave w-[2px] rounded-full"
                            style={
                              { '--bar-h': `${bar.h}%`, '--bar-delay': `${bar.delay}s` } as React.CSSProperties
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <button className="episode-play-btn" tabIndex={-1} aria-hidden="true">
                        {isActive
                          ? <Pause size={12} fill="currentColor" />
                          : <Play  size={12} fill="currentColor" className="ml-0.5" />
                        }
                      </button>
                    )}
                  </div>

                  {/* Episode meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-ink-ash/50 shrink-0">
                        EP&nbsp;{episode.number.toString().padStart(2, '0')}
                      </span>
                      <Thunder
                        as="h3"
                        size="card"
                        weight={400}
                        className={`leading-tight ${isActive ? 'text-ink-paper' : 'text-ink-paper/75'} transition-colors duration-200`}
                      >
                        {episode.title}
                      </Thunder>
                    </div>
                    <Body size="sm" className="text-ink-ash/55 leading-relaxed line-clamp-2">
                      {episode.description}
                    </Body>
                  </div>

                  {/* Duration */}
                  <span className="font-mono text-ink-ash/40 text-[0.6rem] shrink-0 mt-1 whitespace-nowrap">
                    {episode.duration}
                  </span>

                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-ink-ash/10 flex items-center gap-3">
          <div className="w-8 h-px bg-ink-ash/20" />
          <span className="font-mono text-ink-ash/40 text-[0.55rem] tracking-[0.2em] uppercase">
            {series.episodes.length} of {series.episodeCount} episodes available
          </span>
        </div>

      </section>
    </main>
  )
}
