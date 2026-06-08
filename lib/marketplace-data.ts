export type ProductCategory = 'ART' | 'BOOKS' | 'BEATS' | 'ASSETS'
export type SortOption      = 'newest' | 'popular' | 'price-asc' | 'price-desc'

export interface Product {
  id:          string
  title:       string
  subtitle:    string
  category:    ProductCategory
  priceNGN:    number
  priceUSD:    number
  imageId:     string   // picsum.photos seed
  description: string
  tags:        string[]
  popularity:  number   // 0–100
  isNew:       boolean
}

// ₦ / $ prices use an approximate ₦1,500 per $1 reference rate.
// Update with Paystack live FX when integrating payments.
export const PRODUCTS: Product[] = [
  // ── ART (gold) ──────────────────────────────────────────────────
  {
    id:          'art-gwava-city',
    title:       'GWAVA CITY',
    subtitle:    'Limited Digital Illustration',
    category:    'ART',
    priceNGN:    8500,
    priceUSD:    5.99,
    imageId:     'gwava',
    description: 'High-resolution digital illustration of the fictional Lagos-inspired city that anchors the GWAVA universe. 4000×5000px, ICC-proofed.',
    tags:        ['illustration', 'limited', 'cityscape'],
    popularity:  88,
    isNew:       true,
  },
  {
    id:          'art-ink-bloom',
    title:       'INK BLOOM',
    subtitle:    'Abstract Print — Series 1',
    category:    'ART',
    priceNGN:    12000,
    priceUSD:    7.99,
    imageId:     'inkbloom',
    description: 'Abstract ink-bleed study. Each bloom was photographed during production and composited digitally. Print-ready PDF included.',
    tags:        ['abstract', 'print', 'ink'],
    popularity:  74,
    isNew:       false,
  },

  // ── BOOKS (crimson) ─────────────────────────────────────────────
  {
    id:          'book-leviticus',
    title:       'LEGEND OF LEVITICUS',
    subtitle:    'Vol. 1 — Complete eBook',
    category:    'BOOKS',
    priceNGN:    1500,
    priceUSD:    1.00,
    imageId:     'leviticus',
    description: 'Seven gates. One bloodline. Lagos will never look the same. The full first volume of DYFF\'s flagship dark-fantasy series.',
    tags:        ['ebook', 'fantasy', 'action'],
    popularity:  96,
    isNew:       false,
  },
  {
    id:          'book-ese',
    title:       'ESE',
    subtitle:    'Complete Edition — All 8 Chapters',
    category:    'BOOKS',
    priceNGN:    2500,
    priceUSD:    1.75,
    imageId:     'ese',
    description: 'The full ESE romance series in one volume. Lagos to London. Long-distance love written in vanishing ink.',
    tags:        ['ebook', 'romance', 'complete'],
    popularity:  82,
    isNew:       true,
  },

  // ── BEATS (violet) ──────────────────────────────────────────────
  {
    id:          'beat-night-signal',
    title:       'NIGHT SIGNAL',
    subtitle:    'Type Beat — Trap / Cinematic',
    category:    'BEATS',
    priceNGN:    15000,
    priceUSD:    9.99,
    imageId:     'nightsignal',
    description: 'Dark cinematic trap instrumental. 140 BPM, key of C minor. WAV + MP3 + trackout stems included. Basic license.',
    tags:        ['trap', 'cinematic', 'basic-license'],
    popularity:  79,
    isNew:       true,
  },
  {
    id:          'beat-dark-matter',
    title:       'DARK MATTER',
    subtitle:    'Exclusive Beat — Afro-Drill',
    category:    'BEATS',
    priceNGN:    65000,
    priceUSD:    43.99,
    imageId:     'darkmatter',
    description: 'Full exclusive rights. Afro-drill fusion, 130 BPM, C# minor. Custom mix session files included. One artist only.',
    tags:        ['afro-drill', 'exclusive', 'stems'],
    popularity:  91,
    isNew:       false,
  },

  // ── ASSETS (indigo) ─────────────────────────────────────────────
  {
    id:          'asset-ui-kit',
    title:       'DYFF UI KIT',
    subtitle:    'Figma + Tailwind Design System',
    category:    'ASSETS',
    priceNGN:    25000,
    priceUSD:    16.99,
    imageId:     'uikit',
    description: 'The complete DYFF design system. 200+ Figma components, full Tailwind v3 config, Thunder font tokens, ink animation presets.',
    tags:        ['figma', 'tailwind', 'design-system'],
    popularity:  85,
    isNew:       true,
  },
  {
    id:          'asset-thunder-pack',
    title:       'THUNDER TYPE PACK',
    subtitle:    'Desktop + Web Font License',
    category:    'ASSETS',
    priceNGN:    18000,
    priceUSD:    11.99,
    imageId:     'thunder',
    description: 'Full commercial license for all 8 Thunder weights (TTF + WOFF2). Covers 1 desktop + unlimited web pageviews.',
    tags:        ['font', 'license', 'commercial'],
    popularity:  68,
    isNew:       false,
  },
]

export function getProductsByCategory(cat: 'ALL' | ProductCategory): Product[] {
  return cat === 'ALL' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat)
}

export function sortProducts(products: Product[], by: SortOption): Product[] {
  const copy = [...products]
  switch (by) {
    case 'popular':    return copy.sort((a, b) => b.popularity - a.popularity)
    case 'price-asc':  return copy.sort((a, b) => a.priceNGN - b.priceNGN)
    case 'price-desc': return copy.sort((a, b) => b.priceNGN - a.priceNGN)
    default:           return copy  // newest = original array order
  }
}

// Picsum seed → URL
export function productThumb(imageId: string, w = 600, h = 500) {
  return `https://picsum.photos/seed/${imageId}/${w}/${h}`
}

export const CATEGORY_COLORS: Record<ProductCategory, string> = {
  ART:    '#c9a84c',   // gold
  BOOKS:  '#8b0000',   // crimson
  BEATS:  '#6c00b3',   // violet
  ASSETS: '#1a0050',   // indigo
}
