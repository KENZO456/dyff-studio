import { notFound } from 'next/navigation'
import { getBookBySlug, getBooks } from '@/lib/notion'
import BookReader from './BookReader'

// Only serve slugs that exist in Notion — reject all others with 404
export const dynamicParams = false

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map(b => ({ slug: b.slug }))
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug)
  if (!book) return notFound()
  return <BookReader book={book} />
}
