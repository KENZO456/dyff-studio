'use client'

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'
import type { AudioSeries, Episode } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────

interface AudioContextValue {
  /** Ref to the hidden <audio> element — AudioPlayer attaches event listeners here */
  audioRef: React.RefObject<HTMLAudioElement>

  currentSeries:  AudioSeries | null
  currentEpisode: Episode | null
  isPlaying:      boolean
  volume:         number      // 0–1
  playbackRate:   number      // 0.75 | 1 | 1.25 | 1.5 | 2

  /** Load + play a new episode (or resume if same episode) */
  play: (series: AudioSeries, episode: Episode) => void
  togglePlay: () => void
  skip: (seconds: number) => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
  setPlaybackRate: (rate: number) => void
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

  // Sync volume/rate to audio element whenever they change
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
  }, [volume])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.playbackRate = playbackRate
  }, [playbackRate])

  // Track play/pause state from native audio events
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onPlay  = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    a.addEventListener('play',  onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('play',  onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onEnded)
    }
  }, [])

  const play = useCallback((series: AudioSeries, episode: Episode) => {
    const a = audioRef.current
    if (!a) return

    const isSame = currentEpisode?.id === episode.id

    if (!isSame) {
      setCurrentSeries(series)
      setCurrentEpisode(episode)
      a.src = episode.audio_url
      a.load()
    }

    a.play().catch(() => {/* autoplay policy — user interaction required */})
  }, [currentEpisode])

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a || !currentEpisode) return
    isPlaying ? a.pause() : a.play().catch(() => {})
  }, [isPlaying, currentEpisode])

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

  return (
    <AudioContext.Provider value={{
      audioRef,
      currentSeries, currentEpisode,
      isPlaying, volume, playbackRate,
      play, togglePlay, skip, seek, setVolume, setPlaybackRate,
    }}>
      {/* Hidden audio element — lives here so it persists across /audio navigation */}
      <audio ref={audioRef} preload="metadata" style={{ display: 'none' }} />
      {children}
    </AudioContext.Provider>
  )
}
