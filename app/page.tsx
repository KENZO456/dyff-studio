import HeroSection      from '@/components/sections/HeroSection'
import AboutSection     from '@/components/sections/AboutSection'
import WhatWeDoSection  from '@/components/sections/WhatWeDoSection'
import EseShowcase      from '@/components/sections/EseShowcase'
import CtaSection       from '@/components/sections/CtaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WhatWeDoSection />
      <EseShowcase />

      {/*
        CTA wrapper: must be exactly 100vh so the sticky CTA fills it
        and the footer (z-index: 10) slides up over it from below
      */}
      <div className="cta-scroll-wrapper">
        <CtaSection />
      </div>
    </>
  )
}
