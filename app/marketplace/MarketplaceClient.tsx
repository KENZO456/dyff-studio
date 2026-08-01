'use client'

import {
  useRef, useEffect, useState, useCallback, useMemo,
} from 'react'
import Image from 'next/image'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Eye, Play, Pause, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart }       from '@/contexts/CartContext'
import type { Product, ProductCategory, ProductSort } from '@/lib/supabase'

gsap.registerPlugin(ScrollTrigger)

type FilterCat = 'ALL' | ProductCategory

const CAT_CLASS: Record<ProductCategory, string> = {
  digital_art: 'market-cat-art',
  books:       'market-cat-books',
  beats:       'market-cat-beats',
  assets:      'market-cat-assets',
}
const CAT_LABEL: Record<ProductCategory, string> = {
  digital_art: 'ART',
  books:       'BOOKS',
  beats:       'BEATS',
  assets:      'ASSETS',
}

function catClass(cat: ProductCategory) { return CAT_CLASS[cat] }
function fmtNGN(n: number) { return '₦' + n.toLocaleString('en-NG') }
function fmtUSD(n: number) { return '$' + n.toFixed(2) }
function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  if (sort === 'price_asc')  return [...products].sort((a, b) => a.price_ngn - b.price_ngn)
  if (sort === 'price_desc') return [...products].sort((a, b) => b.price_ngn - a.price_ngn)
  return products
}

const CAT_FILTERS: { value: FilterCat; label: string }[] = [
  { value: 'ALL',         label: 'ALL'    },
  { value: 'digital_art', label: 'ART'    },
  { value: 'books',       label: 'BOOKS'  },
  { value: 'beats',       label: 'BEATS'  },
  { value: 'assets',      label: 'ASSETS' },
]

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'newest',     label: 'Newest'  },
  { value: 'popular',    label: 'Popular' },
  { value: 'price_asc',  label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
]

const HERO_PILLS: { cat: ProductCategory; dot: string }[] = [
  { cat: 'digital_art', dot: '·' },
  { cat: 'books',       dot: '·' },
  { cat: 'beats',       dot: '·' },
  { cat: 'assets',      dot: ''  },
]

// Available banner videos from public/Videos
const BANNER_VIDEOS = [
  '/Videos/Hreo background.mp4',
  '/Videos/videobg (1).mp4',
  '/Videos/videobg (2).mp4',
]

interface CardProps {
  product:   Product
  onPreview: (p: Product) => void
  onPlay:    (p: Product) => void
  isPlaying: boolean
}

