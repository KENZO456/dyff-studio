import { getProducts } from '@/lib/supabase'
import MarketplaceClient from './MarketplaceClient'

export const revalidate = 60

export default async function MarketplacePage() {
  const products = await getProducts()
  return <MarketplaceClient initialProducts={products} />
}
