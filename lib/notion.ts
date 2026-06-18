/**
 * lib/notion.ts — Notion CMS helpers for DYFF Studio
 *
 * All exported functions are cached by Next.js unstable_cache with a 1-hour
 * TTL and named tags so the /api/revalidate webhook can purge them on-demand.
 *
 * Return types are identical to the existing static data interfaces so pages
 * can switch between the static fallback and Notion with zero JSX changes.
 */

import { Client, isFullPage } from '@notionhq/client'
import { unstable_cache } from 'next/cache'
import type { Book, Chapter } from './books-data'
import type { AudioSeries, Episode } from './audio-data'
import type { AnimationEntry } from './animations-data'
import type { Product, ProductCategory } from './marketplace-data'

// ─── Client ──────────────────────────────────────────────────────────────────

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// ─── Property extractors ─────────────────────────────────────────────────────
// All access the Notion API's property bag via `unknown` and return typed
// primitives — no deep Notion SDK type imports needed.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = Record<string, any>

// Find the title-type property regardless of what the user named it in Notion
function getTitle(p: Props): string {
  for (const key of Object.keys(p)) {
    const v = p[key]
    if (v?.type === 'title') return v.title[0]?.plain_text ?? ''
  }
  return ''
}

function getText(p: Props, name: string): string {
  const v = p[name]
  if (!v) return ''
  if (v.type === 'title')     return v.title[0]?.plain_text     ?? ''
  if (v.type === 'rich_text') return v.rich_text[0]?.plain_text ?? ''
  if (v.type === 'url')       return v.url                       ?? ''
  if (v.type === 'email')     return v.email                     ?? ''
  if (v.type === 'phone_number') return v.phone_number           ?? ''
  return ''
}

function getAllText(p: Props, name: string): string {
  const v = p[name]
  if (!v) return ''
  const arr: { plain_text: string }[] =
    v.type === 'title' ? v.title : v.type === 'rich_text' ? v.rich_text : []
  return arr.map(rt => rt.plain_text).join('')
}

function getSelect(p: Props, name: string): string {
  const v = p[name]
  return v?.type === 'select' ? (v.select?.name ?? '') : ''
}

function getMultiSelect(p: Props, name: string): string[] {
  const v = p[name]
  return v?.type === 'multi_select' ? v.multi_select.map((s: { name: string }) => s.name) : []
}

function getNumber(p: Props, name: string): number {
  const v = p[name]
  return v?.type === 'number' ? (v.number ?? 0) : 0
}

function getRelationIds(p: Props, name: string): string[] {
  const v = p[name]
  return v?.type === 'relation' ? v.relation.map((r: { id: string }) => r.id) : []
}

function getCheckbox(p: Props, name: string): boolean {
  const v = p[name]
  return v?.type === 'checkbox' ? v.checkbox : false
}

// Extract the first file URL from a files-type property (tries each name in order)
function getFileUrl(p: Props, ...names: string[]): string {
  for (const name of names) {
    const v = p[name]
    if (!v || v.type !== 'files' || !v.files.length) continue
    const f = v.files[0]
    return f.type === 'external' ? (f.external?.url ?? '') : (f.file?.url ?? '')
  }
  return ''
}

// Extract the Notion page cover image URL (external link or hosted S3 file)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoverUrl(page: any): string {
  if (!page?.cover) return ''
  return page.cover.type === 'external'
    ? (page.cover.external?.url ?? '')
    : (page.cover.file?.url ?? '')
}

// Convert a display string to a URL-safe slug
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Blocks → paragraph strings ──────────────────────────────────────────────

async function fetchParagraphs(pageId: string): Promise<string[]> {
  const { results } = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  })
  const out: string[] = []
  for (const block of results) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b = block as any
    if (b.type === 'paragraph') {
      const text = b.paragraph.rich_text
        .map((rt: { plain_text: string }) => rt.plain_text)
        .join('')
      if (text.trim()) out.push(text)
    }
  }
  return out
}

// ─── YouTube ID helper ────────────────────────────────────────────────────────

function youtubeId(urlOrId: string): string {
  if (!urlOrId) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId
  try {
    const url = new URL(urlOrId)
    return url.searchParams.get('v') ?? url.pathname.split('/').pop() ?? urlOrId
  } catch {
    return urlOrId
  }
}

function parseDuration(dur: string): number {
  const [m = '0', s = '0'] = dur.split(':')
  return parseInt(m, 10) * 60 + parseInt(s, 10)
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

async function mapChapter(pageId: string): Promise<Chapter> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  if (!isFullPage(page)) throw new Error(`Chapter ${pageId} is not a full page`)
  const p = page.properties as Props
  return {
    number:     getNumber(p, 'Chapter Number') || getNumber(p, 'Number') || getNumber(p, 'Order'),
    title:      getText(p, 'Title') || getTitle(p),
    paragraphs: await fetchParagraphs(page.id),
  }
}

