import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { initializeTransaction } from '@/lib/paystack'

interface OrderItem {
  id:           string
  name:         string
  qty:          number
  price_ngn:    number
  price_usd:    number
  download_url: string
}

interface OrderForm {
  firstName: string
  lastName:  string
  email:     string
  phone?:    string
}

function uid() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 14)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      form:     OrderForm
      items:    OrderItem[]
      totalNGN: number
      totalUSD: number
    }

    const { form, items, totalNGN, totalUSD } = body

    if (!form?.email || !items?.length || !totalNGN) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Stable reference: dyff- + 14 hex chars
    const reference    = `dyff-${uid()}`
    const origin       = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? ''
    const callback_url = `${origin}/marketplace/checkout/success`

    // 1 — Create pending order in Supabase
    const { error: dbError } = await supabaseAdmin.from('orders').insert({
      reference,
      email:      form.email,
      first_name: form.firstName,
      last_name:  form.lastName,
      phone:      form.phone || null,
      items:      items.map(i => ({
        id:           i.id,
        name:         i.name,
        qty:          i.qty,
        price_ngn:    i.price_ngn,
        price_usd:    i.price_usd,
        download_url: i.download_url,
      })),
      total_ngn:  totalNGN,
      total_usd:  totalUSD,
      status:     'pending',
    })

    if (dbError) {
      console.error('[orders] db insert error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // 2 — Initialize Paystack transaction
    const tx = await initializeTransaction({
      email:        form.email,
      amount:       totalNGN * 100,   // NGN → kobo
      reference,
      callback_url,
      metadata: {
        reference,
        customer_name: `${form.firstName} ${form.lastName}`,
        phone:         form.phone ?? '',
      },
    })

    return NextResponse.json({ authorization_url: tx.authorization_url, reference })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error'
    console.error('[orders] error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
