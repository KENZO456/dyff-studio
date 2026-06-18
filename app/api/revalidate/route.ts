/**
 * POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=<tag>
 *
 * Webhook endpoint for on-demand cache revalidation. Call this from a
 * Supabase Database Webhook (or any POST trigger) whenever content changes.
 * Purges the matching Next.js cache tag so fresh data is served immediately.
 *
 * Valid tags: books | audio | animations | marketplace
 *
 * Example curl:
 *   curl -X POST "https://yourdomain.com/api/revalidate?secret=xxx&tag=books"
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const VALID_TAGS = ['books', 'audio', 'animations', 'marketplace'] as const
type ValidTag   = (typeof VALID_TAGS)[number]

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET is not configured on this server.' },
      { status: 500 },
    )
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret.' }, { status: 401 })
  }

  // ── Tag validation ────────────────────────────────────────────────────────
  const tag = req.nextUrl.searchParams.get('tag') as ValidTag | null
  if (!tag) {
    return NextResponse.json(
      { error: `Missing ?tag= param. Valid values: ${VALID_TAGS.join(', ')}` },
      { status: 400 },
    )
  }
  if (!(VALID_TAGS as readonly string[]).includes(tag)) {
    return NextResponse.json(
      { error: `Unknown tag "${tag}". Valid values: ${VALID_TAGS.join(', ')}` },
      { status: 400 },
    )
  }

  // ── Revalidate ────────────────────────────────────────────────────────────
  revalidateTag(tag)

  return NextResponse.json({
    revalidated: true,
    tag,
    ts: Date.now(),
  })
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
}
