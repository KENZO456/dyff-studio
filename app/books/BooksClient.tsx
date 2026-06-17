'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { Thunder, Label, Body } from '@/components/ui/Typography'
import type { Book } from '@/lib/books-data'

gsap.registerPlugin(ScrollTrigger)

const ALL_GENRES = ['ALL', 'ACTION', 'ROMANCE', 'SUPERNATURAL', 'DRAMA', 'DARK FANTASY', 'LITERARY FICTION']

export default function BooksClient({ books }: { books: Book[] }) {
  const heroRef  = useRef<HTMLDivElement>(null)
  const gridRef  = useRef<HTMLDivElement>(null)
  const [activeGenre, setActiveGenre] = useState('ALL')

  const { scrollYProgress } = useScroll({
    target:  heroRef,
    offset: ['start start', 'end start'],
  })
  const yBgText  = useTransform(scrollYProgress, [0, 1], [0,  -60])
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -200])

  useEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.book-card',
        { y: 90, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.15, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
        }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  const onTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x    = (e.clientX - rect.left) / rect.width
    const y    = (e.clientY - rect.top)  / rect.height
    el.style.transition = 'none'
    el.style.transform  = `perspective(900px) rotateX(${(0.5 - y) * 14}deg) rotateY(${(x - 0.5) * 14}deg) translateZ(14px)`
  }
  const onTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transition = 'transform 0.55s ease'
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  const filtered = activeGenre === 'ALL'
    ? books
    : books.filter(b => b.genre.includes(activeGenre))

  return (
    <main className="min-h-screen">

      <div
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-[1] bg-ink-void/55 pointer-events-none" />
        <div className="manifesto-vignette absolute inset-0 z-[2] pointer-events-none" />
        <div className="ink-grain absolute inset-0 z-[2] pointer-events-none opacity-35" />

        <motion.div
          style={{ y: yBgText }}
          className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="hero-ghost-title thunder-outline opacity-[0.04] leading-none tracking-tight font-thunder uppercase">
            LIBRARY
          </span>
        </motion.div>

        <motion.div style={{ y: yContent }} className="relative z-10 px-6 md:px-16 pt-32 pb-24">
          <div className="ink-reveal-text is-revealed mb-6">
            <Label variant="meta" className="text-ink-green tracking-[0.35em]">
              01 — THE LIBRARY
            </Label>
          </div>

          <div className="-ml-1">
            <Thunder as="h1" size="display" weight={400}
              className="thunder-outline block leading-none tracking-tight">
              THE
            </Thunder>
            <Thunder as="h1" size="hero" weight={400}
              className="text-ink-paper block leading-none tracking-tight -mt-3">
              LIBRARY
            </Thunder>
          </div>

          <div className="mt-8 max-w-xl">
            <Body size="lg" className="text-ink-white/80 italic leading-relaxed">
              Every universe DYFF has built, bound between two covers.
              Read it first. Listen to it after. Watch it become something else entirely.
            </Body>
          </div>

          <div className="mt-16 flex items-center gap-4">
            <div className="ink-drip relative">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-ink-ash/40 to-transparent" />
            </div>
            <Label className="text-ink-ash/60 tracking-[0.2em]">SCROLL TO BROWSE</Label>
          </div>
        </motion.div>
      </div>

      <div className="sticky top-0 z-40 bg-[#080808]/95 border-b border-ink-ash/10 backdrop-blur-sm">
        <div className="px-6 md:px-16 py-4 flex items-center gap-2 overflow-x-auto">
          {ALL_GENRES.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-sm border text-xs font-mono
                tracking-[0.15em] uppercase cursor-pointer transition-all duration-200
                ${activeGenre === genre
                  ? 'bg-ink-green border-ink-green text-ink-void'
                  : 'border-ink-ash/25 text-ink-ash hover:border-ink-ash/50 hover:text-ink-paper'}
              `}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <section className="px-6 md:px-16 py-20 bg-[#080808]/80">
        <div className="mb-12">
          <Thunder as="h2" size="section" weight={400} className="text-ink-white">
            {filtered.length} {filtered.length === 1 ? 'TITLE' : 'TITLES'}
          </Thunder>
          <div className="mt-2 h-px w-16 bg-ink-green" />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl"
        >
          {filtered.map((book) => (
            <div
              key={book.slug}
              className="book-card book-card-3d opacity-0 group cursor-pointer"
              onMouseMove={onTiltMove}
              onMouseLeave={onTiltLeave}
              style={{ '--accent': book.accentColor } as React.CSSProperties}
            >
              <Link href={`/books/${book.slug}`} className="block h-full">

                <div
                  className={`
                    book-cover relative overflow-hidden rounded-sm
                    bg-gradient-to-b ${book.coverFrom} via-ink-dark to-ink-void
                    border border-ink-ash/10 group-hover:border-ink-ash/30
                    transition-colors duration-300
                  `}
                >
                  <div className="ink-grain absolute inset-0 z-0 pointer-events-none" />
                  <div className="book-cover-glow absolute top-0 inset-x-0 h-48 z-[1]" />

                  <div
                    className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    <span className="book-watermark-text font-thunder uppercase text-center px-4 leading-none tracking-tight">
                      {book.title}
                    </span>
                  </div>

                  <div className="book-rule-grid absolute inset-0 z-[3] pointer-events-none" />

                  <div className="absolute bottom-0 inset-x-0 z-[4] p-5 bg-gradient-to-t from-ink-void via-ink-void/80 to-transparent pt-14">
                    <Thunder as="h3" size="card" weight={400}
                      className="text-ink-paper leading-tight group-hover:text-ink-white transition-colors duration-200">
                      {book.title}
                    </Thunder>
                    <p className="font-serif italic text-ink-ash/70 text-sm mt-1">{book.subtitle}</p>
                  </div>

                  <div className="absolute top-4 right-4 z-[5]">
                    <Label variant="badge" className="book-badge-accent">
                      {book.status === 'ongoing' ? 'ONGOING' : 'COMPLETE'}
                    </Label>
                  </div>
                </div>

                <div className="pt-5 pb-6 px-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.genre.map(g => (
                      <Label key={g} variant="tag">{g}</Label>
                    ))}
                  </div>

                  <Body size="sm" className="text-ink-paper/80 leading-relaxed line-clamp-3 mb-4">
                    {book.synopsis}
                  </Body>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={12} className="text-ink-ash/60" />
                      <Label className="text-ink-ash/60">
                        {book.chapterCount} {book.chapterCount === 1 ? 'Chapter' : 'Chapters'}
                      </Label>
                    </div>
                    <Label className="text-ink-ash/40">{book.year}</Label>
                  </div>

                  <div className="ink-flood-up flex items-center justify-between border border-ink-ash/25
                    px-5 py-3 rounded-sm group-hover:border-ink-ash/50 transition-colors duration-200">
                    <Label className="text-ink-paper">READ NOW</Label>
                    <ArrowUpRight size={14}
                      className="text-ink-ash group-hover:text-ink-paper transition-colors duration-200" />
                  </div>
                </div>

              </Link>
            </div>
          ))}

          <div className="book-card opacity-0">
            <div className="book-cover relative rounded-sm border border-dashed border-ink-ash/15
              flex flex-col items-center justify-center bg-ink-dark/30">
              <div className="ink-drip relative mb-4">
                <div className="w-px h-10 bg-gradient-to-b from-transparent to-ink-ash/20 mx-auto" />
              </div>
              <Label className="text-ink-ash/40 tracking-[0.25em]">MORE COMING</Label>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
