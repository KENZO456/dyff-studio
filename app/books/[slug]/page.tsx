import { notFound } from 'next/navigation'
import { getBookSlugs, getBookWithChapters } from '@/lib/supabase'
import BookReader from './BookReader'

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getBookSlugs()
  return slugs.map(slug => ({ slug }))
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const result = await getBookWithChapters(params.slug)
  if (!result) return notFound()
  return <BookReader book={result.book} chapters={result.chapters} />
}