/**
 * Build a Book from an already-fetched DB page — NO extra API calls.
 * Used by getBooks() for fast listing without chapter content.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assembleBookMeta(page: any): Book {
  const p = page.properties as Props
  const chapterIds = getRelationIds(p, 'Chapters')
  const rawTitle = getText(p, 'Title') || getTitle(p)
  const rawSlug  = getText(p, 'Slug')
  return {
    slug:         slugify(rawSlug || rawTitle),
    title:        rawTitle,
    subtitle:     getText(p, 'Subtitle'),
    author:       getText(p, 'Author'),
    genre:        getMultiSelect(p, 'Genre'),
    synopsis:     getAllText(p, 'Synopsis'),
    accentColor:  getText(p, 'Accent Color'),
    coverFrom:    getText(p, 'Cover From'),
    coverUrl:     getCoverUrl(page) || getFileUrl(p, 'Cover', 'Image', 'Thumbnail'),
    bgVideoId:    getText(p, 'BG Video ID'),
    status:       getSelect(p, 'Status') === 'Published' ? 'complete' : 'ongoing',
    chapterCount: chapterIds.length,
    year:         getNumber(p, 'Year'),
    chapters: [],   // populated by assembleBookFull (reader only)
  }
}

/**
 * Build a Book from a page ID with full chapter content.
 * Used by getBookBySlug() for the book reader — one book at a time.
 */
async function assembleBookFull(pageId: string): Promise<Book> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  if (!isFullPage(page)) throw new Error(`Book ${pageId} not a full page`)
  const p = page.properties as Props

  const chapterIds = getRelationIds(p, 'Chapters')
  const chapters = await Promise.all(chapterIds.map(mapChapter))
  chapters.sort((a, b) => a.number - b.number)

  const rawTitle = getText(p, 'Title') || getTitle(p)
  const rawSlug  = getText(p, 'Slug')

  return {
    slug:         slugify(rawSlug || rawTitle),
    title:        rawTitle,
    subtitle:     getText(p, 'Subtitle'),
    author:       getText(p, 'Author'),
    genre:        getMultiSelect(p, 'Genre'),
    synopsis:     getAllText(p, 'Synopsis'),
    accentColor:  getText(p, 'Accent Color'),
    coverFrom:    getText(p, 'Cover From'),
    coverUrl:     getCoverUrl(page) || getFileUrl(p, 'Cover', 'Image', 'Thumbnail'),
    bgVideoId:    getText(p, 'BG Video ID'),
    status:       getSelect(p, 'Status') === 'Published' ? 'complete' : 'ongoing',
    chapterCount: chapters.length,
    year:         getNumber(p, 'Year'),
    chapters,
  }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Fetch all books from Notion (listing metadata only — no chapter content).
 * Fast: only the DB query, no per-page or per-block fetches.
 * Cached for 1 hour; purge with revalidateTag('books').
 */
export const getBooks = unstable_cache(
  async (): Promise<Book[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS_DB_ID!,
    })
    return results.filter(isFullPage).map(assembleBookMeta)
  },
  ['notion-books'],
  { revalidate: 3600, tags: ['books'] },
)

/**
 * Fetch a single book with full chapter content for the reader.
 * Finds the page in the DB, then fetches all chapters and paragraphs.
 * Cached per slug; purge with revalidateTag('books').
 */
export const getBookBySlug = unstable_cache(
  async (slug: string): Promise<Book | undefined> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS_DB_ID!,
    })
    const page = results.filter(isFullPage).find(p => {
      const props = p.properties as Props
      const rawSlug = getText(props, 'Slug')
      const title   = getText(props, 'Title') || getTitle(props)
      return slugify(rawSlug || title) === slug
    })
    if (!page) return undefined
    return assembleBookFull(page.id)
  },
  ['notion-book-by-slug'],
  { revalidate: 3600, tags: ['books'] },
)

/**
 * Fetch all audio series (all statuses).
 * Cached for 1 hour; purge with revalidateTag('audio').
 */
export const getAudioSeries = unstable_cache(
  async (): Promise<AudioSeries[]> => {
    const { results: seriesPages } = await notion.databases.query({
      database_id: process.env.NOTION_AUDIO_DB_ID!,
    })

    return Promise.all(
      seriesPages.filter(isFullPage).map(async seriesPage => {
        const p = seriesPage.properties as Props
        const episodes = await getEpisodesBySeries(seriesPage.id)
        const rawTitle = getTitle(p) || getText(p, 'Series Name') || getText(p, 'Title')
        const rawSlug  = getText(p, 'Slug')

        return {
          slug:         slugify(rawSlug || rawTitle),
          title:        rawTitle,
          subtitle:     getText(p, 'Subtitle'),
          genre:        getSelect(p, 'Genre'),
          accentColor:  getText(p, 'Accent Color'),
          coverFrom:    getText(p, 'Cover From'),
          coverVia:     getText(p, 'Cover Via'),
          coverUrl:     getCoverUrl(seriesPage) || getFileUrl(p, 'Cover', 'Image', 'Thumbnail'),
          bgVideoId:    getText(p, 'BG Video ID'),
          status:       getSelect(p, 'Status') === 'Complete' ? 'complete' : 'ongoing',
          episodeCount: getNumber(p, 'Episode Count') || episodes.length,
          year:         getNumber(p, 'Year'),
          logline:      getAllText(p, 'Description'),
          episodes,
        } satisfies AudioSeries
      }),
    )
  },
  ['notion-audio'],
  { revalidate: 3600, tags: ['audio'] },
)

