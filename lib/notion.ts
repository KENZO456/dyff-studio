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
    number:     getNumber(p, 'Chapter Number'),
    title:      getText(p, 'Title'),
    paragraphs: await fetchParagraphs(page.id),
  }
}

async function assembleBook(pageId: string): Promise<Book> {
  const page = await notion.pages.retrieve({ page_id: pageId })
  if (!isFullPage(page)) throw new Error(`Book ${pageId} not a full page`)
  const p = page.properties as Props

  const chapterIds = getRelationIds(p, 'Chapters')
  const chapters = await Promise.all(chapterIds.map(mapChapter))
  chapters.sort((a, b) => a.number - b.number)

  const status = getSelect(p, 'Status')
  return {
    slug:         getText(p, 'Slug'),
    title:        getText(p, 'Title'),
    subtitle:     getText(p, 'Subtitle'),
    author:       getText(p, 'Author'),
    genre:        getMultiSelect(p, 'Genre'),
    synopsis:     getAllText(p, 'Synopsis'),
    accentColor:  getText(p, 'Accent Color'),
    coverFrom:    getText(p, 'Cover From'),
    bgVideoId:    getText(p, 'BG Video ID'),
    status:       status === 'Published' ? 'complete' : 'ongoing',
    chapterCount: chapters.length,
    year:         getNumber(p, 'Year'),
    chapters,
  }
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Fetch all published books. Each book includes its chapters with full text.
 * Cached for 1 hour; purge with revalidateTag('books').
 */
export const getBooks = unstable_cache(
  async (): Promise<Book[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS_DB_ID!,
      filter: { property: 'Status', select: { equals: 'Published' } },
      sorts:  [{ property: 'Title', direction: 'ascending' }],
    })

    const pages = results.filter(isFullPage)
    return Promise.all(pages.map(p => assembleBook(p.id)))
  },
  ['notion-books'],
  { revalidate: 3600, tags: ['books'] },
)

/**
 * Fetch a single book by its slug. Returns undefined if not found.
 * Cached per slug; purge with revalidateTag('books').
 */
export const getBookBySlug = unstable_cache(
  async (slug: string): Promise<Book | undefined> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_BOOKS_DB_ID!,
      filter: {
        and: [
          { property: 'Slug',   rich_text: { equals: slug }       },
          { property: 'Status', select:    { equals: 'Published' } },
        ],
      },
    })
    const page = results.filter(isFullPage)[0]
    if (!page) return undefined
    return assembleBook(page.id)
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
      sorts: [{ property: 'Series Name', direction: 'ascending' }],
    })

    return Promise.all(
      seriesPages.filter(isFullPage).map(async seriesPage => {
        const p = seriesPage.properties as Props
        const episodes = await getEpisodesBySeries(seriesPage.id)

        return {
          slug:         getText(p, 'Slug'),
          title:        getText(p, 'Series Name'),
          subtitle:     getText(p, 'Subtitle'),
          genre:        getSelect(p, 'Genre'),
          accentColor:  getText(p, 'Accent Color'),
          coverFrom:    getText(p, 'Cover From'),
          coverVia:     getText(p, 'Cover Via'),
          bgVideoId:    getText(p, 'BG Video ID'),
          status:       getSelect(p, 'Status') === 'Complete' ? 'complete' : 'ongoing',
          episodeCount: getNumber(p, 'Episode Count'),
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
 * Results are sorted by Episode Number ascending.
 */
export const getEpisodesBySeries = unstable_cache(
  async (seriesId: string): Promise<Episode[]> => {
    const { results } = await notion.databases.query({
      database_id: process.env.NOTION_EPISODES_DB_ID!,
      filter: { property: 'Series', relation: { contains: seriesId } },
      sorts:  [{ property: 'Episode Number', direction: 'ascending' }],
    })

    return results.filter(isFullPage).map(page => {
      const p = page.properties as Props
      const dur = getText(p, 'Duration')
      return {
        id:              page.id,
        number:          getNumber(p, 'Episode Number'),
        title:           getText(p, 'Title'),
        description:     getAllText(p, 'Description'),
        duration:        dur,
        durationSeconds: parseDuration(dur),
        audioUrl:        getText(p, 'Audio URL'),
      } satisfies Episode
    })
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
      sorts: [{ property: 'Title', direction: 'ascending' }],
    })

    const typeMap: Record<string, AnimationEntry['category']> = {
      Series: 'SERIES', Short: 'SHORTS', Trailer: 'TRAILER',
    }

    return results.filter(isFullPage).map(page => {
      const p = page.properties as Props
      return {
        id:        getText(p, 'Slug'),
        title:     getText(p, 'Title'),
        subtitle:  getText(p, 'Subtitle'),
        runtime:   getText(p, 'Runtime'),
        category:  typeMap[getSelect(p, 'Type')] ?? 'SERIES',
        youtubeId: youtubeId(getText(p, 'Video URL')),
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
