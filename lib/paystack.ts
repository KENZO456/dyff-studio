const BASE   = 'https://api.paystack.co'
const SECRET = process.env.PAYSTACK_SECRET_KEY!

function headers() {
  return {
    Authorization:  `Bearer ${SECRET}`,
    'Content-Type': 'application/json',
  }
}

export interface PaystackInitData {
  authorization_url: string
  access_code:       string
  reference:         string
}

export interface PaystackTxData {
  id:        number
  status:    string
  reference: string
  amount:    number
  currency:  string
  paid_at:   string
  customer:  { email: string; first_name?: string; last_name?: string }
  metadata:  Record<string, unknown>
}

/** Initialize a Paystack transaction. Returns the redirect URL. */
export async function initializeTransaction(opts: {
  email:        string
  amount:       number                      // in kobo (NGN × 100)
  reference:    string
  callback_url: string
  metadata?:    Record<string, unknown>
}): Promise<PaystackInitData> {
  const res  = await fetch(`${BASE}/transaction/initialize`, {
    method: 'POST',
    headers: headers(),
    body:   JSON.stringify(opts),
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message ?? 'Paystack init failed')
  return json.data as PaystackInitData
}

/** Verify a Paystack transaction. Throws if payment is not successful. */
export async function verifyTransaction(reference: string): Promise<PaystackTxData> {
  const res  = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${SECRET}` },
    cache:  'no-store',
  })
  const json = await res.json()
  if (!json.status)                     throw new Error(json.message ?? 'Verification failed')
  if (json.data.status !== 'success')   throw new Error('Payment was not successful')
  return json.data as PaystackTxData
}
