import { getAnimations } from '@/lib/supabase'
import AnimationsClient from './AnimationsClient'

export const revalidate = 60

export default async function AnimationsPage() {
  const animations = await getAnimations()
  return <AnimationsClient animations={animations} />
}
