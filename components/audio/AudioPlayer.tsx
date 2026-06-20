'use client'

import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  Play, Pause, RotateCcw, RotateCw,
  Volume2, VolumeX, X, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react'
import { useAudio } from '@/contexts/AudioContext'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const

// ─── Mini corner player (all non-audio pages) ────────────────────────────────

function MiniPlayer() {
  const {
    audioRef, currentSeries, currentEpisode,
    isPlaying, togglePlay, seek, close,
  } = useAudio()

  const fillRef    = useRef<HTMLDivElement>(null)
  const buffRef    = useRef<HTMLDivElement>(null)
  const scrubRef   = useRef<HTMLInputElement>(null)
  const elapsedRef = useRef<HTMLSpanElement>(null)
  const totalRef   = useRef<HTMLSpanElement>(null)
  const seekingRef = useRef(false)

  // Sync audio events → UI
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTimeUpdate = () => {
      if (seekingRef.current) return
      const pct = a.duration > 0 ? (a.currentTime / a.duration) * 100 : 0
      if (fillRef.current) gsap.to(fillRef.current, { clipPath: `inset(0 ${100 - pct}% 0 0)`, duration: 0.3, ease: 'none', overwrite: true })
      if (buffRef.current && a.buffered.length > 0) {
        const bEnd = a.buffered.end(a.buffered.length - 1)
        gsap.set(buffRef.current, { clipPath: `inset(0 ${100 - (a.duration > 0 ? (bEnd / a.duration) * 100 : 0)}% 0 0)` })
      }
      if (elapsedRef.current) elapsedRef.current.textContent = fmt(a.currentTime)
      if (scrubRef.current)   scrubRef.current.value         = String(a.currentTime)
    }
    const onMeta = () => {
      if (totalRef.current)  totalRef.current.textContent  = fmt(a.duration)
      if (scrubRef.current)  scrubRef.current.max          = String(a.duration)
    }
    a.addEventListener('timeupdate',     onTimeUpdate, { passive: true })
    a.addEventListener('loadedmetadata', onMeta,       { passive: true })
    return () => {
      a.removeEventListener('timeupdate',     onTimeUpdate)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [audioRef])

  // Reset UI on episode change
  useEffect(() => {
    if (fillRef.current)    gsap.set(fillRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (buffRef.current)    gsap.set(buffRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00'
    if (totalRef.current)   totalRef.current.textContent  = '0:00'
    if (scrubRef.current)  { scrubRef.current.value = '0'; scrubRef.current.max = '0' }
  }, [currentEpisode])

  const onScrubMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!seekingRef.current) return
    const t   = parseFloat(e.target.value)
    const dur = audioRef.current?.duration ?? 0
    const pct = dur > 0 ? (t / dur) * 100 : 0
    if (fillRef.current)    gsap.set(fillRef.current, { clipPath: `inset(0 ${100 - pct}% 0 0)` })
    if (elapsedRef.current) elapsedRef.current.textContent = fmt(t)
  }
  const onScrubEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    seekingRef.current = false
    seek(parseFloat((e.currentTarget as HTMLInputElement).value))
  }

  if (!currentEpisode) return null

  return (
    <div className="audio-mini">
      {/* Top row: thumb + meta + controls */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        <div className="audio-mini-thumb">
          <span className="font-thunder uppercase text-ink-void text-[0.5rem] tracking-wider leading-none">
            {currentSeries?.name.slice(0, 4)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-thunder uppercase text-white text-[0.8rem] leading-tight truncate" style={{ fontWeight: 400 }}>
            {currentEpisode.title}
          </p>
          <p className="font-mono text-white/40 text-[0.5rem] tracking-wide truncate mt-0.5">
            {currentSeries?.name} &middot; EP {currentEpisode.episode_number}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={togglePlay} className="audio-mini-play" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
          </button>
          <button type="button" onClick={close} className="audio-mini-close" aria-label="Close player">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-[3px] bg-white/10 mx-3 rounded-full overflow-hidden">
        <div ref={buffRef} className="audio-fill-buffered rounded-full" style={{ clipPath: 'inset(0 100% 0 0)' }} />
        <div ref={fillRef} className="audio-fill rounded-full" style={{ clipPath: 'inset(0 100% 0 0)' }} />
        <input
          ref={scrubRef}
          type="range" defaultValue="0" min="0" step="0.1"
          className="audio-range absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onMouseDown={() => { seekingRef.current = true }}
          onTouchStart={() => { seekingRef.current = true }}
          onChange={onScrubMove}
          onMouseUp={onScrubEnd}
          onTouchEnd={onScrubEnd}
          aria-label="Seek"
        />
      </div>

      {/* Bottom row: elapsed · open link · duration */}
      <div className="flex items-center justify-between px-3 pt-1.5 pb-2.5">
        <span ref={elapsedRef} className="font-mono text-white/30 text-[0.48rem]">0:00</span>
        <Link
          href="/audio"
          className="flex items-center gap-1 font-mono text-ink-green text-[0.48rem] tracking-[0.12em] uppercase hover:text-white transition-colors duration-150"
        >
          Open Player <ExternalLink size={9} />
        </Link>
        <span ref={totalRef} className="font-mono text-white/30 text-[0.48rem]">0:00</span>
      </div>
    </div>
  )
}

// ─── Full-width player (audio pages only) ────────────────────────────────────

function FullPlayer() {
  const {
    audioRef, currentSeries, currentEpisode,
    isPlaying, volume, playbackRate,
    togglePlay, skip, seek, setVolume, setPlaybackRate, close,
  } = useAudio()

  const fillRef    = useRef<HTMLDivElement>(null)
  const buffRef    = useRef<HTMLDivElement>(null)
  const scrubRef   = useRef<HTMLInputElement>(null)
  const elapsedRef = useRef<HTMLSpanElement>(null)
  const totalRef   = useRef<HTMLSpanElement>(null)
  const seekingRef = useRef(false)

  const [muted,     setMuted]     = useState(false)
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTimeUpdate = () => {
      if (seekingRef.current) return
      const pct = a.duration > 0 ? (a.currentTime / a.duration) * 100 : 0
      if (fillRef.current) gsap.to(fillRef.current, { clipPath: `inset(0 ${100 - pct}% 0 0)`, duration: 0.3, ease: 'none', overwrite: true })
      if (buffRef.current && a.buffered.length > 0) {
        const bEnd = a.buffered.end(a.buffered.length - 1)
        gsap.set(buffRef.current, { clipPath: `inset(0 ${100 - (a.duration > 0 ? (bEnd / a.duration) * 100 : 0)}% 0 0)` })
      }
      if (elapsedRef.current) elapsedRef.current.textContent = fmt(a.currentTime)
      if (scrubRef.current)   scrubRef.current.value         = String(a.currentTime)
    }
    const onMeta = () => {
      if (totalRef.current)  totalRef.current.textContent  = fmt(a.duration)
      if (scrubRef.current)  scrubRef.current.max          = String(a.duration)
    }
    a.addEventListener('timeupdate',     onTimeUpdate, { passive: true })
    a.addEventListener('loadedmetadata', onMeta,       { passive: true })
    return () => {
      a.removeEventListener('timeupdate',     onTimeUpdate)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [audioRef])

  useEffect(() => {
    if (fillRef.current)    gsap.set(fillRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (buffRef.current)    gsap.set(buffRef.current,  { clipPath: 'inset(0 100% 0 0)' })
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00'
    if (totalRef.current)   totalRef.current.textContent  = '0:00'
    if (scrubRef.current)  { scrubRef.current.value = '0'; scrubRef.current.max = '0' }
    if (currentEpisode)     setMinimized(false)
  }, [currentEpisode])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted, audioRef])

  const onScrubMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!seekingRef.current) return
    const t   = parseFloat(e.target.value)
    const dur = audioRef.current?.duration ?? 0
    const pct = dur > 0 ? (t / dur) * 100 : 0
    if (fillRef.current)    gsap.set(fillRef.current, { clipPath: `inset(0 ${100 - pct}% 0 0)` })
    if (elapsedRef.current) elapsedRef.current.textContent = fmt(t)
  }
  const onScrubEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    seekingRef.current = false
    seek(parseFloat((e.currentTarget as HTMLInputElement).value))
  }

  if (!currentEpisode) return null

  // ── Minimized bar ─────────────────────────────────────────
  if (minimized) {
    return (
      <div className="audio-player fixed bottom-0 left-0 right-0 z-50 h-[48px] border-t border-ink-ash/20 flex items-center gap-3 px-4">
        <button type="button" onClick={togglePlay}
          className="ink-flood-up audio-play-btn shrink-0"
          style={{ width: 30, height: 30, minWidth: 30 }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-thunder uppercase text-ink-paper leading-none truncate"
            style={{ fontSize: 'clamp(0.65rem, 1.4vw, 0.82rem)', fontWeight: 400 }}>
            {currentEpisode.title}
          </p>
          <p className="font-mono text-ink-ash text-[0.55rem] tracking-wide truncate mt-0.5">
            {currentSeries?.name} &middot; EP {currentEpisode.episode_number}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={() => setMinimized(false)}
            className="text-ink-ash hover:text-ink-green transition-colors duration-150 p-1.5"
            aria-label="Expand player"
          >
            <ChevronUp size={14} />
          </button>
          <button type="button" onClick={close}
            className="text-ink-ash hover:text-ink-paper transition-colors duration-150 p-1.5"
            aria-label="Close player"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }

  // ── Full bar ───────────────────────────────────────────────
  return (
    <div className="audio-player fixed bottom-0 left-0 right-0 z-50 h-[64px] md:h-[80px] border-t border-ink-ash/20 flex items-center gap-3 md:gap-0 px-3 md:px-6">

      {/* LEFT: thumbnail + meta */}
      <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
        <div className="hidden md:flex w-12 h-12 rounded-sm shrink-0 items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1a3a1a60, #111)' }}>
          <span className="font-thunder text-ink-paper text-[0.55rem] tracking-wider uppercase leading-none text-center px-1"
            style={{ fontWeight: 400 }}>
            {currentSeries?.name.slice(0, 4)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-thunder uppercase text-ink-paper leading-none truncate"
            style={{ fontWeight: 400, fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}>
            {currentEpisode.title}
          </p>
          <p className="font-mono text-ink-ash text-[0.6rem] tracking-wide truncate mt-0.5">
            {currentSeries?.name} &middot; EP {currentEpisode.episode_number}
          </p>
        </div>
      </div>

      {/* CENTER: controls + scrubber */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2 md:px-6">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => skip(-15)} className="audio-ctrl-btn" aria-label="Rewind 15 seconds">
            <RotateCcw size={15} />
            <span className="text-[0.5rem] font-mono leading-none">15</span>
          </button>
          <button type="button" onClick={togglePlay} className="ink-flood-up audio-play-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button type="button" onClick={() => skip(15)} className="audio-ctrl-btn" aria-label="Forward 15 seconds">
            <RotateCw size={15} />
            <span className="text-[0.5rem] font-mono leading-none">15</span>
          </button>
        </div>
        <div className="w-full flex items-center gap-2 max-w-lg">
          <span ref={elapsedRef} className="font-mono text-ink-ash text-[0.6rem] shrink-0 w-8 text-right">0:00</span>
          <div className="relative flex-1 h-1 rounded-full bg-ink-ash/20 cursor-pointer">
            <div ref={buffRef}  className="audio-fill-buffered rounded-full" style={{ clipPath: 'inset(0 100% 0 0)' }} />
            <div ref={fillRef}  className="audio-fill rounded-full"          style={{ clipPath: 'inset(0 100% 0 0)' }} />
            <input ref={scrubRef} type="range" defaultValue="0" min="0" step="0.1"
              className="audio-range absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onMouseDown={() => { seekingRef.current = true }}
              onTouchStart={() => { seekingRef.current = true }}
              onChange={onScrubMove}
              onMouseUp={onScrubEnd}
              onTouchEnd={onScrubEnd}
              aria-label="Seek"
            />
          </div>
          <span ref={totalRef} className="font-mono text-ink-ash text-[0.6rem] shrink-0 w-8">0:00</span>
        </div>
      </div>

      {/* RIGHT: speed + volume + minimize + close */}
      <div className="hidden md:flex items-center gap-3 w-1/4 justify-end shrink-0">
        <div className="flex items-center gap-0.5">
          {SPEEDS.map(s => (
            <button key={s} type="button" onClick={() => setPlaybackRate(s)}
              className={`text-[0.55rem] font-mono px-1.5 py-0.5 rounded-sm cursor-pointer transition-colors duration-150
                ${playbackRate === s ? 'bg-ink-green text-ink-void' : 'text-ink-ash hover:text-ink-paper'}`}
            >
              {s}x
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setMuted(m => !m)}
            className="text-ink-ash hover:text-ink-paper transition-colors duration-150 cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input type="range" min="0" max="1" step="0.02"
            value={muted ? 0 : volume}
            onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)) }}
            className="audio-range w-16"
            aria-label="Volume"
          />
        </div>
        <div className="w-px h-5 bg-ink-ash/20 shrink-0" />
        <button type="button" onClick={() => setMinimized(true)}
          className="text-ink-ash hover:text-ink-green transition-colors duration-150 p-1"
          aria-label="Minimize player"
        >
          <ChevronDown size={15} />
        </button>
        <button type="button" onClick={close}
          className="text-ink-ash hover:text-ink-paper transition-colors duration-150 p-1"
          aria-label="Close player"
        >
          <X size={15} />
        </button>
      </div>

      {/* Mobile: minimize + close */}
      <div className="flex md:hidden items-center gap-1 shrink-0">
        <button type="button" onClick={() => setMinimized(true)}
          className="text-ink-ash hover:text-ink-green transition-colors duration-150 p-1.5"
          aria-label="Minimize player"
        >
          <ChevronDown size={14} />
        </button>
        <button type="button" onClick={close}
          className="text-ink-ash hover:text-ink-paper transition-colors duration-150 p-1.5"
          aria-label="Close player"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Root export — routes to correct layout by pathname ──────────────────────

export default function AudioPlayer() {
  const pathname = usePathname()
  const isAudioPage = pathname === '/audio' || pathname.startsWith('/audio/')
  return isAudioPage ? <FullPlayer /> : <MiniPlayer />
}
