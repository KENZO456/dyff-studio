import { notFound } from 'next/navigation'
import { getBook } from '@/lib/books-data'
import BookReader from './BookReader'

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = getBook(params.slug)
  if (!book) notFound()
  return <BookReader book={book} />
}

export function generateStaticParams() {
  return [
    { slug: 'legend-of-leviticus' },
    { slug: 'ese' },
  ]
}
