'use client'

import {
  useRef, useEffect, useState, useCallback, useMemo,
} from 'react'
import Image from 'next/image'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Eye }           from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart }       from '@/contexts/CartContext'
import StickyNarrative   from '@/components/sections/StickyNarrative'
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

interface CardProps {
  product:   Product
  onPreview: (p: Product) => void
}

function ProductCard({ product, onPreview }: CardProps) {
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

  const handleAddToCart = useCallback(() => {
    addItem(product)
    openCart()
    const cartIcon    = cartIconRef.current
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

  return (
    <div ref={wrapRef} className={`market-card-wrap ${catClass(product.category)}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div ref={cardRef} className="market-card">
        <div ref={imgContainerRef} className="market-card-img relative">
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
        </div>
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="market-cat-pill">{CAT_LABEL[product.category]}</span>
          </div>
          <Thunder as="h3" size="card" weight={400} className="text-ink-paper leading-tight line-clamp-1">{product.name}</Thunder>
          <div className="flex items-end gap-2 mt-1">
            <span className="font-thunder text-ink-paper leading-none" style={{ fontSize: '1.4rem', fontWeight: 400 }}>
              {fmtNGN(product.price_ngn)}
            </span>
            <span className="font-mono text-ink-ash/40 text-[0.58rem] mb-0.5">{fmtUSD(product.price_usd)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={handleAddToCart} className="market-add-btn ink-flood-up" aria-label={`Add ${product.name} to cart`}>
              ADD TO CART
            </button>
            <button onClick={() => onPreview(product)} className="market-preview-btn" aria-label={`Preview ${product.name}`}>
              <Eye size={14} />
            </button>
          </div>
        </div>
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
  const [activeCat,      setActiveCat]  = useState<FilterCat>('ALL')
  const [sortBy,         setSortBy]     = useState<ProductSort>('newest')
  const [previewProduct, setPreview]    = useState<Product | null>(null)

  const heroRef       = useRef<HTMLElement>(null)
  const pillsRef      = useRef<HTMLDivElement>(null)
  const gridRef       = useRef<HTMLDivElement>(null)
  const filterInitRef = useRef(false)

  const visible = useMemo(() => {
    const base = activeCat === 'ALL' ? initialProducts : initialProducts.filter(p => p.category === activeCat)
    return sortProducts(base, sortBy)
  }, [activeCat, sortBy, initialProducts])

  useEffect(() => {
    if (!pillsRef.current) return
    const pills = pillsRef.current.querySelectorAll<HTMLElement>('.market-hero-pill-wrap')
    gsap.from(pills, { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, delay: 0.3, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.market-card-wrap', {
        opacity: 0, y: 50, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true },
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!filterInitRef.current) { filterInitRef.current = true; return }
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll<HTMLElement>('.market-card-wrap')
    gsap.from(cards, { opacity: 0, y: 24, stagger: 0.06, duration: 0.45, ease: 'power2.out', overwrite: true })
  }, [activeCat, sortBy])

  return (
    <main className="min-h-screen bg-ink-void">

      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center text-center min-h-[55vh] pt-16 pb-12 px-6 overflow-hidden"
      >
        <Image src="/Images/bg (2).jpg" alt="" fill className="object-cover opacity-10 z-0" aria-hidden="true" />
        <div className="anim-hero-glow absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />
        <div className="ink-grain absolute inset-0 z-[2] pointer-events-none opacity-20" />
        <div className="absolute inset-0 z-[3] flex items-center justify-center select-none pointer-events-none overflow-hidden" aria-hidden="true">
          <span className="font-thunder uppercase text-ink-paper/[0.025] leading-none" style={{ fontSize: 'clamp(8rem, 28vw, 24rem)', fontWeight: 400 }}>
            STORE
          </span>
        </div>
        <div className="relative z-[4] flex flex-col items-center gap-6 max-w-3xl">
          <Label variant="tag" className="text-ink-green">DYFF MARKETPLACE</Label>
          <Thunder as="h1" size="hero" weight={400} className="text-ink-paper leading-none">
            OWN A PIECE<br />OF THE WORLD.
          </Thunder>
          <Body size="base" className="text-ink-white/80 max-w-[42ch] leading-relaxed">
            Digital art, original music, books, and creative assets from the DYFF universe.
            Everything here was made by the same people who built the stories. When you buy
            from the DYFF marketplace, you are directly funding the next chapter.
          </Body>
          <div ref={pillsRef} className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {HERO_PILLS.map(({ cat, dot }) => (
              <div key={cat} className="market-hero-pill-wrap flex items-center gap-3">
                <button
                  className={`market-hero-pill ${catClass(cat)}`}
                  onClick={() => setActiveCat(cat)}
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

      <StickyNarrative />

      <FilterBar activeCat={activeCat} sortBy={sortBy} onCat={setActiveCat} onSort={setSortBy} />

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-ink-ash/40 text-[0.58rem] tracking-[0.15em] uppercase">
            {visible.length} {visible.length === 1 ? 'product' : 'products'}{activeCat !== 'ALL' ? ` · ${CAT_LABEL[activeCat as ProductCategory]}` : ''}
          </span>
          <div className="flex-1 h-px bg-ink-ash/10" />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {visible.map(product => (
            <ProductCard key={product.id} product={product} onPreview={setPreview} />
          ))}
        </div>

        {visible.length === 0 && (
          <div className="py-24 flex flex-col items-center gap-4">
            <Thunder as="p" size="card" weight={400} className="text-ink-paper/15 leading-none">NOTHING HERE YET</Thunder>
          </div>
        )}
      </section>

      {previewProduct && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-ink-void/85" aria-hidden="true" />
          <div className="relative z-[1] bg-ink-dark border border-ink-ash/20 rounded-sm max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative w-full aspect-video">
              <Image src={previewProduct.image_url} alt={previewProduct.name} fill className="object-cover" />
            </div>
            <div className="p-5">
              <div className={`${catClass(previewProduct.category)} mb-3 flex items-center gap-2`}>
                <span className="market-cat-pill">{CAT_LABEL[previewProduct.category]}</span>
              </div>
              <Thunder as="h2" size="card" weight={400} className="text-ink-paper leading-tight mb-2">{previewProduct.name}</Thunder>
              <Body size="sm" className="text-ink-ash/70 leading-relaxed mb-4">{previewProduct.description}</Body>
              <div className="flex items-center justify-between">
                <span className="font-thunder text-ink-paper" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
                  {fmtNGN(previewProduct.price_ngn)}
                </span>
                <button
                  onClick={() => setPreview(null)}
                  className="font-mono text-ink-ash/50 text-[0.55rem] tracking-[0.15em] uppercase hover:text-ink-paper transition-colors duration-150 cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
