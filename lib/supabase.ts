// ============================================================
//  DYFF STUDIO — lib/supabase.ts
//  Drop this file into your Next.js project at lib/supabase.ts
//  Replaces all Notion fetch functions.
// ============================================================

import { createClient } from '@supabase/supabase-js'

// ── Types ────────────────────────────────────────────────────

export type Book = {
  id: string
  title: string
  slug: string
  author: string
  genre: string[]
  synopsis: string
  cover_url: string
  status: 'published' | 'draft' | 'coming_soon'
  chapter_count: number
  created_at: string
  updated_at: string
}

export type Chapter = {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  word_count: number
  status: 'published' | 'draft' | 'editing'
  created_at: string
  updated_at: string
}

export type AudioSeries = {
  id: string
  name: string
  slug: string
  genre: string
  description: string
  cover_url: string
  episode_count: number
  status: 'active' | 'completed' | 'coming_soon' | 'draft'
  created_at: string
  updated_at: string
}

export type Episode = {
  id: string
  series_id: string
  episode_number: number
  season: number
  title: string
  description: string
  audio_url: string
  duration: string
  status: 'published' | 'draft' | 'scheduled'
  created_at: string
  updated_at: string
}

export type Animation = {
  id: string
  title: string
  slug: string
  video_url: string
  thumbnail_url: string
  type: 'series' | 'short' | 'trailer' | 'teaser'
  runtime: string
  description: string
  status: 'published' | 'draft' | 'coming_soon'
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  name: string
  slug: string
  category: 'digital_art' | 'books' | 'beats' | 'assets'
  price_ngn: number
  price_usd: number
  description: string
  image_url: string
  download_url: string
  tags: string[]
  status: 'active' | 'draft' | 'out_of_stock' | 'coming_soon'
  created_at: string
  updated_at: string
}

export type OrderItem = {
  id:           string
  name:         string
  qty:          number
  price_ngn:    number
  price_usd:    number
  download_url: string
}

export type Order = {
  id:            string
  reference:     string
  email:         string
  first_name:    string
  last_name:     string
  phone:         string | null
  items:         OrderItem[]
  total_ngn:     number
  total_usd:     number
  status:        'pending' | 'paid' | 'failed' | 'refunded'
  paystack_data: Record<string, unknown> | null
  created_at:    string
  updated_at:    string
}

// ── Supabase client ──────────────────────────────────────────

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Service role client — for server-side only (API routes, Server Actions)
// Never expose SUPABASE_SERVICE_ROLE_KEY to the browser
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Storage URL helper ────────────────────────────────────────
export function storageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

// ============================================================
//  BOOKS
// ============================================================

// Get all published books
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) { console.error('getBooks error:', error); return [] }
  return data as Book[]
}

// Get a single book by slug
export async function getBookBySlug(slug: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) { console.error('getBookBySlug error:', error); return null }
  return data as Book
}

// Get all slugs for generateStaticParams
export async function getBookSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('books')
    .select('slug')
    .eq('status', 'published')

  if (error) return []
  return data.map((b: { slug: string }) => b.slug)
}

// ============================================================
//  CHAPTERS
// ============================================================

// Get all published chapters for a book — ordered by chapter_number
export async function getChaptersByBook(bookId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .eq('status', 'published')
    .order('chapter_number', { ascending: true })

  if (error) { console.error('getChaptersByBook error:', error); return [] }
  return data as Chapter[]
}

// Get a single chapter
export async function getChapter(bookId: string, chapterNumber: number): Promise<Chapter | null> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('book_id', bookId)
    .eq('chapter_number', chapterNumber)
    .eq('status', 'published')
    .single()

  if (error) { console.error('getChapter error:', error); return null }
  return data as Chapter
}

// Get a book with ALL its published chapters in one query
export async function getBookWithChapters(slug: string): Promise<{
  book: Book
  chapters: Chapter[]
} | null> {
  const book = await getBookBySlug(slug)
  if (!book) return null

  const chapters = await getChaptersByBook(book.id)
  return { book, chapters }
}

// ============================================================
//  AUDIO SERIES
// ============================================================

// Get all active audio series
export async function getAudioSeries(): Promise<AudioSeries[]> {
  const { data, error } = await supabase
    .from('audio_series')
    .select('*')
    .in('status', ['active', 'completed'])
    .order('created_at', { ascending: false })

  if (error) { console.error('getAudioSeries error:', error); return [] }
  return data as AudioSeries[]
}

// Get a single series by slug
export async function getSeriesBySlug(slug: string): Promise<AudioSeries | null> {
  const { data, error } = await supabase
    .from('audio_series')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) { console.error('getSeriesBySlug error:', error); return null }
  return data as AudioSeries
}

// ============================================================
//  EPISODES
// ============================================================

// Get all published episodes for a series
export async function getEpisodesBySeries(seriesId: string): Promise<Episode[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('series_id', seriesId)
    .eq('status', 'published')
    .order('season',          { ascending: true })
    .order('episode_number',  { ascending: true })

  if (error) { console.error('getEpisodesBySeries error:', error); return [] }
  return data as Episode[]
}

// Get a series with all its published episodes
export async function getSeriesWithEpisodes(slug: string): Promise<{
  series: AudioSeries
  episodes: Episode[]
} | null> {
  const series = await getSeriesBySlug(slug)
  if (!series) return null

  const episodes = await getEpisodesBySeries(series.id)
  return { series, episodes }
}

// ============================================================
//  ANIMATIONS
// ============================================================

// Get all published animations — optional type filter
export async function getAnimations(type?: Animation['type']): Promise<Animation[]> {
  let query = supabase
    .from('animations')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) { console.error('getAnimations error:', error); return [] }
  return data as Animation[]
}

// Get a single animation by slug
export async function getAnimationBySlug(slug: string): Promise<Animation | null> {
  const { data, error } = await supabase
    .from('animations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) { console.error('getAnimationBySlug error:', error); return null }
  return data as Animation
}

// ============================================================
//  MARKETPLACE
// ============================================================

export type ProductCategory = 'digital_art' | 'books' | 'beats' | 'assets'
export type ProductSort     = 'newest' | 'popular' | 'price_asc' | 'price_desc'

// Get all active products with optional filters
export async function getProducts(options?: {
  category?: ProductCategory
  sort?:     ProductSort
  tag?:      string           // e.g. 'featured', 'new', 'bestseller'
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.tag) {
    query = query.contains('tags', [options.tag])
  }

  switch (options?.sort) {
    case 'price_asc':  query = query.order('price_ngn', { ascending: true });  break
    case 'price_desc': query = query.order('price_ngn', { ascending: false }); break
    default:           query = query.order('created_at', { ascending: false }); break
  }

  const { data, error } = await query
  if (error) { console.error('getProducts error:', error); return [] }
  return data as Product[]
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) { console.error('getProductBySlug error:', error); return null }
  return data as Product
}

// Get featured products for homepage
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ tag: 'featured' })
}

// ============================================================
//  SIGNED URL FOR PRIVATE ASSET DOWNLOADS
//  Call this server-side after confirming purchase
// ============================================================
export async function getAssetDownloadUrl(path: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from('assets')
    .createSignedUrl(path, 60 * 60) // URL valid for 1 hour

  if (error) { console.error('getAssetDownloadUrl error:', error); return null }
  return data.signedUrl
}
