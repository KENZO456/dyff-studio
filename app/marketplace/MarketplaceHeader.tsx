'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function MarketplaceHeader() {
  const { itemCount, openCart, cartIconRef } = useCart()

  return (
    <header className="market-header">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 mr-auto">
        <span className="font-thunder uppercase text-ink-paper leading-none tracking-tight market-brand-text">
          DYFF
        </span>
        <span className="font-mono text-ink-ash/50 text-[0.5rem] tracking-[0.2em] uppercase hidden sm:block">
          STUDIO
        </span>
        <span className="font-mono text-ink-ash/30 text-[0.5rem] mx-2 hidden sm:block">/</span>
        <span className="font-mono text-ink-ash/60 text-[0.5rem] tracking-[0.2em] uppercase hidden sm:block">
          MARKETPLACE
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-6 mr-6">
        {['Books', 'Audio', 'Animations'].map(label => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
            className="font-mono text-ink-ash/50 text-[0.58rem] tracking-[0.15em] uppercase hover:text-ink-paper transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Cart icon — ref registered here for GSAP fly-to-cart */}
      <button
        type="button"
        ref={cartIconRef}
        onClick={openCart}
        className="market-cart-btn"
        aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
      >
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span className="cart-count-badge" aria-live="polite">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </button>
    </header>
  )
}
