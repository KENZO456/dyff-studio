import { getMarketplaceProducts } from '@/lib/notion'
import MarketplaceClient from './MarketplaceClient'

export default async function MarketplacePage() {
  const products = await getMarketplaceProducts()
  return <MarketplaceClient initialProducts={products} />
}
