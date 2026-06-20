'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import type { AudioSeries, Episode } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────

interface AudioContextValue {
  audioRef: React.RefObject<HTMLAudioElement>

  currentSeries:  AudioSeries | null
  currentEpisode: Episode | null
  isPlaying:      boolean
  volume:         number
  playbackRate:   number

  /** Load + play an episode. Pass allEpisodes to enable autonext. */
  play: (series: AudioSeries, episode: Episode, allEpisodes?: Episode[]) => void
  togglePlay:      () => void
  skip:            (seconds: number) => void
  seek:            (time: number) => void
  setVolume:       (vol: number) => void
  setPlaybackRate: (rate: number) => void
  /** Stop audio and dismiss the player */
  close:           () => void
}

// ─── Context ──────────────────────────────────────────────────────────────

const AudioContext = createContext<AudioContextValue | null>(null)

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [currentSeries,  setCurrentSeries]  = useState<AudioSeries | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isPlaying,      setIsPlaying]      = useState(false)
  const [volume,         setVolumeState]    = useState(0.8)
  const [playbackRate,   setRateState]      = useState(1)

  // Refs for stable access inside event listeners (no stale closure)
  const currentEpisodeRef = useRef<Episode | null>(null)
  const currentSeriesRef  = useRef<AudioSeries | null>(null)
  const episodesRef       = useRef<Episode[]>([])

  useEffect(() => { currentEpisodeRef.current = currentEpisode }, [currentEpisode])
  useEffect(() => { currentSeriesRef.current  = currentSeries  }, [currentSeries])

  // Sync volume/rate to audio element
  useEffect(() => { if (audioRef.current) audioRef.current.volume      = volume      }, [volume])
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackRate }, [playbackRate])

  // Native audio event listeners — uses refs so the effect runs once only
  useEffect(() => {
    const a = audioRef.current
    if (!a) return

    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      const eps = episodesRef.current
      const ep  = currentEpisodeRef.current
      const ser = currentSeriesRef.current

      // Advance to next episode if one exists
      if (eps.length && ep && ser) {
        const idx = eps.findIndex(e => e.id === ep.id)
        if (idx >= 0 && idx < eps.length - 1) {
          const next = eps[idx + 1]
          setCurrentEpisode(next)
          currentEpisodeRef.current = next
          a.src = next.audio_url
          a.load()
          a.play().catch(() => {})
          return
        }
      }
      setIsPlaying(false)
    }

    a.addEventListener('play',  onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('play',  onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  const play = useCallback((
    series:      AudioSeries,
    episode:     Episode,
    allEpisodes?: Episode[],
  ) => {
    const a = audioRef.current
    if (!a) return

    if (allEpisodes) episodesRef.current = allEpisodes

    const isSame = currentEpisodeRef.current?.id === episode.id
    if (!isSame) {
      setCurrentSeries(series)
      setCurrentEpisode(episode)
      currentEpisodeRef.current = episode
      currentSeriesRef.current  = series
      a.src = episode.audio_url
      a.load()
    }

    a.play().catch(() => {})
  }, [])

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a || !currentEpisodeRef.current) return
    if (a.paused) { a.play().catch(() => {}) } else { a.pause() }
  }, [])

  const skip = useCallback((seconds: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + seconds))
  }, [])

  const seek = useCallback((time: number) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Math.max(0, Math.min(a.duration || 0, time))
  }, [])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)))
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    setRateState(rate)
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [])

  const close = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.pause()
    a.src = ''
    setCurrentEpisode(null)
    setCurrentSeries(null)
    setIsPlaying(false)
    currentEpisodeRef.current = null
    currentSeriesRef.current  = null
    episodesRef.current       = []
  }, [])

  return (
    <AudioContext.Provider value={{
      audioRef,
      currentSeries, currentEpisode,
      isPlaying, volume, playbackRate,
      play, togglePlay, skip, seek, setVolume, setPlaybackRate, close,
    }}>
      {/* Hidden audio element — lives at root so it persists across all route changes */}
      <audio ref={audioRef} preload="metadata" style={{ display: 'none' }} />
      {children}
    </AudioContext.Provider>
  )
}
