import HeroSection    from '@/components/sections/HeroSection'
import ProductionGrid from '@/components/sections/ProductionGrid'
import AboutSection   from '@/components/sections/AboutSection'
import EseShowcase    from '@/components/sections/EseShowcase'
import CtaSection     from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductionGrid />
      <AboutSection />
      <EseShowcase />

      {/*
        CTA wrapper: must be exactly 100vh so the sticky CTA fills it
        and the footer (z-index: 10) slides up over it from below
      */}
      <div style={{ position: 'relative', height: '100vh' }}>
        <CtaSection />
      </div>
    </>
  )
}
