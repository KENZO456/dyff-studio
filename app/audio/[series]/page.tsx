import { getAudioSeries, getAllAudioSlugs } from '@/lib/audio-data'
import { notFound } from 'next/navigation'
import SeriesClient from './SeriesClient'

export function generateStaticParams() {
  return getAllAudioSlugs().map(slug => ({ series: slug }))
}

export default function SeriesPage({ params }: { params: { series: string } }) {
  const series = getAudioSeries(params.series)
  if (!series) notFound()
  return <SeriesClient series={series} />
}
