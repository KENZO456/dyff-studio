// TODO: Initialize Paystack with your public key from https://dashboard.paystack.com
// TODO: For digital delivery, consider Lemon Squeezy: https://lemonsqueezy.com
// TODO: For Nigerian users, Paystack handles NGN natively — recommended
// Install: npm install @paystack/inline-js
//
// Basic Paystack flow:
//   import PaystackPop from '@paystack/inline-js'
//   const paystack = new PaystackPop()
//   paystack.newTransaction({
//     key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//     email: formData.email,
//     amount: totalNGN * 100,  // Paystack uses kobo (1/100 of NGN)
//     currency: 'NGN',
//     onSuccess: (transaction) => { /* handle delivery */ },
//     onCancel: () => { /* reset */ },
//   })

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Shield, Truck } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { productThumb } from '@/lib/marketplace-data'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNGN(n: number) { return '₦' + n.toLocaleString('en-NG') }
function fmtUSD(n: number) { return '$' + n.toFixed(2) }

const FIELD_AUTOCOMPLETE: Record<string, string> = {
  firstName: 'given-name',
  lastName:  'family-name',
  email:     'email',
  phone:     'tel',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, totalNGN, totalUSD, itemCount } = useCart()

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
  })

  const handleField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePaystack = () => {
    // TODO: Uncomment after: npm install @paystack/inline-js
    // import PaystackPop from '@paystack/inline-js'
    // const paystack = new PaystackPop()
    // paystack.newTransaction({
    //   key:      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    //   email:    form.email,
    //   amount:   totalNGN * 100,   // kobo
    //   currency: 'NGN',
    //   metadata: { items: JSON.stringify(items.map(i => ({ id: i.id, qty: i.qty }))) },
    //   onSuccess: (tx) => { console.log('Payment successful:', tx.reference) },
    //   onCancel:  ()   => { console.log('Payment cancelled') },
    // })
    alert('Paystack integration pending — add your public key to .env.local')
  }

  return (
    <main className="min-h-screen bg-ink-void pt-6 pb-24">
      <div className="max-w-5xl mx-auto px-5 md:px-10">

        {/* Back link */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.15em] uppercase hover:text-ink-paper transition-colors duration-150 mb-10"
        >
          <ArrowLeft size={12} />
          Back to Marketplace
        </Link>

        <Thunder as="h1" size="section" weight={400} className="text-ink-paper leading-none mb-10">
          CHECKOUT
        </Thunder>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── LEFT: Contact + Payment ──────────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Contact */}
            <section className="checkout-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[2px] h-5 bg-ink-green rounded-full shrink-0" />
                <Label variant="tag" className="text-ink-ash/70">CONTACT DETAILS</Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'firstName', label: 'First Name',    placeholder: 'Emeka'           },
                  { name: 'lastName',  label: 'Last Name',     placeholder: 'Okafor'          },
                  { name: 'email',     label: 'Email Address', placeholder: 'you@example.com' },
                  { name: 'phone',     label: 'Phone (optional)', placeholder: '+234 801 234 5678' },
                ].map(({ name, label, placeholder }) => (
                  <div key={name} className={name === 'email' || name === 'phone' ? 'sm:col-span-2' : ''}>
                    <label className="checkout-label" htmlFor={`field-${name}`}>{label}</label>
                    <input
                      id={`field-${name}`}
                      name={name}
                      type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                      value={form[name as keyof typeof form]}
                      onChange={handleField}
                      placeholder={placeholder}
                      className="checkout-input"
                      autoComplete={FIELD_AUTOCOMPLETE[name]}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery note */}
            <section className="checkout-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[2px] h-5 bg-ink-green rounded-full shrink-0" />
                <Label variant="tag" className="text-ink-ash/70">DELIVERY</Label>
              </div>
              <div className="flex items-start gap-3 p-4 bg-ink-dark/50 rounded-sm border border-ink-ash/10">
                <Truck size={16} className="text-ink-ash/50 shrink-0 mt-0.5" />
                <Body size="sm" className="text-ink-ash/60 leading-relaxed">
                  All DYFF products are <strong className="text-ink-paper/70">digital downloads</strong>.
                  A download link will be sent to your email address immediately after payment.
                  No shipping required.
                </Body>
              </div>
            </section>

            {/* Payment */}
            <section className="checkout-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[2px] h-5 bg-ink-green rounded-full shrink-0" />
                <Label variant="tag" className="text-ink-ash/70">PAYMENT</Label>
              </div>

              {/* Paystack badge */}
              <div className="flex items-center gap-3 p-4 bg-ink-dark/50 rounded-sm border border-ink-ash/10 mb-5">
                <Shield size={16} className="text-ink-green shrink-0" />
                <div>
                  <p className="font-mono text-ink-paper/70 text-[0.6rem] tracking-[0.15em] uppercase mb-0.5">
                    Secure Checkout
                  </p>
                  <p className="font-mono text-ink-ash/50 text-[0.55rem]">
                    Powered by Paystack · Cards · Bank Transfer · USSD · Mobile Money
                  </p>
                </div>
              </div>

              {/* Pay button */}
              <button
                type="button"
                onClick={handlePaystack}
                disabled={!form.email || itemCount === 0}
                className="checkout-pay-btn ink-flood-up w-full disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Pay ${fmtNGN(totalNGN)} with Paystack`}
              >
                <div className="flex items-center justify-center gap-3 py-4">
                  <Lock size={14} />
                  <span className="font-thunder uppercase tracking-wide checkout-pay-text">
                    PAY {fmtNGN(totalNGN)} WITH PAYSTACK
                  </span>
                </div>
              </button>

              {!form.email && (
                <p className="font-mono text-ink-ash/40 text-[0.53rem] mt-2 text-center tracking-wide">
                  Enter your email address to enable payment
                </p>
              )}
            </section>
          </div>

          {/* ── RIGHT: Order Summary ─────────────────────────────────────── */}
          <aside>
            <div className="checkout-section sticky top-[72px]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-[2px] h-5 bg-ink-green rounded-full shrink-0" />
                <Label variant="tag" className="text-ink-ash/70">ORDER SUMMARY</Label>
              </div>

              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <Body size="sm" className="text-ink-ash/40">Your cart is empty.</Body>
                  <Link href="/marketplace" className="font-mono text-ink-green text-[0.58rem] tracking-[0.12em] uppercase hover:text-ink-ember transition-colors duration-150 mt-2 inline-block">
                    Browse Marketplace →
                  </Link>
                </div>
              ) : (
                <>
                  {/* Item list */}
                  <div className="flex flex-col gap-3 mb-5">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={productThumb(item.imageId, 60, 60)}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-thunder text-ink-paper leading-tight text-sm truncate checkout-item-title">
                            {item.title}
                          </p>
                          <p className="font-mono text-ink-ash/40 text-[0.52rem] mt-0.5">
                            Qty {item.qty}
                          </p>
                        </div>
                        <p className="font-mono text-ink-paper text-[0.65rem] shrink-0">
                          {fmtNGN(item.priceNGN * item.qty)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-ink-ash/10 mb-4" />

                  {/* Totals */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.12em] uppercase">Subtotal</span>
                      <span className="font-mono text-ink-paper text-[0.65rem]">{fmtNGN(totalNGN)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.12em] uppercase">USD equiv.</span>
                      <span className="font-mono text-ink-ash/40 text-[0.58rem]">{fmtUSD(totalUSD)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.12em] uppercase">Delivery</span>
                      <span className="font-mono text-ink-green text-[0.58rem]">FREE (Digital)</span>
                    </div>
                  </div>

                  <div className="h-px bg-ink-ash/15 my-4" />

                  <div className="flex justify-between items-end">
                    <Label variant="tag" className="text-ink-ash/60">TOTAL</Label>
                    <div className="text-right">
                      <p className="font-thunder text-ink-paper leading-none checkout-total-size">
                        {fmtNGN(totalNGN)}
                      </p>
                      <p className="font-mono text-ink-ash/35 text-[0.55rem] mt-0.5">
                        ≈ {fmtUSD(totalUSD)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
