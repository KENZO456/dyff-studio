import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kenny Ochonogor — Creative Full Stack Developer',
  description:
    'Creative Full Stack Developer, UI/UX Designer, and Brand Experience Designer based in Lagos, Nigeria. Co-founder of DYFF Studio.',
  openGraph: {
    title: 'Kenny Ochonogor — Portfolio',
    description: 'Building digital experiences at the intersection of engineering and art.',
    url: 'https://dyff-studio.vercel.app/kenny',
  },
}

export default function KennyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
