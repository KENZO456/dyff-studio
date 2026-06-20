'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Thunder, Body, Label } from '@/components/ui/Typography'
import { useCart } from '@/contexts/CartContext'

function fmtNGN(n: number) { return '₦' + n.toLocaleString('en-NG') }
function fmtUSD(n: number) { return '$' + n.toFixed(2) }

export default function CartDrawer() {
  const { items, itemCount, totalNGN, totalUSD, removeItem, updateQty, isOpen, closeCart } = useCart()
  const drawerRef   = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const drawer   = drawerRef.current
    const backdrop = backdropRef.current
    if (!drawer || !backdrop) return

    if (isOpen) {
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
        className="fixed inset-0 z-[60] bg-ink-void/70"
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
        {/* Header */}
        <div className="cart-drawer-header flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-ink-green" />
            <Thunder as="h2" size="card" weight={400} className="text-white leading-none">
              YOUR CART
            </Thunder>
            {itemCount > 0 && (
              <span className="cart-count-badge">{itemCount}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-150 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
              <ShoppingBag size={40} className="text-white/20" />
              <Thunder as="p" size="card" weight={400} className="text-white/30 leading-none">
                EMPTY
              </Thunder>
              <Body size="sm" className="text-white/50">
                Add something from the marketplace.
              </Body>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="cart-item flex gap-3 items-start">
                <div className="w-16 h-16 relative rounded-sm overflow-hidden shrink-0">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>

                <div className="flex-1 min-w-0">
                  <Thunder as="h3" size="card" weight={400} className="text-white leading-tight mb-2 text-sm">
                    {item.name}
                  </Thunder>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="cart-qty-btn" aria-label="Decrease quantity">
                      <Minus size={10} />
                    </button>
                    <span className="font-mono text-white text-[0.7rem] w-5 text-center">
                      {item.qty}
                    </span>
                    <button onClick={() => updateQty(item.id, +1)} className="cart-qty-btn" aria-label="Increase quantity">
                      <Plus size={10} />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-white/40 hover:text-red-400 transition-colors duration-150 cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-mono text-white text-[0.7rem]">
                    {fmtNGN(item.price_ngn * item.qty)}
                  </p>
                  <p className="font-mono text-white/50 text-[0.55rem] mt-0.5">
                    {fmtUSD(item.price_usd * item.qty)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer shrink-0 px-6 py-6 border-t border-white/10">
            <div className="flex items-end justify-between mb-5">
              <Label variant="tag" className="text-white/70">SUBTOTAL</Label>
              <div className="text-right">
                <p className="font-thunder text-white text-xl leading-none" style={{ fontWeight: 400 }}>
                  {fmtNGN(totalNGN)}
                </p>
                <p className="font-mono text-white/50 text-[0.6rem] mt-0.5">
                  ≈ {fmtUSD(totalUSD)}
                </p>
              </div>
            </div>

            <Link
              href="/marketplace/checkout"
              onClick={closeCart}
              className="ink-flood-up cart-checkout-btn block w-full text-center"
            >
              <span className="font-thunder uppercase text-white tracking-wide" style={{ fontWeight: 400, fontSize: '1.1rem' }}>
                PROCEED TO CHECKOUT
              </span>
            </Link>

            <p className="font-mono text-white/40 text-[0.5rem] text-center mt-3 tracking-[0.15em]">
              SECURE CHECKOUT · POWERED BY PAYSTACK
            </p>
          </div>
        )}
      </div>
    </>
  )
}
