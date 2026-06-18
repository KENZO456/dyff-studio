import { getProducts } from '@/lib/supabase'
import MarketplaceClient from './MarketplaceClient'

export default async function MarketplacePage() {
  const products = await getProducts()
  return <MarketplaceClient initialProducts={products} />
}
