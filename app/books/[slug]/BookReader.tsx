'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  ChevronLeft, ChevronRight, Menu, X, Bookmark, BookmarkCheck,
  ChevronUp, Minus, Plus, AlignLeft,
} from 'lucide-react'
import { Thunder, Label, Body } from '@/components/ui/Typography'
import type { Book } from '@/lib/books-data'

// ─── Reading mode definitions ────────────────────────────────────────────────

type ReadingMode = 'ink' | 'parchment' | 'white'

const MODES: Record<ReadingMode, {
  bg: string; text: string; sidebar: string; border: string
  accent: string; overlay: string; label: string
}> = {
  ink: {
    bg:      '#080808',
    text:    '#f2ead8',
    sidebar: '#111111',
    border:  '#2a2a2a',
    accent:  '#8b0000',
    overlay: 'rgba(8,8,8,0.88)',
    label:   'INK BLACK',
  },
  parchment: {
    bg:      '#f5e6c8',
    text:    '#1a1008',
    sidebar: '#ece0c0',
    border:  '#c4a882',
    accent:  '#6b3a1a',
    overlay: 'rgba(245,230,200,1)',
    label:   'PARCHMENT',
  },
  white: {
    bg:      '#ffffff',
    text:    '#111111',
    sidebar: '#f8f8f8',
    border:  '#e0e0e0',
    accent:  '#8b0000',
    overlay: 'rgba(255,255,255,1)',
    label:   'PURE WHITE',
  },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BookReader({ book }: { book: Book }) {
  const [chapterIdx, setChapterIdx]   = useState(0)
  const [mode, setMode]               = useState<ReadingMode>('ink')
  const [fontSize, setFontSize]       = useState(18)
  const [fontFamily, setFontFamily]   = useState<'serif' | 'sans'>('serif')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bookmarked, setBookmarked]   = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [showTop, setShowTop]         = useState(false)
  const [isMobile, setIsMobile]       = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const chapterTitleRef = useRef<HTMLHeadingElement>(null)

  const chapter = book.chapters[chapterIdx] ?? null
  const m       = MODES[mode]
  const prevCh  = chapterIdx > 0
  const nextCh  = chapterIdx < book.chapters.length - 1

  /* ── Detect mobile + load persisted preferences on mount ─────── */
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize, { passive: true })

    // Restore font settings from localStorage
    const savedSize   = localStorage.getItem('reader-font-size')
    const savedFamily = localStorage.getItem('reader-font-family')
    if (savedSize)   setFontSize(parseInt(savedSize, 10))
    if (savedFamily) setFontFamily(savedFamily as 'serif' | 'sans')

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* ── Persist font settings whenever they change ─────────────── */
  useEffect(() => { localStorage.setItem('reader-font-size',   String(fontSize)) }, [fontSize])
  useEffect(() => { localStorage.setItem('reader-font-family', fontFamily)       }, [fontFamily])

  /* ── Scroll progress + scroll-to-top trigger ────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      setReadProgress(pct)
      setShowTop(pct > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Chapter title ink-reveal on chapter change ─────────────── */
  useEffect(() => {
    const el = chapterTitleRef.current
    if (!el) return
    el.classList.remove('chapter-title-enter')
    void el.offsetWidth
    el.classList.add('chapter-title-enter')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [chapterIdx])

  /* ── Close sidebar on outside click (desktop only) ──────────── */
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])
  useEffect(() => {
    if (!sidebarOpen || isMobile) return
    const handler = (e: MouseEvent) => {
      const sidebar = document.getElementById('reader-sidebar')
      if (sidebar && !sidebar.contains(e.target as Node)) closeSidebar()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sidebarOpen, closeSidebar, isMobile])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // No chapters in Notion yet — show placeholder (all hooks already called above)
  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: m.bg }}>
        <p className="font-mono text-ink-ash/60 text-sm tracking-[0.2em] uppercase">
          No chapters yet
        </p>
      </div>
    )
  }

  // ── Sidebar positioning: left-slide on desktop, bottom-sheet on mobile ──
  const sidebarStyle = isMobile
    ? {
        top:             'auto',
        left:            0,
        right:           0,
        bottom:          0,
        width:           '100%',
        height:          '65vh',
        borderRight:     'none',
        borderTop:       `1px solid ${m.border}`,
        backgroundColor: m.sidebar,
        transform:       sidebarOpen ? 'translateY(0)' : 'translateY(100%)',
        borderRadius:    '12px 12px 0 0',
      }
    : {
        backgroundColor: m.sidebar,
        borderRight:     `1px solid ${m.border}`,
        transform:       sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
      }

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: m.bg, color: m.text, transition: 'background-color 0.4s ease, color 0.4s ease' }}
    >

      {/* ── Reading progress bar (top of viewport) ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px]"
        style={{ backgroundColor: m.border }}>
        <div
          className="h-full transition-[width] duration-100"
          style={{ width: `${readProgress}%`, backgroundColor: m.accent }}
        />
      </div>

      {/* ── Grain texture (ink + parchment modes) ── */}
      {mode !== 'white' && (
        <div className="ink-grain fixed inset-0 z-[1] pointer-events-none opacity-25" />
      )}

      {/* ════════════════════════════════════════════════════
          SIDEBAR
          Desktop: slides in from left (w-72)
          Mobile:  bottom sheet slides up from bottom (65vh)
          ════════════════════════════════════════════════════ */}
      <aside
        id="reader-sidebar"
        className={`reader-sidebar fixed z-40 flex flex-col ${isMobile ? 'w-full' : 'top-0 left-0 bottom-0 w-72'}`}
        style={sidebarStyle}
      >
        {/* Drag handle on mobile */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: m.border }} />
          </div>
        )}

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: m.border }}>
          <Link href="/books" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} />
            <Label style={{ color: m.text }}>LIBRARY</Label>
          </Link>
          <button type="button" onClick={closeSidebar} className="cursor-pointer"
            aria-label="Close sidebar">
            <X size={16} style={{ color: m.text }} />
          </button>
        </div>

        {/* Book title */}
        <div className="px-5 py-5 border-b shrink-0" style={{ borderColor: m.border }}>
          <Thunder as="h2" size="card" weight={400}
            className="leading-tight mb-1"
            style={{ color: m.text }}>
            {book.title}
          </Thunder>
          <Label className="opacity-50" style={{ color: m.text }}>{book.author}</Label>
        </div>

        {/* Progress bar */}
        <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: m.border }}>
          <div className="flex items-center justify-between mb-2">
            <Label className="opacity-50" style={{ color: m.text }}>PROGRESS</Label>
            <Label style={{ color: m.accent }}>
              {Math.round((chapterIdx / book.chapters.length) * 100)}%
            </Label>
          </div>
          <div className="h-1 rounded-full" style={{ backgroundColor: m.border }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width:           `${(chapterIdx / book.chapters.length) * 100}%`,
                backgroundColor: m.accent,
              }}
            />
          </div>
        </div>

        {/* Chapter list */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Chapter list">
          {book.chapters.map((ch, i) => (
            <button
              key={ch.number}
              type="button"
              onClick={() => { setChapterIdx(i); closeSidebar() }}
              className="w-full text-left px-5 py-3 cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: i === chapterIdx ? `${m.accent}18` : 'transparent',
                borderLeft:      i === chapterIdx ? `3px solid ${m.accent}` : '3px solid transparent',
                color:           m.text,
                opacity:         i === chapterIdx ? 1 : 0.6,
              }}
            >
              <Label className="block" style={{ color: m.accent }}>CH. {ch.number}</Label>
              <span className="text-sm font-serif mt-0.5 block">{ch.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile bottom sheet */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* ════════════════════════════════════════════════════
          MAIN READING AREA
          ════════════════════════════════════════════════════ */}
      <div className="relative z-10">

        {/* Top bar */}
        <header
          className="sticky top-[3px] z-30 flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: `${m.bg}f0`, borderBottom: `1px solid ${m.border}` }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70"
            aria-label="Open chapter list"
          >
            <Menu size={16} style={{ color: m.text }} />
            <Label className="hidden md:block" style={{ color: m.text }}>
              CH. {chapter.number} — {chapter.title}
            </Label>
          </button>

          <div className="flex items-center gap-3">
            <Link href="/books"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
              <ChevronLeft size={12} style={{ color: m.text }} />
              <Label style={{ color: m.text }}>LIBRARY</Label>
            </Link>
            <button
              type="button"
              onClick={() => setBookmarked(b => !b)}
              className="cursor-pointer transition-opacity hover:opacity-70"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked
                ? <BookmarkCheck size={16} style={{ color: m.accent }} />
                : <Bookmark size={16} style={{ color: m.text }} />}
            </button>
          </div>
        </header>

        {/* Reading column — full-width on mobile, 72ch centred on desktop */}
        <article
          ref={contentRef}
          className="mx-auto px-6 py-20 pb-40"
          style={{ maxWidth: '72ch' }}
        >
          <div className="mb-6">
            <Label style={{ color: m.accent }} className="tracking-[0.3em]">
              CHAPTER {chapter.number}
            </Label>
          </div>

          <h1
            ref={chapterTitleRef}
            className="font-thunder uppercase tracking-tight leading-none mb-14"
            style={{
              fontSize:   'clamp(3rem, 8vw, 7rem)',
              fontWeight: 400,
              color:      m.text,
              clipPath:   'inset(0 50% 0 50%)',
            }}
          >
            {chapter.title}
          </h1>

          <div
            style={{
              fontFamily:   fontFamily === 'serif' ? 'var(--font-baskerville), Georgia, serif' : 'system-ui, sans-serif',
              fontSize:     `${fontSize}px`,
              lineHeight:   1.9,
              color:        m.text,
            }}
          >
            {chapter.paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? 'drop-cap' : ''}
                style={{ marginBottom: '1.5em' }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chapter navigation at bottom of content */}
          <div
            className="flex items-center justify-between mt-24 pt-8"
            style={{ borderTop: `1px solid ${m.border}` }}
          >
            <button
              type="button"
              onClick={() => setChapterIdx(i => i - 1)}
              disabled={!prevCh}
              className="flex items-center gap-2 cursor-pointer transition-opacity disabled:opacity-20"
              style={{ color: m.text }}
            >
              <ChevronLeft size={16} />
              <span className="text-xs font-mono tracking-[0.15em] uppercase">Prev Chapter</span>
            </button>
            <Label style={{ color: m.accent }}>
              {chapterIdx + 1} / {book.chapters.length}
            </Label>
            <button
              type="button"
              onClick={() => setChapterIdx(i => i + 1)}
              disabled={!nextCh}
              className="flex items-center gap-2 cursor-pointer transition-opacity disabled:opacity-20"
              style={{ color: m.text }}
            >
              <span className="text-xs font-mono tracking-[0.15em] uppercase">Next Chapter</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </article>
      </div>

      {/* ════════════════════════════════════════════════════
          CONTROLS BAR — sticky at bottom
          Stacks vertically on mobile via flex-wrap
          ════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between
          flex-wrap gap-y-2 px-4 md:px-8 py-3"
        style={{
          backgroundColor: `${m.bg}f5`,
          borderTop:       `1px solid ${m.border}`,
          backdropFilter:  'blur(8px)',
        }}
      >
        {/* Font size */}
        <div className="flex items-center gap-1">
          <button type="button"
            onClick={() => setFontSize(s => Math.max(14, s - 1))}
            className="cursor-pointer p-1.5 rounded-sm hover:opacity-70 transition-opacity"
            aria-label="Decrease font size">
            <Minus size={12} style={{ color: m.text }} />
          </button>
          <Label className="w-6 text-center" style={{ color: m.text }}>{fontSize}</Label>
          <button type="button"
            onClick={() => setFontSize(s => Math.min(26, s + 1))}
            className="cursor-pointer p-1.5 rounded-sm hover:opacity-70 transition-opacity"
            aria-label="Increase font size">
            <Plus size={12} style={{ color: m.text }} />
          </button>
        </div>

        {/* Font family toggle */}
        <button
          type="button"
          onClick={() => setFontFamily(f => f === 'serif' ? 'sans' : 'serif')}
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Toggle font family"
        >
          <AlignLeft size={12} style={{ color: m.text }} />
          <Label style={{ color: m.text }}>{fontFamily === 'serif' ? 'SERIF' : 'SANS'}</Label>
        </button>

        {/* Reading mode switcher */}
        <div className="flex items-center gap-1">
          {(['ink', 'parchment', 'white'] as ReadingMode[]).map(m2 => (
            <button
              key={m2}
              type="button"
              onClick={() => setMode(m2)}
              className="px-2 py-1 rounded-sm text-xs font-mono tracking-[0.1em] uppercase
                cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: mode === m2 ? m.accent     : 'transparent',
                color:           mode === m2 ? '#f2ead8'    : m.text,
                border:          `1px solid ${mode === m2 ? m.accent : m.border}`,
                opacity:         mode === m2 ? 1 : 0.6,
              }}
              aria-label={`Switch to ${MODES[m2].label} mode`}
              aria-pressed={mode === m2}
            >
              {MODES[m2].label}
            </button>
          ))}
        </div>

        {/* Chapter navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChapterIdx(i => i - 1)}
            disabled={!prevCh}
            className="flex items-center gap-1 cursor-pointer disabled:opacity-20 hover:opacity-70 transition-opacity"
            style={{ color: m.text }}
          >
            <ChevronLeft size={14} />
            <Label style={{ color: m.text }}>PREV</Label>
          </button>
          <div className="w-px h-4" style={{ backgroundColor: m.border }} />
          <button
            type="button"
            onClick={() => setChapterIdx(i => i + 1)}
            disabled={!nextCh}
            className="flex items-center gap-1 cursor-pointer disabled:opacity-20 hover:opacity-70 transition-opacity"
            style={{ color: m.text }}
          >
            <Label style={{ color: m.text }}>NEXT</Label>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Scroll-to-top button ── */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed right-6 bottom-20 z-40 w-10 h-10 flex items-center justify-center
            rounded-sm cursor-pointer transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: m.accent, color: '#f2ead8' }}
          aria-label="Scroll to top"
        >
          <ChevronUp size={16} />
          <span className="ink-drip absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" />
        </button>
      )}

    </div>
  )
}
