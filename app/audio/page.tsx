import { getAudioSeries } from '@/lib/supabase'
import AudioPageClient from './AudioPageClient'

export default async function AudioPage() {
  const series = await getAudioSeries()
  return <AudioPageClient series={series} />
}