/**
 * Fetch all episodes for a given series page ID.
 * Scans ALL relation-type properties on each episode so the relation can be
 * named anything in Notion (e.g. "Series", "Show", "Audio Series", etc.).
 */
export const getEpisodesBySeries = unstable_cache(
  async (seriesId: string): Promise<Episode[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_EPISODES_DB_ID!,
      page_size: 100,
    })

    return results
      .filter(isFullPage)
      .filter(page => {
        const props = page.properties as Props
        return Object.values(props).some(v =>
          v?.type === 'relation' &&
          (v.relation as Array<{ id: string }>).some(r => r.id === seriesId),
        )
      })
      .map(page => {
        const p = page.properties as Props
        const dur = getText(p, 'Duration')
        return {
          id:              page.id,
          number:          getNumber(p, 'Episode Number') || getNumber(p, 'Number') || getNumber(p, 'Order'),
          title:           getTitle(p) || getText(p, 'Title') || getText(p, 'Name'),
          description:     getAllText(p, 'Description'),
          duration:        dur,
          durationSeconds: parseDuration(dur),
          audioUrl:        getText(p, 'Audio URL') || getText(p, 'Audio') || getText(p, 'URL'),
        } satisfies Episode
      })
      .sort((a, b) => a.number - b.number)
  },
  ['notion-episodes'],
  { revalidate: 3600, tags: ['audio'] },
)

/**
 * Fetch all animation entries.
 * Cached for 1 hour; purge with revalidateTag('animations').
 */
export const getAnimations = unstable_cache(
  async (): Promise<AnimationEntry[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_ANIMATIONS_DB_ID!,
    })

    const typeMap: Record<string, AnimationEntry['category']> = {
      Series: 'SERIES', Short: 'SHORTS', Trailer: 'TRAILER',
    }

    return results.filter(isFullPage).map(page => {
      const p = page.properties as Props
      const rawTitle = getTitle(p) || getText(p, 'Title')
      return {
        id:        getText(p, 'Slug') || slugify(rawTitle),
        title:     rawTitle,
        subtitle:  getText(p, 'Subtitle'),
        runtime:   getText(p, 'Runtime'),
        category:  typeMap[getSelect(p, 'Type')] ?? 'SERIES',
        youtubeId: youtubeId(getText(p, 'Video URL') || getText(p, 'YouTube URL')),
        year:      getNumber(p, 'Year'),
        logline:   getAllText(p, 'Description'),
      } satisfies AnimationEntry
    })
  },
  ['notion-animations'],
  { revalidate: 3600, tags: ['animations'] },
)

/**
 * Fetch marketplace products. Pass a category to filter; omit for all active products.
 * Cached per category string; purge with revalidateTag('marketplace').
 */
export const getMarketplaceProducts = unstable_cache(
  async (category?: ProductCategory): Promise<Product[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_MARKETPLACE_DB_ID!,
      filter: category
        ? { and: [
            { property: 'Status',   select: { equals: 'Active'   } },
            { property: 'Category', select: { equals: category   } },
          ] }
        : { property: 'Status', select: { equals: 'Active' } },
    })

    const validCategories = new Set<ProductCategory>(['ART', 'BOOKS', 'BEATS', 'ASSETS'])

    return results.filter(isFullPage).map(page => {
      const p = page.properties as Props
      const rawCat = getSelect(p, 'Category').toUpperCase() as ProductCategory
      return {
        id:          getText(p, 'Slug'),
        title:       getTitle(p),
        subtitle:    getText(p, 'Subtitle'),
        category:    validCategories.has(rawCat) ? rawCat : 'ART',
        priceNGN:    getNumber(p, 'Price NGN'),
        priceUSD:    getNumber(p, 'Price USD'),
        imageId:     getText(p, 'Image ID'),
        description: getAllText(p, 'Description'),
        tags:        getMultiSelect(p, 'Tags'),
        popularity:  getNumber(p, 'Popularity'),
        isNew:       getCheckbox(p, 'Is New'),
      } satisfies Product
    })
  },
  ['notion-marketplace'],
  { revalidate: 3600, tags: ['marketplace'] },
)
