import { getAudioSeries, getSeriesWithEpisodes } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import SeriesClient from './SeriesClient'

export const dynamicParams = true
export const revalidate = 60

export async function generateStaticParams() {
  const all = await getAudioSeries()
  return all.map(s => ({ series: s.slug }))
}

export default async function SeriesPage({ params }: { params: { series: string } }) {
  const result = await getSeriesWithEpisodes(params.series)
  if (!result) return notFound()
  return <SeriesClient series={result.series} episodes={result.episodes} />
}
