import { notFound } from 'next/navigation'
import { getBookBySlug, getBooks } from '@/lib/notion'
import BookReader from './BookReader'

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map(b => ({ slug: b.slug }))
}

export default async function BookPage({ params }: { params: { slug: string } }) {
  const book = await getBookBySlug(params.slug)
  if (!book) notFound()
  return <BookReader book={book} />
}
