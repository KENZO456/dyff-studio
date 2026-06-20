import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getAssetDownloadUrl } from '@/lib/supabase'
import { verifyTransaction } from '@/lib/paystack'

interface OrderItem {
  id:           string
  name:         string
  qty:          number
  download_url: string
}

async function buildDownloads(items: OrderItem[]) {
  // Deduplicate by product id — one download link per product regardless of qty
  const seen = new Set<string>()
  const unique = items.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  return Promise.all(
    unique.map(async item => {
      const isFullUrl = item.download_url.startsWith('http')
      const url = isFullUrl
        ? item.download_url
        : (await getAssetDownloadUrl(item.download_url)) ?? '#'
      return { name: item.name, url }
    })
  )
}

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
    ?? req.nextUrl.searchParams.get('trxref')

  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }

  // Fetch order
  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('reference', reference)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Already verified — idempotent response
  if (order.status === 'paid') {
    const downloads = await buildDownloads(order.items as OrderItem[])
    return NextResponse.json({ status: 'paid', order, downloads })
  }

  // Verify with Paystack
  try {
    const tx = await verifyTransaction(reference)

    await supabaseAdmin
      .from('orders')
      .update({
        status:        'paid',
        paystack_data: tx,
        updated_at:    new Date().toISOString(),
      })
      .eq('reference', reference)

    const downloads = await buildDownloads(order.items as OrderItem[])
    return NextResponse.json({ status: 'paid', order, downloads })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed'
    console.error('[verify-payment] error:', err)

    await supabaseAdmin
      .from('orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('reference', reference)

    return NextResponse.json({ error: message }, { status: 402 })
  }
}
