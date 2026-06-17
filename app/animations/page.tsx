import { getAnimations } from '@/lib/notion'
import AnimationsClient from './AnimationsClient'

export default async function AnimationsPage() {
  const animations = await getAnimations()
  return <AnimationsClient animations={animations} />
}
