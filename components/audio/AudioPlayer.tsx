'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, X } from 'lucide-react'
import { useAudio } from '@/contexts/AudioContext'

// ─── Helpers ─────────────────────────────────────────────────────────────

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const

// ─── Component ───────────────────────────────────────────────────────────

export default function AudioPlayer() {
  const {
    audioRef, currentSeries, currentEpisode,
    isPlaying, volume, playbackRate,
    togglePlay, skip, seek, setVolume, setPlaybackRate,
  } = useAudio()

  // DOM refs — updated imperatively to avoid re-renders on every timeupdate
  const fillRef     = useRef<HTMLDivElement>(null)
  const buffRef     = useRef<HTMLDivElement>(null)
  const scrubRef    = useRef<HTMLInputElement>(null)
  const elapsedRef  = useRef<HTMLSpanElement>(null)
  const totalRef    = useRef<HTMLSpanElement>(null)
  const seekingRef  = useRef(false)

  // React state only for things that need to re-render the player chrome
  const [muted, setMuted] = useState(false)

  // ── Attach audio event listeners ──────────────────────────────────────
  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const onTimeUpdate = () => {
      if (seekingRef.current) return
      const pct   = a.duration > 0 ? (a.currentTime / a.duration) * 100 : 0
      const right = 100 - pct

      // GSAP ink bleed — smooth ~0.3s between timeupdate ticks
      if (fillRef.current) {
        gsap.to(fillRef.current, {
          clipPath:  `inset(0 ${right}% 0 0)`,
          duration:  0.3,
          ease:      'none',
          overwrite: true,
        })
      }

      // Buffered faint overlay
      if (buffRef.current && a.buffered.length > 0) {
        const bEnd = a.buffered.end(a.buffered.length - 1)
        const bRight = 100 - (a.duration > 0 ? (bEnd / a.duration) * 100 : 0)
        gsap.set(buffRef.current, { clipPath: `inset(0 ${bRight}% 0 0)` })
      }

      // Direct DOM — no React re-render
      if (elapsedRef.current) elapsedRef.current.textContent = fmt(a.currentTime)
      if (scrubRef.current)   scrubRef.current.value = String(a.currentTime)
    }

    const onMeta = () => {
      if (totalRef.current)  totalRef.current.textContent  = fmt(a.duration)
      if (scrubRef.current)  scrubRef.current.max          = String(a.duration)
    }

    a.addEventListener('timeupdate',    onTimeUpdate, { passive: true })
    a.addEventListener('loadedmetadata', onMeta,      { passive: true })
    return () => {
      a.removeEventListener('timeupdate',    onTimeUpdate)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [audioRef])

  // Reset visuals when episode changes
  useEffect(() => {
    if (fillRef.current)  gsap.set(fillRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (buffRef.current)  gsap.set(buffRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00'
    if (totalRef.current)   totalRef.current.textContent  = '0:00'
    if (scrubRef.current) { scrubRef.current.value = '0'; scrubRef.current.max = '0' }
  }, [currentEpisode])

  // Volume / mute sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted, audioRef])

  // ── Scrubber ──────────────────────────────────────────────────────────
  const onScrubMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!seekingRef.current) return
    const t   = parseFloat(e.target.value)
    const dur = audioRef.current?.duration ?? 0
    const pct = dur > 0 ? (t / dur) * 100 : 0
    if (fillRef.current)  gsap.set(fillRef.current,  { clipPath: `inset(0 ${100 - pct}% 0 0)` })
    if (elapsedRef.current) elapsedRef.current.textContent = fmt(t)
  }
  const onScrubEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    seekingRef.current = false
    const t = parseFloat((e.currentTarget as HTMLInputElement).value)
    seek(t)
  }

  if (!currentEpisode) return null

  return (
    <div
      className="audio-player fixed bottom-0 left-0 right-0 z-50
        h-[64px] md:h-[80px] border-t border-ink-ash/20
        flex items-center gap-3 md:gap-0 px-3 md:px-6"
    >
      {/* ── LEFT: thumbnail (desktop only) + meta ─────────────────── */}
      <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
        {/* Cover swatch — hidden on mobile for compact mode */}
        <div
          className="hidden md:flex w-12 h-12 rounded-sm shrink-0 items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a3a1a60, #111)' }}
        >
          <span
            className="font-thunder text-ink-paper text-[0.55rem] tracking-wider uppercase leading-none text-center px-1"
            style={{ fontWeight: 400 }}
          >
            {currentSeries?.name.slice(0, 4)}
          </span>
        </div>

        <div className="min-w-0">
          <p
            className="font-thunder uppercase text-ink-paper text-sm leading-none truncate"
            style={{ fontWeight: 400, fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}
          >
            {currentEpisode.title}
          </p>
          <p className="font-mono text-ink-ash text-[0.6rem] tracking-wide truncate mt-0.5">
            {currentSeries?.name} &middot; EP {currentEpisode.episode_number}
          </p>
        </div>
      </div>

      {/* ── CENTER: controls + scrubber ────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2 md:px-6">
        {/* Transport buttons */}
        <div className="flex items-center gap-2">
          {/* Rewind 15 */}
          <button
            onClick={() => skip(-15)}
            className="audio-ctrl-btn"
            aria-label="Rewind 15 seconds"
          >
            <RotateCcw size={15} />
            <span className="text-[0.5rem] font-mono leading-none">15</span>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="ink-flood-up audio-play-btn"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause  size={18} fill="currentColor" />
              : <Play   size={18} fill="currentColor" />}
          </button>

          {/* Forward 15 */}
          <button
            onClick={() => skip(15)}
            className="audio-ctrl-btn"
            aria-label="Forward 15 seconds"
          >
            <RotateCw size={15} />
            <span className="text-[0.5rem] font-mono leading-none">15</span>
          </button>
        </div>

        {/* Scrubber row */}
        <div className="w-full flex items-center gap-2 max-w-lg">
          <span ref={elapsedRef} className="font-mono text-ink-ash text-[0.6rem] shrink-0 w-8 text-right">
            0:00
          </span>

          {/* Progress track */}
          <div className="relative flex-1 h-1 rounded-full bg-ink-ash/20 cursor-pointer">
            {/* Buffered faint layer */}
            <div ref={buffRef} className="audio-fill-buffered rounded-full" />
            {/* Ink bleed fill */}
            <div ref={fillRef} className="audio-fill rounded-full" />
            {/* Native range input (invisible, positioned over track) */}
            <input
              ref={scrubRef}
              type="range"
              defaultValue="0"
              min="0"
              step="0.1"
              className="audio-range absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onMouseDown={() => { seekingRef.current = true }}
              onTouchStart={() => { seekingRef.current = true }}
              onChange={onScrubMove}
              onMouseUp={onScrubEnd}
              onTouchEnd={onScrubEnd}
              aria-label="Seek"
            />
          </div>

          <span ref={totalRef} className="font-mono text-ink-ash text-[0.6rem] shrink-0 w-8">
            0:00
          </span>
        </div>
      </div>

      {/* ── RIGHT: speed + volume ──────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-4 w-1/4 justify-end shrink-0">
        {/* Speed selector */}
        <div className="flex items-center gap-0.5">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => setPlaybackRate(s)}
              className={`
                text-[0.55rem] font-mono px-1.5 py-0.5 rounded-sm cursor-pointer
                transition-colors duration-150
                ${playbackRate === s
                  ? 'bg-ink-green text-ink-void'
                  : 'text-ink-ash hover:text-ink-paper'}
              `}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMuted(m => !m)}
            className="text-ink-ash hover:text-ink-paper transition-colors duration-150 cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0" max="1" step="0.02"
            value={muted ? 0 : volume}
            onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)) }}
            className="audio-range w-16"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}
