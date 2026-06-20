import { getAudioSeries } from '@/lib/supabase'
import AudioPageClient from './AudioPageClient'

export const revalidate = 60

export default async function AudioPage() {
  const series = await getAudioSeries()
  return <AudioPageClient series={series} />
}
