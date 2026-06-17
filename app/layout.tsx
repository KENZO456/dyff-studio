import type { Metadata } from 'next'
import { Libre_Baskerville, Space_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import SmoothScroll    from '@/components/ui/SmoothScroll'
import Navbar          from '@/components/ui/Navbar'
import Footer          from '@/components/ui/Footer'
import PageTransition  from '@/components/ui/PageTransition'

const libreBaskerville = Libre_Baskerville({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  variable: '--font-baskerville',
})

const spaceMono = Space_Mono({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  variable: '--font-space-mono',
})

// Lazy-load — never SSR'd; browser-only APIs (Three.js, mouse events, sessionStorage)
const InkUniverse   = dynamic(() => import('@/components/three/InkUniverse'),   { ssr: false, loading: () => null })
const CustomCursor  = dynamic(() => import('@/components/ui/CustomCursor'),     { ssr: false })
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'),    { ssr: false })

// TODO: Replace metadataBase with your live domain once deployed
export const metadata: Metadata = {
  metadataBase: new URL('https://dyff.studio'),
  title: {
    template: '%s — DYFF Studios',
    default:  'DYFF Studios',
  },
  description: 'Ideas are ticking time bombs waiting to set off.',
  openGraph: {
    type:        'website',
    siteName:    'DYFF Studios',
    title:       'DYFF Studios',
    description: 'Ideas are ticking time bombs waiting to set off.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'DYFF Studios' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'DYFF Studios',
    description: 'Ideas are ticking time bombs waiting to set off.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${spaceMono.variable}`}>
      <body className="font-thunder font-light bg-ink-void text-ink-paper">

        {/* First-visit loading animation (sessionStorage-gated) */}
        <LoadingScreen />

        {/* Custom cursor — hidden on touch devices via CSS */}
        <CustomCursor />

        {/* Persistent 3D ink background — behind all content */}
        <InkUniverse />

        {/* Skip to main content — visually hidden, revealed on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
            focus:z-[9999] focus:px-4 focus:py-2 focus:bg-ink-void focus:text-ink-green
            focus:border focus:border-ink-green focus:rounded-sm focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>

        {/* Ink panel page transition — wraps scroll context + page content */}
        <PageTransition>
          <SmoothScroll>
            <div className="content-layer">
              <Navbar />
              <main id="main-content">
                {children}
              </main>
              <Footer />
            </div>
          </SmoothScroll>
        </PageTransition>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
