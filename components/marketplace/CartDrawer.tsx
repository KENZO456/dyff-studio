'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'
import { productThumb } from '@/lib/marketplace-data'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}
function fmtUSD(n: number) {
  return '$' + n.toFixed(2)
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, itemCount, totalNGN, totalUSD, removeItem, updateQty, isOpen, closeCart } = useCart()
  const drawerRef  = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Slide in / out
  useEffect(() => {
    const drawer   = drawerRef.current
    const backdrop = backdropRef.current
    if (!drawer || !backdrop) return

    if (isOpen) {
      // Reveal backdrop + slide drawer in
      gsap.set(backdrop, { display: 'block' })
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' })
      gsap.fromTo(drawer,   { x: '100%' }, { x: '0%',   duration: 0.35, ease: 'power3.out' })
    } else {
      gsap.to(drawer,   { x: '100%', duration: 0.28, ease: 'power2.in' })
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: 'none',
        onComplete: () => gsap.set(backdrop, { display: 'none' }) })
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="cart-backdrop fixed inset-0 z-[60] bg-ink-void/70"
        style={{ display: 'none' }}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="cart-drawer fixed top-0 right-0 h-full z-[70] w-full max-w-md flex flex-col"
        aria-modal="true"
        role="dialog"
        aria-label="Your cart"
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="cart-drawer-header flex items-center justify-between px-6 py-5 border-b border-ink-ash/15 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-ink-green" />
            <Thunder as="h2" size="card" weight={400} className="text-ink-paper leading-none">
              YOUR CART
            </Thunder>
            {itemCount > 0 && (
              <span className="cart-count-badge">{itemCount}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-ink-ash hover:text-ink-paper transition-colors duration-150 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Item list ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
              <ShoppingBag size={40} className="text-ink-ash/20" />
              <Thunder as="p" size="card" weight={400} className="text-ink-paper/20 leading-none">
                EMPTY
              </Thunder>
              <Body size="sm" className="text-ink-ash/40">
                Add something from the marketplace.
              </Body>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item flex gap-3 items-start">
                {/* Thumbnail */}
                <img
                  src={productThumb(item.imageId, 80, 80)}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-sm shrink-0"
                  loading="lazy"
                />

                {/* Meta */}
                <div className="flex-1 min-w-0">
                  <Thunder as="h3" size="card" weight={400} className="text-ink-paper leading-tight mb-0.5 text-sm">
                    {item.title}
                  </Thunder>
                  <p className="font-mono text-ink-ash/50 text-[0.55rem] tracking-wide mb-2">
                    {item.subtitle}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="cart-qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="font-mono text-ink-paper text-[0.7rem] w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, +1)}
                      className="cart-qty-btn"
                      aria-label="Increase quantity"
                    >
                      <Plus size={10} />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-ink-ash/40 hover:text-ink-ember transition-colors duration-150 cursor-pointer"
                      aria-label={`Remove ${item.title}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right">
                  <p className="font-mono text-ink-paper text-[0.7rem] font-bold">
                    {fmtNGN(item.priceNGN * item.qty)}
                  </p>
                  <p className="font-mono text-ink-ash/40 text-[0.55rem] mt-0.5">
                    {fmtUSD(item.priceUSD * item.qty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className="cart-drawer-footer shrink-0 px-6 py-6 border-t border-ink-ash/15">
            {/* Subtotal */}
            <div className="flex items-end justify-between mb-5">
              <Label variant="tag" className="text-ink-ash/60">SUBTOTAL</Label>
              <div className="text-right">
                <p className="font-thunder text-ink-paper text-xl leading-none" style={{ fontWeight: 400 }}>
                  {fmtNGN(totalNGN)}
                </p>
                <p className="font-mono text-ink-ash/40 text-[0.6rem] mt-0.5">
                  ≈ {fmtUSD(totalUSD)}
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/marketplace/checkout"
              onClick={closeCart}
              className="ink-flood-up cart-checkout-btn block w-full text-center"
            >
              <span className="font-thunder uppercase text-ink-paper tracking-wide" style={{ fontWeight: 400, fontSize: '1.1rem' }}>
                PROCEED TO CHECKOUT
              </span>
            </Link>

            <p className="font-mono text-ink-ash/30 text-[0.5rem] text-center mt-3 tracking-[0.15em]">
              SECURE CHECKOUT · POWERED BY PAYSTACK
            </p>
          </div>
        )}
      </div>
    </>
  )
}
