import { getBooks } from '@/lib/supabase'
import BooksClient from './BooksClient'

export default async function BooksPage() {
  const books = await getBooks()
  return <BooksClient books={books} />
}
