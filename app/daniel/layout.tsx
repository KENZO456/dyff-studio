import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daniel Ochonogor — Artist, Author & Producer',
  description:
    'Artist, Author, Music Producer, and Sound Engineer based in Lagos, Nigeria. Creator of the ESE Universe and co-founder of DYFF Studio. Also known as Nobu Savage.',
  openGraph: {
    title: 'Daniel Ochonogor — Nobu Savage',
    description: 'Art. Sound. Story. Building worlds through every medium.',
    url: 'https://dyff-studio.vercel.app/daniel',
  },
}

export default function DanielLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
