import { getAudioSeries } from '@/lib/notion'
import { notFound } from 'next/navigation'
import SeriesClient from './SeriesClient'

export const dynamicParams = false

export async function generateStaticParams() {
  const all = await getAudioSeries()
  return all.map(s => ({ series: s.slug }))
}

export default async function SeriesPage({ params }: { params: { series: string } }) {
  const all = await getAudioSeries()
  const series = all.find(s => s.slug === params.series)
  if (!series) return notFound()
  return <SeriesClient series={series} />
}
