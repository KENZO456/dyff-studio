import CartProvider from '@/contexts/CartContext'
import CartDrawer   from '@/components/marketplace/CartDrawer'
import MarketplaceHeader from './MarketplaceHeader'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Sticky top nav with cart icon — 56px tall, fixed */}
      <MarketplaceHeader />

      {/* Cart drawer — renders as portal-like fixed overlay */}
      <CartDrawer />

      {/* Page content offset below the fixed header */}
      <div className="pt-14">
        {children}
      </div>
    </CartProvider>
  )
}