function ProductCard({ product, onPreview, onPlay, isPlaying }: CardProps) {
  const { addItem, openCart, cartIconRef } = useCart()
  const wrapRef         = useRef<HTMLDivElement>(null)
  const cardRef         = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current || !cardRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
    gsap.to(cardRef.current, { rotateY: x * 9, rotateX: -y * 9, duration: 0.25, ease: 'power2.out', overwrite: true })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.55)', overwrite: true })
  }

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    openCart()
    const cartIcon     = cartIconRef.current
    const imgContainer = imgContainerRef.current
    if (!imgContainer || !cartIcon) return
    const imgRect  = imgContainer.getBoundingClientRect()
    const cartRect = cartIcon.getBoundingClientRect()
    const clone = document.createElement('div')
    clone.setAttribute('aria-hidden', 'true')
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${imgRect.left + imgRect.width / 2 - 20}px`,
      top:  `${imgRect.top  + imgRect.height / 2 - 20}px`,
      width: '40px', height: '40px', borderRadius: '4px',
      backgroundImage: `url('${product.image_url}')`,
      backgroundSize: 'cover', zIndex: '1001', pointerEvents: 'none', willChange: 'transform, opacity',
    })
    document.body.appendChild(clone)
    const destX = (cartRect.left + cartRect.width  / 2) - (imgRect.left + imgRect.width  / 2 - 20) - 20
    const destY = (cartRect.top  + cartRect.height / 2) - (imgRect.top  + imgRect.height / 2 - 20) - 20
    gsap.to(clone, { x: destX, y: destY, scale: 0.15, opacity: 0, duration: 0.62, ease: 'power2.in', onComplete: () => document.body.removeChild(clone) })
  }, [product, addItem, openCart, cartIconRef])

  const hasBeatPreview = product.category === 'beats' && !!product.preview_url

  return (
    <div
      ref={wrapRef}
      className={`market-card-wrap ${catClass(product.category)}${isPlaying ? ' is-beat-playing' : ''} h-full`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={cardRef} className="market-card h-full flex flex-col">
        <div ref={imgContainerRef} className="market-card-img relative flex-shrink-0" onClick={() => onPreview(product)}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.tags.includes('new') && (
            <div className="absolute top-2.5 left-2.5 z-[3]">
              <span className="market-badge-new">NEW</span>
            </div>
          )}
          <div className="market-card-preview z-[2]" aria-hidden="true">
            <div className="w-10 h-10 rounded-full bg-ink-void/70 border border-ink-paper/20 flex items-center justify-center">
              <Eye size={16} className="text-ink-paper" />
            </div>
          </div>

          {/* Beat preview play button */}
          {hasBeatPreview && (
            <button
              className={`market-beat-play z-[4]${isPlaying ? ' is-playing' : ''}`}
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPlay(product) }}
              aria-label={isPlaying ? `Pause ${product.name} preview` : `Play ${product.name} preview`}
            >
              {isPlaying
                ? <Pause size={14} fill="currentColor" strokeWidth={0} />
                : <Play  size={14} fill="currentColor" strokeWidth={0} />
              }
            </button>
          )}
        </div>

        <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-grow bg-ink-dark/80">
          <div className="flex items-center gap-2">
            <span className="market-cat-pill">{CAT_LABEL[product.category]}</span>
          </div>
          <Thunder as="h3" size="card" weight={400} className="text-ink-paper leading-tight line-clamp-1 cursor-pointer" onClick={() => onPreview(product)}>
            {product.name}
          </Thunder>
          <div className="flex items-end gap-2 mt-auto pt-1">
            <span className="font-thunder text-ink-paper leading-none" style={{ fontSize: '1.4rem', fontWeight: 400 }}>
              {fmtNGN(product.price_ngn)}
            </span>
            <span className="font-mono text-ink-ash/40 text-[0.58rem] mb-0.5">{fmtUSD(product.price_usd)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={handleAddToCart} className="market-add-btn ink-flood-up" aria-label={`Add ${product.name} to cart`}>
              ADD TO CART
            </button>
            <button onClick={(e) => { e.stopPropagation(); onPreview(product); }} className="market-preview-btn" aria-label={`Preview ${product.name}`}>
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BannerSlider() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % BANNER_VIDEOS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full h-[35vh] md:h-[45vh] lg:h-[55vh] relative overflow-hidden bg-ink-void group">
      {BANNER_VIDEOS.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeIdx ? 'opacity-80 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink-void via-ink-void/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <Thunder as="h2" size="display" weight={400} className="text-ink-paper leading-none drop-shadow-2xl">
          NEW ARRIVALS
        </Thunder>
        <p className="font-mono text-ink-green text-[0.6rem] tracking-[0.3em] uppercase mt-2 drop-shadow-md">
          Explore the latest additions
        </p>
      </div>

      {/* Manual Controls */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-ink-void/40 border border-ink-paper/20 flex items-center justify-center text-ink-paper opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink-green hover:text-ink-void"
        onClick={() => setActiveIdx((prev) => (prev - 1 + BANNER_VIDEOS.length) % BANNER_VIDEOS.length)}
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-ink-void/40 border border-ink-paper/20 flex items-center justify-center text-ink-paper opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink-green hover:text-ink-void"
        onClick={() => setActiveIdx((prev) => (prev + 1) % BANNER_VIDEOS.length)}
      >
        <ChevronRight size={20} />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {BANNER_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? 'bg-ink-green w-4' : 'bg-ink-paper/30 hover:bg-ink-paper/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

interface FilterBarProps {
  activeCat: FilterCat
  sortBy:    ProductSort
  onCat:     (v: FilterCat) => void
  onSort:    (v: ProductSort) => void
}

function FilterBar({ activeCat, sortBy, onCat, onSort }: FilterBarProps) {
  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([])
  const underlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const first = tabRefs.current[0]
    if (!first || !underlineRef.current) return
    gsap.set(underlineRef.current, { x: first.offsetLeft, width: first.offsetWidth })
  }, [])

  const handleTabClick = (val: FilterCat, idx: number) => {
    const btn = tabRefs.current[idx]
    if (!btn || !underlineRef.current) return
    gsap.to(underlineRef.current, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.28, ease: 'power2.inOut' })
    onCat(val)
  }

  return (
    <div className="market-filter-bar">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between py-0">
        <div className="relative flex items-end border-b-0">
          {CAT_FILTERS.map(({ value, label }, i) => (
            <button
              key={value}
              ref={el => { tabRefs.current[i] = el }}
              className={`market-filter-tab${activeCat === value ? ' is-active' : ''}`}
              onClick={() => handleTabClick(value, i)}
              aria-pressed={activeCat === value}
            >
              {label}
            </button>
          ))}
          <div ref={underlineRef} className="market-filter-underline" aria-hidden="true" />
        </div>
        <select value={sortBy} onChange={e => onSort(e.target.value as ProductSort)} className="market-sort-select" aria-label="Sort products">
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function MarketplaceClient({ initialProducts }: { initialProducts: Product[] }) {
  const { addItem, openCart } = useCart()
  const [activeCat,      setActiveCat]  = useState<FilterCat>('ALL')
  const [sortBy,         setSortBy]     = useState<ProductSort>('newest')
  const [previewProduct, setPreview]    = useState<Product | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage]   = useState(1)
  const itemsPerPage = 12

  // Beat audio state
  const [playingId,    setPlayingId]    = useState<string | null>(null)
  const [beatProgress, setBeatProgress] = useState(0)
  const [beatDuration, setBeatDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const heroRef       = useRef<HTMLElement>(null)
  const pillsRef      = useRef<HTMLDivElement>(null)
  const gridRef       = useRef<HTMLDivElement>(null)
  const filterInitRef = useRef(false)

  // Derived sections
  const trendingProducts = useMemo(() => {
    const trending = initialProducts.filter(p => p.tags.includes('trending') || p.tags.includes('popular'))
    return trending.length >= 4 ? trending : initialProducts.slice(0, 8)
  }, [initialProducts])

  const newDropProducts = useMemo(() => {
    const newDrops = initialProducts.filter(p => p.tags.includes('new'))
    return newDrops.length > 0 ? newDrops.slice(0, 3) : initialProducts.slice(-3).reverse()
  }, [initialProducts])

  const featuredAssets = useMemo(() => {
    return initialProducts.filter(p => p.category === 'assets').slice(0, 4)
  }, [initialProducts])

  const visible = useMemo(() => {
    const base = activeCat === 'ALL' ? initialProducts : initialProducts.filter(p => p.category === activeCat)
    return sortProducts(base, sortBy)
  }, [activeCat, sortBy, initialProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCat, sortBy])

  const paginatedVisible = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return visible.slice(startIndex, startIndex + itemsPerPage)
  }, [visible, currentPage, itemsPerPage])

  const totalPages = Math.ceil(visible.length / itemsPerPage)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    setPlayingId(null)
    setBeatProgress(0)
    setBeatDuration(0)
  }, [])

  const handlePlay = useCallback((product: Product) => {
    if (!product.preview_url) return
    if (playingId === product.id) { stopAudio(); return }

    stopAudio()

    const audio = new Audio(product.preview_url)
    audioRef.current = audio
    audio.addEventListener('loadedmetadata', () => setBeatDuration(audio.duration))
    audio.addEventListener('timeupdate', () => setBeatProgress(audio.currentTime))
    audio.addEventListener('ended', () => { setPlayingId(null); setBeatProgress(0) })
    audio.play().catch(() => setPlayingId(null))
    setPlayingId(product.id)
  }, [playingId, stopAudio])

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !beatDuration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * beatDuration
  }, [beatDuration])

  const closePreview = useCallback(() => {
    stopAudio()
    setPreview(null)
  }, [stopAudio])

  // Stop audio on unmount
  useEffect(() => () => { stopAudio() }, [stopAudio])

  useEffect(() => {
    if (!pillsRef.current) return
    const pills = pillsRef.current.querySelectorAll<HTMLElement>('.market-hero-pill-wrap')
    gsap.from(pills, { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, delay: 0.3, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.market-card-wrap.grid-item', {
        opacity: 0, y: 50, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!filterInitRef.current) { filterInitRef.current = true; return }
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.market-card-wrap.grid-item')
    gsap.from(cards, { opacity: 0, y: 24, stagger: 0.06, duration: 0.45, ease: 'power2.out', overwrite: true })
  }, [activeCat, sortBy, currentPage])

  return (
    <main className="min-h-screen bg-ink-void/60">

      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center min-h-[45vh] pt-16 pb-8 px-6 overflow-hidden"
      >

        <div className="anim-hero-glow absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />
        <div className="ink-grain absolute inset-0 z-[2] pointer-events-none opacity-20" />
        <div className="absolute inset-0 z-[3] flex items-center justify-center select-none pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="font-thunder uppercase text-ink-paper/[0.025] leading-none" style={{ fontSize: 'clamp(8rem, 28vw, 24rem)', fontWeight: 400 }}>
            STORE
          </span>
        </div>
        <div className="relative z-[4] flex flex-col items-center gap-6 max-w-3xl">
          <Label variant="tag" className="text-ink-green">DYFF STORE</Label>
          <Thunder as="h1" size="hero" weight={400} className="text-ink-paper leading-none">
            OWN A PIECE<br />OF THE WORLD.
          </Thunder>
          <Body size="base" className="text-ink-white/80 max-w-[42ch] leading-relaxed">
            Digital art, original music, books, and creative assets from the DYFF universe.
            Everything here was made by the same people who built the stories. When you buy
            from the DYFF store, you are directly funding the next chapter.
          </Body>
          <div ref={pillsRef} className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {HERO_PILLS.map(({ cat, dot }) => (
              <div key={cat} className="market-hero-pill-wrap flex items-center gap-3">
                <button
                  className={`market-hero-pill ${catClass(cat)}`}
                  onClick={() => {
                    setActiveCat(cat)
                    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  aria-label={`Filter by ${CAT_LABEL[cat]}`}
                >
                  {CAT_LABEL[cat]}
                </button>
                {dot && <span className="font-mono text-ink-ash/30 text-xs select-none">{dot}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Banner Slider */}
      <BannerSlider />

      {/* 2. Trending Section (Horizontal Scroll) */}
      <section className="py-16 border-b border-ink-ash/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mb-8 flex items-end justify-between">
          <div>
            <Label variant="tag" className="text-ink-green mb-2 block">TRENDING NOW</Label>
            <Thunder as="h2" size="section" weight={400} className="text-ink-paper">
              HOTTEST PICKS
            </Thunder>
          </div>
          <div className="hidden md:flex items-center gap-2 text-ink-ash/60 font-mono text-[0.6rem] tracking-widest uppercase">
            <span>Scroll</span> <ArrowRight size={12} />
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto pl-5 md:pl-10">
          <div className="audio-shelf pb-6 pr-5 md:pr-10">
            {trendingProducts.map((p) => (
              <div key={p.id} className="audio-shelf-tile w-[260px] md:w-[300px]">
                <ProductCard
                  product={p}
                  onPreview={setPreview}
                  onPlay={handlePlay}
                  isPlaying={playingId === p.id}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Drops Section (Creative Layout) */}
      <section className="py-16 md:py-24 bg-ink-void border-b border-ink-ash/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <Label variant="tag" className="text-ink-gold mb-2 block">FRESH OUT</Label>
            <Thunder as="h2" size="display" weight={400} className="text-ink-paper">
              NEW DROPS
            </Thunder>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
            {newDropProducts.map((product, idx) => (
              <div 
                key={product.id} 
                className={`
                  ${idx === 0 ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4'}
                `}
              >
                <div className="h-full min-h-[400px] relative rounded-md overflow-hidden group cursor-pointer border border-ink-ash/20" onClick={() => setPreview(product)}>
                  <Image 
                    src={product.image_url} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-void via-ink-void/40 to-transparent opacity-80" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="market-badge-new !bg-ink-gold !text-ink-void">NEW</span>
                      <span className="market-cat-pill !border-none !bg-ink-void/50 backdrop-blur-sm">
                        {CAT_LABEL[product.category]}
                      </span>
                    </div>
                    <Thunder as="h3" size="section" weight={400} className="text-ink-paper leading-none mb-2 group-hover:text-ink-gold transition-colors">
                      {product.name}
                    </Thunder>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-end gap-2">
                        <span className="font-thunder text-ink-paper leading-none" style={{ fontSize: '1.8rem', fontWeight: 400 }}>
                          {fmtNGN(product.price_ngn)}
                        </span>
                        <span className="font-mono text-ink-ash/60 text-[0.65rem] mb-1">{fmtUSD(product.price_usd)}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addItem(product); openCart(); }} 
                        className="market-add-btn !flex-none w-10 h-10 flex items-center justify-center rounded-full !border-ink-paper/20 hover:!bg-ink-paper hover:!text-ink-void hover:!border-ink-paper transition-all"
                        aria-label="Add to cart"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Assets Section */}
      {featuredAssets.length > 0 && (
        <section className="py-16 md:py-24 border-b border-ink-ash/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-ink-dark pointer-events-none" />
          <div className="ink-grain absolute inset-0 z-[1] pointer-events-none opacity-30" />
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <Label variant="tag" className="text-ink-green mb-2 block">FOR CREATORS</Label>
                <Thunder as="h2" size="display" weight={400} className="text-ink-paper">
                  FEATURED ASSETS
                </Thunder>
                <Body size="sm" className="text-ink-ash/80 max-w-[45ch] mt-2">
                  High-quality 3D models, textures, and creative resources used directly in DYFF productions.
                </Body>
              </div>
              <button 
                onClick={() => { setActiveCat('assets'); gridRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                className="font-mono text-ink-paper text-[0.65rem] tracking-widest border border-ink-paper/20 px-6 py-3 rounded hover:bg-ink-paper hover:text-ink-void transition-colors self-start md:self-auto"
              >
                VIEW ALL ASSETS
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredAssets.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onPreview={setPreview}
                  onPlay={handlePlay}
                  isPlaying={playingId === p.id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. All Products (The Main Grid) */}
      <section className="pt-8 pb-24" id="all-products">
        <FilterBar activeCat={activeCat} sortBy={sortBy} onCat={setActiveCat} onSort={setSortBy} />
        
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 mt-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-ink-ash/40 text-[0.58rem] tracking-[0.15em] uppercase">
              {visible.length} {visible.length === 1 ? 'product' : 'products'}{activeCat !== 'ALL' ? ` · ${CAT_LABEL[activeCat as ProductCategory]}` : ''}
            </span>
            <div className="flex-1 h-px bg-ink-ash/10" />
          </div>

          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 min-h-[40vh]">
            {paginatedVisible.map(product => (
              <div key={product.id} className="grid-item market-card-wrap">
                <ProductCard
                  product={product}
                  onPreview={setPreview}
                  onPlay={handlePlay}
                  isPlaying={playingId === product.id}
                />
              </div>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="py-24 flex flex-col items-center gap-4">
              <Thunder as="p" size="card" weight={400} className="text-ink-paper/15 leading-none">NOTHING HERE YET</Thunder>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1))
                  gridRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
                disabled={currentPage === 1}
                className="market-filter-tab disabled:opacity-30 disabled:cursor-not-allowed"
              >
                PREV
              </button>
              <span className="font-mono text-ink-ash/60 text-[0.7rem]">
                PAGE {currentPage} OF {totalPages}
              </span>
              <button
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1))
                  gridRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
                disabled={currentPage === totalPages}
                className="market-filter-tab disabled:opacity-30 disabled:cursor-not-allowed"
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Preview modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6" onClick={closePreview}>
          <div className="absolute inset-0 bg-ink-void/85 backdrop-blur-sm" aria-hidden="true" />
          <div
            className="relative z-[1] bg-ink-dark border border-ink-ash/20 rounded-md max-w-md w-full overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full aspect-video bg-ink-void">
              <Image src={previewProduct.image_url} alt={previewProduct.name} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className={`${catClass(previewProduct.category)} mb-3 flex items-center gap-2`}>
                <span className="market-cat-pill">{CAT_LABEL[previewProduct.category]}</span>
                {previewProduct.tags.includes('new') && <span className="market-badge-new">NEW</span>}
              </div>
              <Thunder as="h2" size="card" weight={400} className="text-ink-paper leading-tight mb-2">{previewProduct.name}</Thunder>
              <Body size="sm" className="text-ink-ash/70 leading-relaxed mb-6 line-clamp-3">{previewProduct.description}</Body>

              {/* Beat audio preview player */}
              {previewProduct.category === 'beats' && previewProduct.preview_url && (
                <div className="beat-modal-player mb-4">
                  <div className="beat-modal-player-row">
                    <button
                      className="beat-modal-play-btn hover:bg-ink-green hover:text-ink-void transition-colors"
                      onClick={() => handlePlay(previewProduct)}
                      aria-label={playingId === previewProduct.id ? 'Pause preview' : 'Play preview'}
                    >
                      {playingId === previewProduct.id
                        ? <Pause size={16} fill="currentColor" strokeWidth={0} />
                        : <Play  size={16} fill="currentColor" strokeWidth={0} />
                      }
                    </button>
                    <div className="beat-modal-track group" onClick={handleSeek} role="slider" aria-label="Seek" aria-valuenow={beatProgress} aria-valuemin={0} aria-valuemax={beatDuration || 0}>
                      <div className="absolute inset-0 bg-ink-ash/10 rounded-full group-hover:bg-ink-ash/20 transition-colors" />
                      <div
                        className="beat-modal-fill rounded-full relative"
                        style={{ width: beatDuration ? `${(beatProgress / beatDuration) * 100}%` : '0%' }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-ink-paper rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2" />
                      </div>
                    </div>
                    <span className="beat-modal-time font-mono">
                      {fmtTime(beatProgress)}
                    </span>
                  </div>
                  <span className="beat-modal-label font-mono">PREVIEW CLIP</span>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-ash/10">
                <span className="font-thunder text-ink-paper" style={{ fontSize: '1.6rem', fontWeight: 400 }}>
                  {fmtNGN(previewProduct.price_ngn)}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={closePreview}
                    className="font-mono text-ink-ash/50 text-[0.6rem] tracking-[0.15em] uppercase hover:text-ink-paper transition-colors duration-150 cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addItem(previewProduct); openCart(); closePreview(); }}
                    className="market-add-btn !w-auto px-6 py-2"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
