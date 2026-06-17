import { getBooks } from '@/lib/notion'
import BooksClient from './BooksClient'

export default async function BooksPage() {
  const books = await getBooks()
  return <BooksClient books={books} />
}
