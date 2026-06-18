'use client'

import {
  createContext, useContext, useRef, useState,
  useCallback, useEffect,
  type ReactNode, type RefObject,
} from 'react'
import type { Product } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem extends Product { qty: number }

interface CartContextValue {
  items:        CartItem[]
  itemCount:    number
  totalNGN:     number
  totalUSD:     number
  addItem:      (product: Product) => void
  removeItem:   (id: string) => void
  updateQty:    (id: string, delta: number) => void  // +1 or -1
  clearCart:    () => void
  isOpen:       boolean
  openCart:     () => void
  closeCart:    () => void
  /** Ref to the cart icon button — registered by MarketplaceHeader, read by ProductCard */
  cartIconRef:  RefObject<HTMLButtonElement>
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'dyff-cart-v1'

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items,  setItems]  = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const cartIconRef         = useRef<HTMLButtonElement>(null)

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw) as CartItem[])
    } catch {
      // corrupted storage — ignore
    }
  }, [])

  // ── Persist on every change ──────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // ── Computed ─────────────────────────────────────────────────────────────
  const itemCount = items.reduce((n, i) => n + i.qty, 0)
  const totalNGN  = items.reduce((n, i) => n + i.price_ngn * i.qty, 0)
  const totalUSD  = items.reduce((n, i) => n + i.price_usd * i.qty, 0)

  // ── Actions ──────────────────────────────────────────────────────────────
  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const openCart  = useCallback(() => setIsOpen(true),  [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider value={{
      items, itemCount, totalNGN, totalUSD,
      addItem, removeItem, updateQty, clearCart,
      isOpen, openCart, closeCart,
      cartIconRef,
    }}>
      {children}
    </CartContext.Provider>
  )
}
