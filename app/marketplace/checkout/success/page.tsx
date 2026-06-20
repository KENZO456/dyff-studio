'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, XCircle, Loader2 } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadLink = { name: string; url: string }
type PageState    = 'loading' | 'success' | 'error'

// ─── Inner component (needs searchParams) ─────────────────────────────────────

function SuccessInner() {
  const params    = useSearchParams()
  const reference = params.get('reference') ?? params.get('trxref') ?? ''
  const { clearCart } = useCart()

  const [state,     setState]     = useState<PageState>('loading')
  const [downloads, setDownloads] = useState<DownloadLink[]>([])
  const [errorMsg,  setErrorMsg]  = useState('')

  const verify = useCallback(async () => {
    if (!reference) {
      setErrorMsg('No payment reference found in the URL.')
      setState('error')
      return
    }
    try {
      const res  = await fetch(`/api/marketplace/verify-payment?reference=${encodeURIComponent(reference)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment verification failed')
      setDownloads(data.downloads ?? [])
      setState('success')
      clearCart()
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Verification failed')
      setState('error')
    }
  }, [reference, clearCart])

  useEffect(() => { verify() }, [verify])

  return (
    <main className="min-h-screen bg-ink-void flex items-center justify-center px-5 py-16">
      <div className="max-w-lg w-full">

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {state === 'loading' && (
          <div className="text-center py-20">
            <Loader2 size={40} className="text-ink-green animate-spin mx-auto mb-6" />
            <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none mb-3">
              VERIFYING PAYMENT
            </Thunder>
            <Body size="sm" className="text-ink-ash/50">
              Please wait while we confirm your payment…
            </Body>
          </div>
        )}

        {/* ── Success ─────────────────────────────────────────────────────── */}
        {state === 'success' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle size={28} className="text-ink-green shrink-0" />
              <Thunder as="h1" size="section" weight={400} className="text-ink-paper leading-none">
                PAYMENT CONFIRMED
              </Thunder>
            </div>

            {reference && (
              <p className="font-mono text-ink-ash/40 text-[0.58rem] tracking-[0.16em] uppercase mb-8">
                Ref: {reference}
              </p>
            )}

            {downloads.length > 0 ? (
              <div className="checkout-section mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-[2px] h-5 bg-ink-green rounded-full shrink-0" />
                  <Label variant="tag" className="text-ink-ash/70">YOUR DOWNLOADS</Label>
                </div>
                <div className="flex flex-col gap-3">
                  {downloads.map(({ name, url }) => (
                    <a
                      key={name}
                      href={url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 p-4 bg-ink-dark/50
                        border border-ink-ash/10 hover:border-ink-green/40
                        transition-colors duration-200 rounded-sm group"
                    >
                      <span className="font-thunder text-ink-paper text-sm leading-tight truncate">
                        {name}
                      </span>
                      <Download
                        size={15}
                        className="text-ink-ash/40 group-hover:text-ink-green shrink-0 transition-colors duration-200"
                      />
                    </a>
                  ))}
                </div>
                <p className="font-mono text-ink-ash/35 text-[0.53rem] tracking-wide mt-4">
                  Download links expire in 1 hour. A copy has been sent to your email.
                </p>
              </div>
            ) : (
              <div className="checkout-section mb-8">
                <Body size="sm" className="text-ink-ash/60 leading-relaxed">
                  Your download links have been sent to your email. Check your inbox
                  (and spam folder) in the next few minutes.
                </Body>
              </div>
            )}

            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 font-thunder uppercase text-ink-green
                border border-ink-green/50 px-6 py-3 text-[0.78rem] tracking-[0.24em]
                hover:bg-ink-green hover:text-ink-void hover:border-ink-green
                transition-all duration-200"
            >
              Back to Marketplace
            </Link>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {state === 'error' && (
          <div className="text-center py-20">
            <XCircle size={40} className="text-red-500/80 mx-auto mb-6" />
            <Thunder as="h2" size="section" weight={400} className="text-ink-paper leading-none mb-4">
              PAYMENT FAILED
            </Thunder>
            <Body size="sm" className="text-ink-ash/50 mb-10 leading-relaxed">
              {errorMsg}
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace/checkout"
                className="inline-flex items-center justify-center gap-2 font-thunder uppercase text-ink-green
                  border border-ink-green/50 px-6 py-3 text-[0.78rem] tracking-[0.24em]
                  hover:bg-ink-green hover:text-ink-void transition-all duration-200"
              >
                Try Again
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 font-thunder uppercase text-ink-paper/50
                  border border-ink-ash/20 px-6 py-3 text-[0.78rem] tracking-[0.24em]
                  hover:text-ink-paper hover:border-ink-ash/40 transition-all duration-200"
              >
                Back to Marketplace
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

// ─── Page export: wrap in Suspense for useSearchParams ───────────────────────

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ink-void flex items-center justify-center">
        <Loader2 size={36} className="text-ink-green animate-spin" />
      </main>
    }>
      <SuccessInner />
    </Suspense>
  )
}
